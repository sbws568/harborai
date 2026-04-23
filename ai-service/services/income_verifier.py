"""
Perfios income verification integration.

Perfios analyzes 6-12 months of bank statements to produce a verified
income and cash-flow report. Used to supplement or corroborate
customer-stated income during hardship assessment.
"""
import logging
from datetime import datetime
from typing import Optional

import httpx

from config import settings
from models.hardship import IncomeVerificationData

logger = logging.getLogger(__name__)


_MOCK_PERFIOS_RESPONSE = IncomeVerificationData(
    source="perfios",
    monthly_income_inr=42000.0,
    income_stability=0.72,        # 72% stable (some variable income)
    months_analyzed=6,
    average_bank_balance=18500.0,
    average_monthly_obligations=31000.0,
    net_disposable_income=11000.0,
    dti_ratio=0.74,               # High DTI — financial stress visible
    verified=True,
    verification_date=datetime.utcnow().strftime("%Y-%m-%d"),
)


class PerfiosClient:
    """
    Perfios Bank Statement Analyzer API client.

    Real integration flow:
    1. Create a transaction (POST /transactions) → get transaction_id + upload_url
    2. Customer uploads bank statements to upload_url (PDF or net-banking XML)
    3. Poll for processing (GET /transactions/{id}/status)
    4. Fetch the income report (GET /transactions/{id}/income-report)
    """

    BASE_URL = settings.perfios_api_url

    def __init__(self) -> None:
        self._headers = {
            "Authorization": f"Bearer {settings.perfios_api_key}",
            "Content-Type": "application/json",
            "X-Institution-Id": settings.perfios_institution_id,
        }

    async def create_verification_transaction(
        self,
        customer_id: str,
        mobile: str,
        months: int = 6,
    ) -> dict:
        """
        Step 1: Initiate a Perfios verification transaction.
        Returns transaction_id and a signed upload URL for the customer.
        """
        if settings.mock_integrations:
            return {
                "transaction_id": f"perf_mock_{customer_id}",
                "upload_url": "https://upload.perfios.com/mock/upload",
                "status": "INITIATED",
            }

        payload = {
            "customerId": customer_id,
            "mobileNumber": mobile,
            "numberOfMonths": months,
            "reportType": "INCOME_REPORT",
            "purpose": "HARDSHIP_ASSESSMENT",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{self.BASE_URL}/transactions",
                json=payload,
                headers=self._headers,
            )
            resp.raise_for_status()
            return resp.json()

    async def get_income_report(
        self,
        transaction_id: str,
    ) -> IncomeVerificationData:
        """
        Step 3/4: Fetch the processed income report for a transaction.
        """
        if settings.mock_integrations:
            logger.info("Perfios [MOCK] returning synthetic income report")
            return _MOCK_PERFIOS_RESPONSE

        async with httpx.AsyncClient(timeout=30.0) as client:
            # Check status first
            status_resp = await client.get(
                f"{self.BASE_URL}/transactions/{transaction_id}/status",
                headers=self._headers,
            )
            status_resp.raise_for_status()
            status_data = status_resp.json()

            if status_data.get("status") not in ("COMPLETED", "PROCESSED"):
                raise ValueError(
                    f"Perfios transaction not ready: {status_data.get('status')}"
                )

            # Fetch the income report
            report_resp = await client.get(
                f"{self.BASE_URL}/transactions/{transaction_id}/income-report",
                headers=self._headers,
            )
            report_resp.raise_for_status()
            data = report_resp.json()

        return self._parse_income_report(data)

    def _parse_income_report(self, data: dict) -> IncomeVerificationData:
        income = data.get("incomeDetails", {})
        cash_flow = data.get("cashFlowSummary", {})

        monthly_income = float(income.get("averageMonthlyIncome", 0))
        obligations = float(cash_flow.get("averageMonthlyDebitForEMI", 0))
        net_disposable = monthly_income - obligations

        return IncomeVerificationData(
            source="perfios",
            monthly_income_inr=monthly_income,
            income_stability=float(income.get("incomeStabilityScore", 0)) / 100,
            months_analyzed=int(data.get("numberOfMonthsAnalyzed", 0)),
            average_bank_balance=float(cash_flow.get("averageMonthlyBalance", 0)),
            average_monthly_obligations=obligations,
            net_disposable_income=net_disposable,
            dti_ratio=obligations / monthly_income if monthly_income > 0 else 1.0,
            verified=True,
            verification_date=datetime.utcnow().strftime("%Y-%m-%d"),
        )


class IncomeVerificationService:
    """High-level income verification orchestrator."""

    def __init__(self) -> None:
        self.perfios = PerfiosClient()

    async def initiate(self, customer_id: str, mobile: str) -> dict:
        """Start the verification flow. Returns upload instructions for customer."""
        return await self.perfios.create_verification_transaction(
            customer_id=customer_id,
            mobile=mobile,
        )

    async def get_result(self, transaction_id: str) -> Optional[IncomeVerificationData]:
        """Retrieve the verified income report once Perfios has processed it."""
        try:
            return await self.perfios.get_income_report(transaction_id)
        except Exception as exc:
            logger.warning("Perfios income report fetch failed: %s", exc)
            return None

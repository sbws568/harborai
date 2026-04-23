"""
Credit bureau integration for Experian India and CIBIL (TransUnion).

Real API mode requires MOCK_INTEGRATIONS=false and valid credentials.
Mock mode returns realistic synthetic data for development/testing.
"""
import logging
from datetime import datetime
from typing import Optional

import httpx

from config import settings
from models.hardship import CreditBureauData

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Mock responses
# ---------------------------------------------------------------------------

_MOCK_EXPERIAN_RESPONSE = CreditBureauData(
    bureau="experian",
    credit_score=642,
    dpd_history=[0, 0, 30, 30, 60, 0, 0, 0, 0, 0, 0, 0],  # 12 months
    total_active_loans=2,
    total_outstanding=485000.0,
    write_off_history=False,
    settled_accounts=0,
    report_date=datetime.utcnow().strftime("%Y-%m-%d"),
    consent_granted=True,
    raw_summary=(
        "Customer has a credit score of 642 (Fair). Shows two active loan accounts "
        "with total outstanding of ₹4,85,000. Had 30 DPD in months 3-4 and 60 DPD "
        "in month 5 of the past 12 months, suggesting recent payment stress. No "
        "write-offs or settled accounts on record."
    ),
)

_MOCK_CIBIL_RESPONSE = CreditBureauData(
    bureau="cibil",
    credit_score=638,
    dpd_history=[0, 0, 30, 60, 90, 0, 0, 0, 0, 0, 0, 0],
    total_active_loans=2,
    total_outstanding=490000.0,
    write_off_history=False,
    settled_accounts=0,
    report_date=datetime.utcnow().strftime("%Y-%m-%d"),
    consent_granted=True,
    raw_summary=(
        "CIBIL score of 638. Corroborates Experian data. Payment irregularity "
        "visible in months 3-5 with DPD escalating to 90 days, followed by "
        "recovery. No adverse remarks or write-off history."
    ),
)


# ---------------------------------------------------------------------------
# Experian India Integration
# ---------------------------------------------------------------------------

class ExperianClient:
    """Experian India Credit Information Report API client."""

    BASE_URL = settings.experian_api_url

    def __init__(self) -> None:
        self._headers = {
            "Authorization": f"Bearer {settings.experian_api_key}",
            "Content-Type": "application/json",
            "X-Client-Id": settings.experian_client_id,
        }

    async def get_credit_report(
        self,
        pan: str,
        mobile: str,
        name: str,
        dob: str,
    ) -> CreditBureauData:
        if settings.mock_integrations:
            logger.info("Experian [MOCK] returning synthetic credit report")
            return _MOCK_EXPERIAN_RESPONSE

        payload = {
            "pan": pan,
            "mobile": mobile,
            "name": name,
            "dateOfBirth": dob,
            "inquiryPurpose": "HARDSHIP_ASSESSMENT",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{self.BASE_URL}/consumer/enquiry",
                json=payload,
                headers=self._headers,
            )
            resp.raise_for_status()
            data = resp.json()

        return self._parse_response(data)

    def _parse_response(self, data: dict) -> CreditBureauData:
        """Parse Experian API response into CreditBureauData."""
        score_block = data.get("creditScore", {})
        accounts = data.get("accounts", [])

        dpd_history = []
        total_outstanding = 0.0
        for acct in accounts:
            if acct.get("accountStatus") == "ACTIVE":
                total_outstanding += float(acct.get("currentBalance", 0))
                dpd_history.extend(acct.get("dpdHistory", []))

        return CreditBureauData(
            bureau="experian",
            credit_score=int(score_block.get("score", 0)),
            dpd_history=dpd_history[:12],
            total_active_loans=sum(
                1 for a in accounts if a.get("accountStatus") == "ACTIVE"
            ),
            total_outstanding=total_outstanding,
            write_off_history=any(
                a.get("accountStatus") == "WRITTEN_OFF" for a in accounts
            ),
            settled_accounts=sum(
                1 for a in accounts if a.get("accountStatus") == "SETTLED"
            ),
            report_date=datetime.utcnow().strftime("%Y-%m-%d"),
            consent_granted=True,
            raw_summary=self._generate_summary(score_block, accounts),
        )

    def _generate_summary(self, score_block: dict, accounts: list) -> str:
        score = score_block.get("score", "N/A")
        active = sum(1 for a in accounts if a.get("accountStatus") == "ACTIVE")
        return (
            f"Experian credit score: {score}. Active accounts: {active}. "
            f"Report generated for hardship assessment purposes."
        )


# ---------------------------------------------------------------------------
# CIBIL (TransUnion) Integration
# ---------------------------------------------------------------------------

class CIBILClient:
    """CIBIL TransUnion Credit Report API client."""

    BASE_URL = settings.cibil_api_url

    def __init__(self) -> None:
        self._headers = {
            "Authorization": f"Bearer {settings.cibil_api_key}",
            "Content-Type": "application/json",
            "X-Client-Id": settings.cibil_client_id,
        }

    async def get_credit_report(
        self,
        pan: str,
        mobile: str,
        name: str,
        dob: str,
    ) -> CreditBureauData:
        if settings.mock_integrations:
            logger.info("CIBIL [MOCK] returning synthetic credit report")
            return _MOCK_CIBIL_RESPONSE

        payload = {
            "inquiryDetails": {
                "pan": pan,
                "mobileNumber": mobile,
                "consumerFullName": name,
                "dateOfBirth": dob,
                "inquiryPurpose": "10",  # CIBIL code for account review
            }
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{self.BASE_URL}/inquiry",
                json=payload,
                headers=self._headers,
            )
            resp.raise_for_status()
            data = resp.json()

        return self._parse_response(data)

    def _parse_response(self, data: dict) -> CreditBureauData:
        score = data.get("tuefHeader", {}).get("score", 0)
        accounts = data.get("accountSection", {}).get("accountDetails", [])

        total_outstanding = sum(
            float(a.get("currentBalance", 0)) for a in accounts
            if a.get("accountStatus") == "Active"
        )

        return CreditBureauData(
            bureau="cibil",
            credit_score=int(score),
            dpd_history=[],  # parse from payment history grid
            total_active_loans=sum(
                1 for a in accounts if a.get("accountStatus") == "Active"
            ),
            total_outstanding=total_outstanding,
            write_off_history=any(
                a.get("accountStatus") == "Written Off" for a in accounts
            ),
            settled_accounts=sum(
                1 for a in accounts if a.get("accountStatus") == "Settled"
            ),
            report_date=datetime.utcnow().strftime("%Y-%m-%d"),
            consent_granted=True,
            raw_summary=f"CIBIL score: {score}. Fetched for hardship resolution assessment.",
        )


# ---------------------------------------------------------------------------
# Unified bureau service
# ---------------------------------------------------------------------------

class CreditBureauService:
    """Fetches from both bureaus and merges results."""

    def __init__(self) -> None:
        self.experian = ExperianClient()
        self.cibil = CIBILClient()

    async def fetch_reports(
        self,
        pan: str,
        mobile: str,
        name: str,
        dob: str,
        consent_granted: bool = False,
    ) -> tuple[Optional[CreditBureauData], Optional[CreditBureauData]]:
        if not consent_granted:
            raise PermissionError(
                "Customer consent is required before pulling credit bureau data."
            )

        experian_data: Optional[CreditBureauData] = None
        cibil_data: Optional[CreditBureauData] = None

        try:
            experian_data = await self.experian.get_credit_report(pan, mobile, name, dob)
        except Exception as exc:
            logger.warning("Experian fetch failed: %s", exc)

        try:
            cibil_data = await self.cibil.get_credit_report(pan, mobile, name, dob)
        except Exception as exc:
            logger.warning("CIBIL fetch failed: %s", exc)

        return experian_data, cibil_data

    def best_score(
        self,
        experian: Optional[CreditBureauData],
        cibil: Optional[CreditBureauData],
    ) -> Optional[int]:
        """Return the higher of the two bureau scores (industry practice)."""
        scores = [
            b.credit_score for b in [experian, cibil]
            if b and b.credit_score
        ]
        return max(scores) if scores else None

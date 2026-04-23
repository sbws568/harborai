from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class HardshipReason(str, Enum):
    JOB_LOSS = "job_loss"
    MEDICAL_EMERGENCY = "medical_emergency"
    REDUCED_INCOME = "reduced_income"
    BUSINESS_LOSS = "business_loss"
    NATURAL_DISASTER = "natural_disaster"
    DEATH_IN_FAMILY = "death_in_family"
    DIVORCE_SEPARATION = "divorce_separation"
    OTHER = "other"
    UNKNOWN = "unknown"


class IntentClass(str, Enum):
    WILLING_PAYER = "willing_payer"       # Wants to pay, just can't right now
    PARTIAL_PAYER = "partial_payer"       # Can pay something but not full amount
    NON_PAYER = "non_payer"              # Unwilling or unable to pay
    UNKNOWN = "unknown"


class IncomeSource(str, Enum):
    SALARIED = "salaried"
    SELF_EMPLOYED = "self_employed"
    BUSINESS = "business"
    PENSION = "pension"
    RENTAL = "rental"
    FAMILY_SUPPORT = "family_support"
    GOVERNMENT_BENEFIT = "government_benefit"
    NO_INCOME = "no_income"
    UNKNOWN = "unknown"


class ProductType(str, Enum):
    CREDIT_CARD = "credit_card"
    PERSONAL_LOAN = "personal_loan"
    HOME_LOAN = "home_loan"
    AUTO_LOAN = "auto_loan"
    BUSINESS_LOAN = "business_loan"
    GOLD_LOAN = "gold_loan"
    OTHER = "other"
    UNKNOWN = "unknown"


class CreditBureauData(BaseModel):
    bureau: str  # "experian" | "cibil"
    credit_score: Optional[int] = None          # e.g. 750
    dpd_history: Optional[list[int]] = None     # Days past due last 12 months
    total_active_loans: Optional[int] = None
    total_outstanding: Optional[float] = None   # INR
    write_off_history: bool = False
    settled_accounts: int = 0
    report_date: Optional[str] = None
    consent_granted: bool = False
    raw_summary: Optional[str] = None           # LLM-friendly summary


class IncomeVerificationData(BaseModel):
    source: str = "perfios"
    monthly_income_inr: Optional[float] = None
    income_stability: Optional[float] = None   # 0-1, higher is more stable
    months_analyzed: int = 0
    average_bank_balance: Optional[float] = None
    average_monthly_obligations: Optional[float] = None
    net_disposable_income: Optional[float] = None
    dti_ratio: Optional[float] = None          # Debt-to-income ratio
    verified: bool = False
    verification_date: Optional[str] = None


class HardshipAssessment(BaseModel):
    """Structured data extracted from the conversation."""
    # Core parameters
    affected_by_disaster: Optional[bool] = None
    disaster_type: Optional[str] = None
    hardship_reason: HardshipReason = HardshipReason.UNKNOWN
    hardship_reason_detail: Optional[str] = None

    intent_to_pay: IntentClass = IntentClass.UNKNOWN
    intent_signals: list[str] = Field(default_factory=list)  # Evidence from conversation

    hardship_duration_months: Optional[int] = None  # Estimated months of hardship
    duration_certainty: Optional[str] = None         # "temporary" | "ongoing" | "unknown"

    income_source: IncomeSource = IncomeSource.UNKNOWN
    income_source_detail: Optional[str] = None
    has_one_time_funds: Optional[bool] = None  # For settlement consideration

    product_type: ProductType = ProductType.UNKNOWN
    product_detail: Optional[str] = None

    # Verified data
    credit_data: Optional[CreditBureauData] = None
    income_data: Optional[IncomeVerificationData] = None

    # Computed scores
    ability_score: Optional[float] = None    # 0-100
    intent_score: Optional[float] = None     # 0-100
    composite_score: Optional[float] = None  # 0-100

    # Metadata
    data_completeness: float = 0.0  # 0-1, how much info we have

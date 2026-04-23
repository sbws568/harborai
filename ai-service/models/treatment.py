from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class TreatmentType(str, Enum):
    SETTLEMENT = "settlement"
    LONG_TERM_PLAN = "long_term_plan"
    SHORT_TERM_PLAN = "short_term_plan"
    DEFERRAL = "deferral"
    CREDIT_COUNSELING = "credit_counseling"  # fallback


class RBIGuidelineRef(BaseModel):
    circular: str
    title: str
    applicability: str


# Pre-defined RBI guideline references
RBI_GUIDELINES = {
    TreatmentType.SETTLEMENT: RBIGuidelineRef(
        circular="RBI/2023-24/32 (Master Direction)",
        title="Compromise Settlements and Technical Write-offs",
        applicability=(
            "Applicable for NPA accounts and stressed assets. Requires board-approved "
            "OTS policy. Settlement amount should reflect genuine ability to pay and "
            "expected recovery via legal route."
        ),
    ),
    TreatmentType.LONG_TERM_PLAN: RBIGuidelineRef(
        circular="RBI/2019-20/170 (Prudential Framework)",
        title="Resolution of Stressed Assets – Revised Framework",
        applicability=(
            "Restructuring permitted for viable borrowers facing temporary stress. "
            "Must be implemented within 180 days of default. Asset classification "
            "upgrade possible after satisfactory track record of at least 10% of "
            "outstanding principal/interest."
        ),
    ),
    TreatmentType.SHORT_TERM_PLAN: RBIGuidelineRef(
        circular="RBI/2019-20/170 (Prudential Framework) + IBA Guidelines",
        title="Short-term Restructuring for Temporary Hardship",
        applicability=(
            "Applicable for borrowers with temporary cash flow difficulties but "
            "viable repayment capacity. Resolution plan must restore viability "
            "within 1 year. IRAC norms apply."
        ),
    ),
    TreatmentType.DEFERRAL: RBIGuidelineRef(
        circular="RBI/2020-21/16 + Lender Board Policy",
        title="Payment Holiday / Moratorium for Genuine Hardship",
        applicability=(
            "Maximum 3 EMI cycles deferral allowed under board-approved policy. "
            "Interest continues to accrue during deferral. Not available for "
            "willful defaulters. Deferred EMIs to be recovered over remaining tenure "
            "or added to balloon payment."
        ),
    ),
}


class TreatmentTerms(BaseModel):
    # Settlement
    settlement_percentage: Optional[float] = None    # % of outstanding balance
    settlement_amount_inr: Optional[float] = None
    lump_sum_required: Optional[bool] = None
    settlement_validity_days: int = 30

    # Payment plans
    monthly_payment_inr: Optional[float] = None
    plan_duration_months: Optional[int] = None
    interest_rate_pa: Optional[float] = None         # Annual % rate during plan
    moratorium_months: Optional[int] = None          # Initial interest-only period

    # Deferral
    deferred_cycles: Optional[int] = None            # Max 3 as per RBI
    deferral_interest_treatment: str = "accrue_and_capitalize"

    # Common
    requires_manager_approval: bool = False
    requires_documentation: list[str] = Field(default_factory=list)


class TreatmentRecommendation(BaseModel):
    treatment_type: TreatmentType
    confidence: float = Field(ge=0.0, le=1.0)  # How confident the engine is

    rationale: str  # Plain-language explanation for the customer
    internal_rationale: str  # Detailed reasoning for agent/compliance

    rbi_guideline: RBIGuidelineRef
    terms: TreatmentTerms

    eligibility_criteria_met: list[str] = Field(default_factory=list)
    eligibility_criteria_missing: list[str] = Field(default_factory=list)

    alternative_treatments: list["TreatmentRecommendation"] = Field(default_factory=list)

    # Scores used for this recommendation
    ability_score_used: Optional[float] = None
    intent_score_used: Optional[float] = None
    composite_score_used: Optional[float] = None

    generated_at: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True


TreatmentRecommendation.model_rebuild()

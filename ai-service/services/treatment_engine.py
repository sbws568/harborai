"""
RBI-compliant treatment recommendation engine.

Treatment selection logic is aligned with:
- RBI Master Direction on Compromise Settlements (June 2023, RBI/2023-24/32)
- RBI Prudential Framework for Resolution of Stressed Assets (June 2019)
- IBA Guidelines on Restructuring
- RBI COVID-19 Moratorium Precedent (max 6 months; board policy typically limits to 3 cycles)
"""
import logging
from datetime import datetime

from models.hardship import HardshipAssessment, IntentClass, IncomeSource
from models.treatment import (
    TreatmentType,
    TreatmentRecommendation,
    TreatmentTerms,
    RBI_GUIDELINES,
)

logger = logging.getLogger(__name__)

# Composite score thresholds for treatment selection
DEFERRAL_THRESHOLD = 85.0
SHORT_TERM_THRESHOLD = 70.0
LONG_TERM_THRESHOLD = 50.0
# Below 50 → Settlement


class TreatmentEngine:
    """Determines the most suitable RBI-compliant treatment."""

    def recommend(self, assessment: HardshipAssessment) -> TreatmentRecommendation:
        composite = assessment.composite_score or 0.0

        logger.info(
            "Treatment selection — composite=%.1f ability=%.1f intent=%.1f",
            composite,
            assessment.ability_score or 0,
            assessment.intent_score or 0,
        )

        # Primary recommendation
        primary = self._select_treatment(assessment, composite)

        # Build alternatives (next-best options)
        alternatives = self._build_alternatives(assessment, composite, primary.treatment_type)
        primary.alternative_treatments = alternatives

        return primary

    def _select_treatment(
        self,
        assessment: HardshipAssessment,
        composite: float,
    ) -> TreatmentRecommendation:

        # Disaster-affected customers get deferral consideration first
        if assessment.affected_by_disaster and composite >= 55:
            return self._build_deferral(assessment, composite, disaster_override=True)

        if composite > DEFERRAL_THRESHOLD:
            return self._build_deferral(assessment, composite)
        elif composite > SHORT_TERM_THRESHOLD:
            return self._build_short_term_plan(assessment, composite)
        elif composite > LONG_TERM_THRESHOLD:
            return self._build_long_term_plan(assessment, composite)
        else:
            return self._build_settlement(assessment, composite)

    # ------------------------------------------------------------------
    # Deferral / Payment Holiday
    # ------------------------------------------------------------------

    def _build_deferral(
        self,
        assessment: HardshipAssessment,
        composite: float,
        disaster_override: bool = False,
    ) -> TreatmentRecommendation:
        """
        Payment holiday: max 3 EMI cycles per RBI board-approved policy.
        Interest accrues and is capitalized or recovered post-deferral.
        """
        deferred_cycles = 3 if assessment.affected_by_disaster or composite > 90 else 2

        terms = TreatmentTerms(
            deferred_cycles=deferred_cycles,
            deferral_interest_treatment="accrue_and_capitalize",
            requires_manager_approval=False,
            requires_documentation=self._disaster_docs(assessment),
        )

        rationale = (
            f"Based on your situation, we recommend a temporary payment pause "
            f"(payment holiday) of {deferred_cycles} months. "
        )
        if disaster_override:
            rationale += (
                "Given that you have been affected by a natural disaster, "
                "this relief is available under our disaster hardship policy. "
            )
        rationale += (
            "During this period, interest will continue to accrue. "
            "After the holiday, your regular payment schedule will resume. "
            "This gives you time to stabilize without damaging your credit further."
        )

        met = ["Positive payment intent", "Temporary nature of hardship"]
        if assessment.affected_by_disaster:
            met.append("Disaster-affected customer")
        if composite > 85:
            met.append(f"Strong composite score ({composite:.0f}/100)")

        return TreatmentRecommendation(
            treatment_type=TreatmentType.DEFERRAL,
            confidence=0.85 if not disaster_override else 0.90,
            rationale=rationale,
            internal_rationale=(
                f"Composite score {composite:.1f} qualifies for deferral. "
                f"Strong intent-to-pay signals. Hardship appears temporary "
                f"({'disaster-related' if assessment.affected_by_disaster else 'non-disaster'}). "
                f"Max 3 cycles per board-approved policy, per RBI precedent."
            ),
            rbi_guideline=RBI_GUIDELINES[TreatmentType.DEFERRAL],
            terms=terms,
            eligibility_criteria_met=met,
            eligibility_criteria_missing=[],
            ability_score_used=assessment.ability_score,
            intent_score_used=assessment.intent_score,
            composite_score_used=composite,
            generated_at=datetime.utcnow().isoformat(),
        )

    # ------------------------------------------------------------------
    # Short-Term Payment Plan (≤12 months)
    # ------------------------------------------------------------------

    def _build_short_term_plan(
        self,
        assessment: HardshipAssessment,
        composite: float,
    ) -> TreatmentRecommendation:
        duration = min(assessment.hardship_duration_months or 9, 12)
        monthly_emi = self._estimate_emi(assessment, duration)

        terms = TreatmentTerms(
            monthly_payment_inr=monthly_emi,
            plan_duration_months=duration,
            interest_rate_pa=self._restructured_rate(assessment),
            moratorium_months=1 if (assessment.ability_score or 0) < 55 else 0,
            requires_manager_approval=False,
            requires_documentation=[
                "Latest salary slips or ITR",
                "Hardship declaration letter",
                "Bank statements (3 months)",
            ],
        )

        rationale = (
            f"A short-term repayment plan of {duration} months is the best fit for you. "
            "This restructures your payments at a manageable level while your finances recover. "
            "Your account will be treated as 'restructured' on credit bureau records, "
            "and normal status will be restored after satisfactory repayment."
        )

        return TreatmentRecommendation(
            treatment_type=TreatmentType.SHORT_TERM_PLAN,
            confidence=0.82,
            rationale=rationale,
            internal_rationale=(
                f"Composite {composite:.1f}: above long-term threshold but below deferral. "
                f"Regular income source ({assessment.income_source.value}). "
                f"Hardship duration ≤12 months. Positive intent signals. "
                f"RBI Prudential Framework applies."
            ),
            rbi_guideline=RBI_GUIDELINES[TreatmentType.SHORT_TERM_PLAN],
            terms=terms,
            eligibility_criteria_met=[
                "Regular source of income",
                f"Hardship duration ≤12 months ({duration} months estimated)",
                "Positive intent to pay",
            ],
            eligibility_criteria_missing=self._missing_docs(assessment),
            ability_score_used=assessment.ability_score,
            intent_score_used=assessment.intent_score,
            composite_score_used=composite,
            generated_at=datetime.utcnow().isoformat(),
        )

    # ------------------------------------------------------------------
    # Long-Term Payment Plan (>12 months)
    # ------------------------------------------------------------------

    def _build_long_term_plan(
        self,
        assessment: HardshipAssessment,
        composite: float,
    ) -> TreatmentRecommendation:
        raw_duration = assessment.hardship_duration_months or 24
        duration = max(13, min(raw_duration + 6, 60))  # 13-60 months range

        monthly_emi = self._estimate_emi(assessment, duration)

        terms = TreatmentTerms(
            monthly_payment_inr=monthly_emi,
            plan_duration_months=duration,
            interest_rate_pa=self._restructured_rate(assessment),
            moratorium_months=2,
            requires_manager_approval=duration > 36,
            requires_documentation=[
                "Latest ITR (2 years)",
                "Audited financials (if business)",
                "Hardship declaration with supporting evidence",
                "Bank statements (6 months)",
                "Income proof",
            ],
        )

        rationale = (
            f"Given the extended nature of your hardship, a long-term repayment plan "
            f"of {duration} months is recommended. We will restructure your account "
            "with lower monthly payments to match your current repayment capacity. "
            "The first 2 months will have reduced payments to help you stabilize."
        )

        return TreatmentRecommendation(
            treatment_type=TreatmentType.LONG_TERM_PLAN,
            confidence=0.78,
            rationale=rationale,
            internal_rationale=(
                f"Composite {composite:.1f}: qualifies for restructuring under RBI "
                f"Prudential Framework. Hardship duration >12 months. "
                f"Income source: {assessment.income_source.value}. "
                f"Asset likely in SMA-2/NPA territory — restructuring preserves value. "
                f"{'Manager approval required (>36 months).' if duration > 36 else ''}"
            ),
            rbi_guideline=RBI_GUIDELINES[TreatmentType.LONG_TERM_PLAN],
            terms=terms,
            eligibility_criteria_met=[
                "Some regular income source",
                f"Hardship duration >12 months (~{raw_duration} months estimated)",
                "Positive intent to repay",
            ],
            eligibility_criteria_missing=self._missing_docs(assessment),
            ability_score_used=assessment.ability_score,
            intent_score_used=assessment.intent_score,
            composite_score_used=composite,
            generated_at=datetime.utcnow().isoformat(),
        )

    # ------------------------------------------------------------------
    # Settlement (OTS)
    # ------------------------------------------------------------------

    def _build_settlement(
        self,
        assessment: HardshipAssessment,
        composite: float,
    ) -> TreatmentRecommendation:
        pct = self._settlement_percentage(assessment, composite)
        outstanding = self._estimated_outstanding(assessment)
        settlement_amount = outstanding * pct

        terms = TreatmentTerms(
            settlement_percentage=pct * 100,
            settlement_amount_inr=settlement_amount,
            lump_sum_required=True,
            settlement_validity_days=30,
            requires_manager_approval=pct < 0.50,  # Below 50% needs approval
            requires_documentation=[
                "Source of settlement funds (bank statement/letter)",
                "Hardship declaration",
                "ID & PAN proof",
                "NOC request letter",
            ],
        )

        rationale = (
            f"A one-time settlement of approximately {pct*100:.0f}% of the outstanding "
            "balance is the most suitable option for your situation. "
            "This provides a clean resolution and the account will be closed with a "
            "'Settled' status. Note: 'Settled' accounts are reported to credit bureaus "
            "and may affect future credit applications for 7 years."
        )

        return TreatmentRecommendation(
            treatment_type=TreatmentType.SETTLEMENT,
            confidence=0.75,
            rationale=rationale,
            internal_rationale=(
                f"Composite {composite:.1f}: low ability/intent scores indicate "
                f"low recovery probability via regular collections. "
                f"Settlement at {pct*100:.0f}% preferred over legal recovery costs. "
                f"OTS policy compliant per RBI/2023-24/32. "
                f"{'Manager approval required (<50%).' if pct < 0.50 else ''}"
            ),
            rbi_guideline=RBI_GUIDELINES[TreatmentType.SETTLEMENT],
            terms=terms,
            eligibility_criteria_met=[
                "One-time funds reportedly available" if assessment.has_one_time_funds
                else "Settlement feasibility assessed",
                f"Low composite score ({composite:.0f}/100) — OTS appropriate",
            ],
            eligibility_criteria_missing=self._missing_docs(assessment) + [
                "Proof of one-time settlement funds",
            ],
            ability_score_used=assessment.ability_score,
            intent_score_used=assessment.intent_score,
            composite_score_used=composite,
            generated_at=datetime.utcnow().isoformat(),
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _settlement_percentage(
        self, assessment: HardshipAssessment, composite: float
    ) -> float:
        """Calculate settlement % (35-60%) based on scores and signals."""
        base = 0.50
        # Lower composite = lower settlement % (harder to recover → accept less)
        if composite < 20:
            base = 0.35
        elif composite < 35:
            base = 0.40
        elif composite < 45:
            base = 0.45

        # Ability adjustment
        ability = assessment.ability_score or 50
        base += (ability - 50) / 500  # ±10% range

        return max(0.35, min(0.60, round(base, 2)))

    def _estimate_emi(self, assessment: HardshipAssessment, months: int) -> float:
        """Rough EMI estimate from verified income or placeholder."""
        if assessment.income_data and assessment.income_data.net_disposable_income:
            # EMI = 50% of net disposable income (conservative)
            return round(assessment.income_data.net_disposable_income * 0.50, -2)
        return 5000.0  # placeholder

    def _restructured_rate(self, assessment: HardshipAssessment) -> float:
        """Concessional interest rate during restructuring (% p.a.)."""
        if (assessment.intent_to_pay == IntentClass.WILLING_PAYER
                and (assessment.ability_score or 0) > 60):
            return 12.0  # Concessional rate for cooperative borrowers
        return 14.0

    def _estimated_outstanding(self, assessment: HardshipAssessment) -> float:
        if assessment.credit_data and assessment.credit_data.total_outstanding:
            return assessment.credit_data.total_outstanding
        return 100000.0  # placeholder

    def _disaster_docs(self, assessment: HardshipAssessment) -> list[str]:
        if assessment.affected_by_disaster:
            return [
                "Government/collector disaster certificate",
                "Insurance claim acknowledgment (if applicable)",
            ]
        return []

    def _missing_docs(self, assessment: HardshipAssessment) -> list[str]:
        missing = []
        if not (assessment.income_data and assessment.income_data.verified):
            missing.append("Verified income proof (bank statements)")
        if not (assessment.credit_data and assessment.credit_data.consent_granted):
            missing.append("Credit bureau consent")
        return missing

    def _build_alternatives(
        self,
        assessment: HardshipAssessment,
        composite: float,
        exclude: TreatmentType,
    ) -> list[TreatmentRecommendation]:
        """Build up to 2 next-best alternatives."""
        alternatives = []
        all_options = [
            TreatmentType.DEFERRAL,
            TreatmentType.SHORT_TERM_PLAN,
            TreatmentType.LONG_TERM_PLAN,
            TreatmentType.SETTLEMENT,
        ]
        for opt in all_options:
            if opt == exclude:
                continue
            if opt == TreatmentType.DEFERRAL:
                alt = self._build_deferral(assessment, composite)
            elif opt == TreatmentType.SHORT_TERM_PLAN:
                alt = self._build_short_term_plan(assessment, composite)
            elif opt == TreatmentType.LONG_TERM_PLAN:
                alt = self._build_long_term_plan(assessment, composite)
            else:
                alt = self._build_settlement(assessment, composite)
            alternatives.append(alt)
            if len(alternatives) >= 2:
                break
        return alternatives

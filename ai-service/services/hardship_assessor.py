"""
Hardship scoring engine.

Produces three scores (0-100) based on gathered signals:
  - ability_score:   Financial capacity to repay (higher = more able)
  - intent_score:    Willingness to repay (higher = more willing)
  - composite_score: Weighted combination used for treatment selection
"""
import logging
from models.hardship import (
    HardshipAssessment,
    IntentClass,
    IncomeSource,
    HardshipReason,
)

logger = logging.getLogger(__name__)


class HardshipScoringEngine:
    """
    Rule-based scoring engine with signal weighting.

    Composite score determines treatment bucket:
      > 85  → Deferral (best ability + intent)
      70-85 → Short-term plan
      50-70 → Long-term plan
      < 50  → Settlement
    """

    # Weights for composite score
    ABILITY_WEIGHT = 0.45
    INTENT_WEIGHT = 0.40
    RISK_WEIGHT = 0.15   # Derived from credit bureau data

    def compute_scores(self, assessment: HardshipAssessment) -> HardshipAssessment:
        """Compute all scores and update the assessment in-place."""
        assessment.ability_score = self._ability_score(assessment)
        assessment.intent_score = self._intent_score(assessment)
        risk_score = self._risk_score(assessment)

        assessment.composite_score = (
            assessment.ability_score * self.ABILITY_WEIGHT
            + assessment.intent_score * self.INTENT_WEIGHT
            + risk_score * self.RISK_WEIGHT
        )

        assessment.data_completeness = self._data_completeness(assessment)

        logger.info(
            "Scores computed — ability=%.1f intent=%.1f composite=%.1f completeness=%.2f",
            assessment.ability_score,
            assessment.intent_score,
            assessment.composite_score,
            assessment.data_completeness,
        )

        return assessment

    # ------------------------------------------------------------------
    # Ability score (0-100)
    # ------------------------------------------------------------------

    def _ability_score(self, a: HardshipAssessment) -> float:
        score = 50.0  # neutral baseline

        # Income source signals
        income_map = {
            IncomeSource.SALARIED: +20,
            IncomeSource.PENSION: +15,
            IncomeSource.SELF_EMPLOYED: +10,
            IncomeSource.BUSINESS: +8,
            IncomeSource.RENTAL: +12,
            IncomeSource.FAMILY_SUPPORT: -5,
            IncomeSource.GOVERNMENT_BENEFIT: -10,
            IncomeSource.NO_INCOME: -30,
            IncomeSource.UNKNOWN: 0,
        }
        score += income_map.get(a.income_source, 0)

        # Verified income data (Perfios)
        if a.income_data and a.income_data.verified:
            iv = a.income_data
            if iv.dti_ratio is not None:
                if iv.dti_ratio < 0.40:
                    score += 20
                elif iv.dti_ratio < 0.60:
                    score += 10
                elif iv.dti_ratio < 0.80:
                    score -= 5
                else:
                    score -= 20

            if iv.income_stability is not None:
                # Stability bonus: 0-1 maps to -10 to +10
                score += (iv.income_stability - 0.5) * 20

            if iv.net_disposable_income is not None and iv.net_disposable_income < 0:
                score -= 15

        # One-time funds signal (positive for settlement ability)
        if a.has_one_time_funds:
            score += 10

        # Disaster-affected gets ability relief (not their fault)
        if a.affected_by_disaster:
            score = max(score, 35)  # floor for disaster victims

        return max(0.0, min(100.0, score))

    # ------------------------------------------------------------------
    # Intent score (0-100)
    # ------------------------------------------------------------------

    def _intent_score(self, a: HardshipAssessment) -> float:
        score = 50.0

        intent_map = {
            IntentClass.WILLING_PAYER: +35,
            IntentClass.PARTIAL_PAYER: +10,
            IntentClass.NON_PAYER: -35,
            IntentClass.UNKNOWN: 0,
        }
        score += intent_map.get(a.intent_to_pay, 0)

        # Bonus per positive intent signal from conversation
        score += min(len(a.intent_signals), 4) * 3

        # Hardship reason credibility
        credible_reasons = {
            HardshipReason.NATURAL_DISASTER,
            HardshipReason.MEDICAL_EMERGENCY,
            HardshipReason.DEATH_IN_FAMILY,
            HardshipReason.JOB_LOSS,
        }
        if a.hardship_reason in credible_reasons:
            score += 10

        # Proactive engagement (customer reached out = better intent)
        score += 5  # baseline for initiating the conversation

        return max(0.0, min(100.0, score))

    # ------------------------------------------------------------------
    # Risk score (0-100, higher = lower risk)
    # ------------------------------------------------------------------

    def _risk_score(self, a: HardshipAssessment) -> float:
        score = 50.0

        if a.credit_data:
            cd = a.credit_data
            credit_score = cd.credit_score or 600

            # Credit score bucket
            if credit_score >= 750:
                score += 25
            elif credit_score >= 700:
                score += 15
            elif credit_score >= 650:
                score += 5
            elif credit_score >= 600:
                score -= 5
            else:
                score -= 20

            # DPD history (last 12 months)
            if cd.dpd_history:
                max_dpd = max(cd.dpd_history)
                if max_dpd == 0:
                    score += 10
                elif max_dpd <= 30:
                    score += 0
                elif max_dpd <= 60:
                    score -= 10
                elif max_dpd <= 90:
                    score -= 20
                else:
                    score -= 30

            # Write-off or settled accounts (adverse history)
            if cd.write_off_history:
                score -= 25
            if cd.settled_accounts > 0:
                score -= 10 * min(cd.settled_accounts, 2)

        return max(0.0, min(100.0, score))

    # ------------------------------------------------------------------
    # Data completeness (0-1)
    # ------------------------------------------------------------------

    def _data_completeness(self, a: HardshipAssessment) -> float:
        fields = [
            a.affected_by_disaster is not None,
            a.hardship_reason != HardshipReason.UNKNOWN,
            a.intent_to_pay != IntentClass.UNKNOWN,
            a.hardship_duration_months is not None,
            a.income_source != IncomeSource.UNKNOWN,
            a.product_type is not None,
            a.credit_data is not None,
            a.income_data is not None and a.income_data.verified,
        ]
        return sum(fields) / len(fields)

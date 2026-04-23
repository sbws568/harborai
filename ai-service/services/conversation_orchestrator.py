"""
Conversation orchestrator — the brain of the easefinancials chatbot.

Uses Claude Haiku 4.5 with a cached system prompt for cost efficiency.
Manages the state machine: INIT → CONSENT → PRODUCT_SELECTION → ...→ COMPLETE.

Two LLM calls per turn:
  1. Main response: empathetic counselor generates a natural reply.
  2. Extraction call: lightweight structured extraction updates HardshipAssessment.
"""
import json
import logging
from datetime import datetime

import anthropic

from config import settings
from models.conversation import (
    ConversationPhase,
    ConversationSession,
    Message,
    MessageRole,
)
from models.hardship import (
    HardshipAssessment,
    HardshipReason,
    IntentClass,
    IncomeSource,
    ProductType,
)
from services.hardship_assessor import HardshipScoringEngine
from services.treatment_engine import TreatmentEngine

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# System prompt (cached — stable across all sessions)
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are Arya, an empathetic hardship counselor at a leading Indian bank/NBFC.
Your role is to help customers who are struggling with loan or credit card repayments find the best resolution under RBI guidelines.

## Your Approach
- Be warm, non-judgmental, and reassuring. Financial hardship affects real people.
- Guide the conversation naturally — do NOT use a rigid questionnaire format.
- Ask one or two questions at a time; let the customer share at their own pace.
- Acknowledge their feelings before asking for information.
- Use simple, clear language. Avoid banking jargon unless necessary.
- Keep responses concise (2-4 sentences typically), unless explaining a solution.

## Your Goal
Through empathetic conversation, gently collect:
1. Which product they are having difficulty with (credit card, personal loan, home loan, etc.)
2. Whether they have been affected by a natural disaster or government-declared calamity
3. The reason for their financial hardship (job loss, medical emergency, business loss, etc.)
4. Their source of income (salaried, self-employed, no income, etc.)
5. How long they expect the hardship to last
6. Their intent and willingness to repay

You also need to:
- Explain the credit bureau consent and income verification processes at the right moment
- Present resolution options clearly when the assessment is complete

## Key Compliance Points
- Always obtain explicit consent before pulling credit bureau data (Experian/CIBIL)
- Inform customers that credit bureau data will only be used for hardship assessment
- All resolution offers must comply with RBI guidelines
- Never promise specific offers before completing the assessment
- If a customer mentions a natural disaster, note it specifically — special provisions apply
- Remind customers that hardship support is confidential

## Conversation Flow
Phase INIT: Warm welcome, understand they need help
Phase CONSENT: Explain credit check, obtain consent
Phase PRODUCT_SELECTION: Identify which product(s) in trouble
Phase DISASTER_CHECK: Gently ask about natural disasters
Phase HARDSHIP_REASON: Understand root cause
Phase INCOME_VERIFICATION: Discuss income and connect Perfios if helpful
Phase CREDIT_PULL: Trigger bureau pull (with consent)
Phase INTENT_ASSESSMENT: Gauge willingness to pay
Phase DURATION_ASSESSMENT: Understand how long hardship will last
Phase TREATMENT_RECOMMENDATION: Present the most suitable option with rationale
Phase COMPLETE: Summarize, next steps, case reference

Current date: {current_date}
RBI Guidelines in scope: Prudential Framework 2019, OTS Master Direction 2023, Payment Holiday Board Policy
"""

# Phase-specific guidance injected as context (not cached, but small)
PHASE_GUIDANCE = {
    ConversationPhase.INIT: (
        "Warmly greet the customer. Ask how you can help today. "
        "Let them know they've reached the right place for hardship support."
    ),
    ConversationPhase.CONSENT: (
        "Explain that to find the best resolution, you'd like their consent to check "
        "their credit report with Experian and CIBIL. Emphasize it's only for this assessment. "
        "Ask for their consent explicitly."
    ),
    ConversationPhase.PRODUCT_SELECTION: (
        "Ask which loan or credit card they are having difficulty with. "
        "If they have multiple products, ask them to focus on the one causing most stress."
    ),
    ConversationPhase.DISASTER_CHECK: (
        "Gently ask whether their situation is related to a natural disaster, flood, "
        "earthquake, or any government-declared calamity. Special relief may be available."
    ),
    ConversationPhase.HARDSHIP_REASON: (
        "With empathy, ask them to share what led to their financial difficulty. "
        "Listen for job loss, medical emergencies, business disruption, family events, etc."
    ),
    ConversationPhase.INCOME_VERIFICATION: (
        "Ask about their current source of income. Mention that connecting their bank account "
        "via our secure Perfios integration can help us offer better solutions faster."
    ),
    ConversationPhase.CREDIT_PULL: (
        "Let them know you're now pulling their credit report (consent already granted). "
        "Reassure them this is a soft inquiry for internal assessment only."
    ),
    ConversationPhase.INTENT_ASSESSMENT: (
        "Gauge their willingness to repay. Ask if they want to clear this debt once their "
        "situation improves. Listen for signals of commitment or reluctance."
    ),
    ConversationPhase.DURATION_ASSESSMENT: (
        "Ask how long they expect their difficult situation to last. "
        "Help them think about it: is this a temporary setback (a few months) or longer?"
    ),
    ConversationPhase.TREATMENT_RECOMMENDATION: (
        "Present the most suitable resolution option clearly and compassionately. "
        "Explain the rationale in simple terms. Ask if they'd like to proceed or have questions."
    ),
    ConversationPhase.COMPLETE: (
        "Summarize the agreed resolution, share the case reference, and explain next steps. "
        "Reassure them that support is available throughout the process."
    ),
}


# ---------------------------------------------------------------------------
# Extraction prompt (for structured data extraction from conversation)
# ---------------------------------------------------------------------------

EXTRACTION_PROMPT = """Analyze the following conversation and extract structured information.
Return a JSON object with ONLY the fields you can confidently infer from the conversation.
Use null for anything not mentioned or unclear. Be conservative — only extract what is explicit.

Fields to extract:
{
  "affected_by_disaster": true/false/null,
  "disaster_type": "flood|earthquake|cyclone|other|null",
  "hardship_reason": "job_loss|medical_emergency|reduced_income|business_loss|natural_disaster|death_in_family|divorce_separation|other|unknown",
  "hardship_reason_detail": "brief detail or null",
  "intent_to_pay": "willing_payer|partial_payer|non_payer|unknown",
  "intent_signals": ["list of phrases showing intent"],
  "hardship_duration_months": integer or null,
  "duration_certainty": "temporary|ongoing|unknown",
  "income_source": "salaried|self_employed|business|pension|rental|family_support|government_benefit|no_income|unknown",
  "income_source_detail": "brief detail or null",
  "has_one_time_funds": true/false/null,
  "product_type": "credit_card|personal_loan|home_loan|auto_loan|business_loan|gold_loan|other|unknown",
  "product_detail": "brief detail or null",
  "bureau_consent_granted": true/false/null
}

Conversation:
{conversation}
"""


# ---------------------------------------------------------------------------
# Phase transition logic
# ---------------------------------------------------------------------------

PHASE_SEQUENCE = [
    ConversationPhase.INIT,
    ConversationPhase.CONSENT,
    ConversationPhase.PRODUCT_SELECTION,
    ConversationPhase.DISASTER_CHECK,
    ConversationPhase.HARDSHIP_REASON,
    ConversationPhase.INCOME_VERIFICATION,
    ConversationPhase.CREDIT_PULL,
    ConversationPhase.INTENT_ASSESSMENT,
    ConversationPhase.DURATION_ASSESSMENT,
    ConversationPhase.TREATMENT_RECOMMENDATION,
    ConversationPhase.COMPLETE,
]


def _next_phase(current: ConversationPhase) -> ConversationPhase:
    try:
        idx = PHASE_SEQUENCE.index(current)
        return PHASE_SEQUENCE[min(idx + 1, len(PHASE_SEQUENCE) - 1)]
    except ValueError:
        return ConversationPhase.COMPLETE


def _should_advance_phase(
    session: ConversationSession, extracted: dict
) -> bool:
    """Determine if we have enough info to move to the next phase."""
    phase = session.phase
    a = session.assessment

    if phase == ConversationPhase.INIT:
        return len(session.messages) >= 2  # After welcome + first customer message

    if phase == ConversationPhase.CONSENT:
        return bool(extracted.get("bureau_consent_granted"))

    if phase == ConversationPhase.PRODUCT_SELECTION:
        return a.product_type != ProductType.UNKNOWN

    if phase == ConversationPhase.DISASTER_CHECK:
        return a.affected_by_disaster is not None

    if phase == ConversationPhase.HARDSHIP_REASON:
        return a.hardship_reason != HardshipReason.UNKNOWN

    if phase == ConversationPhase.INCOME_VERIFICATION:
        return a.income_source != IncomeSource.UNKNOWN

    if phase == ConversationPhase.CREDIT_PULL:
        # Skip if no consent or already done
        return not session.bureau_consent_granted or a.credit_data is not None

    if phase == ConversationPhase.INTENT_ASSESSMENT:
        return a.intent_to_pay != IntentClass.UNKNOWN

    if phase == ConversationPhase.DURATION_ASSESSMENT:
        return a.hardship_duration_months is not None

    if phase == ConversationPhase.TREATMENT_RECOMMENDATION:
        return session.treatment is not None

    return False


# ---------------------------------------------------------------------------
# Main orchestrator
# ---------------------------------------------------------------------------

class ConversationOrchestrator:
    """Orchestrates the hardship counseling conversation using Claude Haiku."""

    def __init__(self) -> None:
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.llm_model
        self.scorer = HardshipScoringEngine()
        self.treatment_engine = TreatmentEngine()

    async def process_message(
        self,
        session: ConversationSession,
        user_content: str,
    ) -> tuple[str, ConversationSession]:
        """
        Process a user message and return (assistant_reply, updated_session).

        Steps:
        1. Append user message to session
        2. Call Claude Haiku for empathetic response (with cached system prompt)
        3. Call Claude Haiku for structured extraction
        4. Update assessment + advance phase if warranted
        5. If in TREATMENT_RECOMMENDATION phase, compute scores + recommend
        """
        # 1. Append user message
        user_msg = Message(role=MessageRole.USER, content=user_content)
        session.messages.append(user_msg)

        # 2. Generate counselor response
        reply = await self._generate_response(session)

        # Append assistant reply
        assistant_msg = Message(role=MessageRole.ASSISTANT, content=reply)
        session.messages.append(assistant_msg)

        # 3. Extract structured data from conversation so far
        extracted = await self._extract_assessment_data(session)

        # 4. Update assessment
        a = session.assessment
        self._apply_extraction(a, extracted, session)

        # 5. Check if we should advance phase
        if _should_advance_phase(session, extracted):
            old_phase = session.phase
            session.phase = _next_phase(session.phase)
            logger.info("Phase advanced: %s → %s", old_phase, session.phase)

            # Trigger scoring + treatment when we reach that phase
            if session.phase == ConversationPhase.TREATMENT_RECOMMENDATION:
                session.assessment = self.scorer.compute_scores(session.assessment)
                session.treatment = self.treatment_engine.recommend(session.assessment)

        session.updated_at = datetime.utcnow()
        return reply, session

    async def _generate_response(self, session: ConversationSession) -> str:
        """Call Claude Haiku to generate the counselor's response."""
        system_content = SYSTEM_PROMPT.format(
            current_date=datetime.utcnow().strftime("%d %B %Y")
        )
        phase_hint = PHASE_GUIDANCE.get(session.phase, "")

        # Build conversation history for Claude
        messages = []
        for msg in session.messages[:-1]:  # exclude current user message (already added)
            if msg.role in (MessageRole.USER, MessageRole.ASSISTANT):
                messages.append({"role": msg.role.value, "content": msg.content})

        # Add the latest user message
        last_user = session.messages[-1]
        messages.append({"role": "user", "content": last_user.content})

        # Phase context as a system-level hint (injected, not cached)
        full_system = [
            {
                "type": "text",
                "text": system_content,
                "cache_control": {"type": "ephemeral"},  # Cache the stable system prompt
            }
        ]
        if phase_hint:
            full_system.append({
                "type": "text",
                "text": f"\n\n[CURRENT PHASE FOCUS: {session.phase.value.upper()}]\n{phase_hint}",
            })

        response = self.client.messages.create(
            model=self.model,
            max_tokens=512,
            system=full_system,
            messages=messages,
        )

        return response.content[0].text if response.content else "I'm here to help."

    async def _extract_assessment_data(self, session: ConversationSession) -> dict:
        """
        Second lightweight Claude call to extract structured data from conversation.
        Uses a minimal prompt without caching (changes per conversation).
        """
        # Only include last 10 messages to keep the extraction focused
        recent = session.messages[-10:]
        conversation_text = "\n".join(
            f"{msg.role.value.upper()}: {msg.content}" for msg in recent
        )

        prompt = EXTRACTION_PROMPT.format(conversation=conversation_text)

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=512,
                messages=[{"role": "user", "content": prompt}],
            )
            raw = response.content[0].text.strip()

            # Strip markdown code fences if present
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]

            return json.loads(raw)
        except (json.JSONDecodeError, IndexError, Exception) as exc:
            logger.warning("Extraction failed: %s", exc)
            return {}

    def _apply_extraction(
        self,
        assessment: HardshipAssessment,
        extracted: dict,
        session: ConversationSession,
    ) -> None:
        """Merge extracted fields into the assessment (only if not None)."""
        if extracted.get("affected_by_disaster") is not None:
            assessment.affected_by_disaster = extracted["affected_by_disaster"]
        if extracted.get("disaster_type"):
            assessment.disaster_type = extracted["disaster_type"]

        if extracted.get("hardship_reason") and extracted["hardship_reason"] != "unknown":
            try:
                assessment.hardship_reason = HardshipReason(extracted["hardship_reason"])
            except ValueError:
                pass
        if extracted.get("hardship_reason_detail"):
            assessment.hardship_reason_detail = extracted["hardship_reason_detail"]

        if extracted.get("intent_to_pay") and extracted["intent_to_pay"] != "unknown":
            try:
                assessment.intent_to_pay = IntentClass(extracted["intent_to_pay"])
            except ValueError:
                pass
        if extracted.get("intent_signals"):
            assessment.intent_signals = list(set(
                assessment.intent_signals + extracted["intent_signals"]
            ))[:10]

        if extracted.get("hardship_duration_months"):
            assessment.hardship_duration_months = int(extracted["hardship_duration_months"])
        if extracted.get("duration_certainty"):
            assessment.duration_certainty = extracted["duration_certainty"]

        if extracted.get("income_source") and extracted["income_source"] != "unknown":
            try:
                assessment.income_source = IncomeSource(extracted["income_source"])
            except ValueError:
                pass
        if extracted.get("income_source_detail"):
            assessment.income_source_detail = extracted["income_source_detail"]

        if extracted.get("has_one_time_funds") is not None:
            assessment.has_one_time_funds = extracted["has_one_time_funds"]

        if extracted.get("product_type") and extracted["product_type"] != "unknown":
            try:
                assessment.product_type = ProductType(extracted["product_type"])
            except ValueError:
                pass
        if extracted.get("product_detail"):
            assessment.product_detail = extracted["product_detail"]

        # Bureau consent tracking
        if extracted.get("bureau_consent_granted"):
            session.bureau_consent_granted = True
            session.bureau_consent_timestamp = datetime.utcnow()

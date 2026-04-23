"""
REST API routes for the easefinancials hardship assessment chatbot.
Sessions are stored in Redis (with in-memory fallback).
All endpoints require a valid JWT; in development, unauthenticated requests get guest access.
"""
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel

from auth import TokenData, get_current_user
from api.session_store import delete_session, get_session, save_session
from models.conversation import (
    ConversationSession,
    ConversationPhase,
    Message,
    MessageRole,
    MessageRequest,
    MessageResponse,
    SessionCreateRequest,
)
from models.hardship import HardshipAssessment
from models.treatment import TreatmentRecommendation
from services.conversation_orchestrator import ConversationOrchestrator
from services.credit_bureau import CreditBureauService
from services.income_verifier import IncomeVerificationService

logger = logging.getLogger(__name__)
router = APIRouter()

_orchestrator = ConversationOrchestrator()
_bureau_service = CreditBureauService()
_income_service = IncomeVerificationService()


# ---------------------------------------------------------------------------
# Request/Response models
# ---------------------------------------------------------------------------

class ConsentRequest(BaseModel):
    bureau_consent: bool
    income_verification_consent: bool = False
    customer_pan: Optional[str] = None
    customer_mobile: Optional[str] = None
    customer_name: Optional[str] = None
    customer_dob: Optional[str] = None


class IncomeVerifyRequest(BaseModel):
    customer_id: Optional[str] = None
    mobile: Optional[str] = None


class SessionResponse(BaseModel):
    session_id: str
    phase: ConversationPhase
    messages: list[Message]
    assessment: HardshipAssessment
    treatment: Optional[TreatmentRecommendation]
    bureau_consent_granted: bool
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/sessions", response_model=SessionResponse, status_code=201)
async def create_session(
    request: SessionCreateRequest = Body(default=SessionCreateRequest()),
    current_user: TokenData = Depends(get_current_user),
):
    """Create a new hardship assessment session."""
    session = ConversationSession(
        customer_id=request.customer_id or current_user.customer_id,
        account_id=request.account_id,
        channel=request.channel or current_user.channel,
    )

    welcome, session = await _orchestrator.process_message(session, "__init__")
    session.messages = [m for m in session.messages if m.content != "__init__"]

    await save_session(session)
    logger.info("Session created: %s (customer: %s)", session.session_id, session.customer_id)
    return _session_to_response(session)


@router.post("/sessions/{session_id}/message", response_model=MessageResponse)
async def send_message(
    session_id: str,
    request: MessageRequest,
    current_user: TokenData = Depends(get_current_user),
):
    """Send a message and get the AI counselor's response."""
    session = await _require_session(session_id, current_user)
    old_phase = session.phase
    old_assessment = session.assessment.model_copy()

    content = request.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    reply, session = await _orchestrator.process_message(session, content)
    await save_session(session)

    assistant_msg = session.messages[-1]
    return MessageResponse(
        session_id=session_id,
        message=assistant_msg,
        phase=session.phase,
        phase_changed=session.phase != old_phase,
        assessment_updated=(
            session.assessment.model_dump() != old_assessment.model_dump()
        ),
    )


@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session_route(
    session_id: str,
    current_user: TokenData = Depends(get_current_user),
):
    """Get the full state of a session."""
    session = await _require_session(session_id, current_user)
    return _session_to_response(session)


@router.post("/sessions/{session_id}/consent")
async def grant_consent(
    session_id: str,
    request: ConsentRequest,
    current_user: TokenData = Depends(get_current_user),
):
    """
    Record credit bureau and/or income verification consent.
    Triggers a bureau pull when PAN/mobile/name/DOB are all supplied.
    """
    session = await _require_session(session_id, current_user)

    if request.bureau_consent:
        session.bureau_consent_granted = True
        session.bureau_consent_timestamp = datetime.utcnow()

        if all([
            request.customer_pan,
            request.customer_mobile,
            request.customer_name,
            request.customer_dob,
        ]):
            try:
                experian, cibil = await _bureau_service.fetch_reports(
                    pan=request.customer_pan,
                    mobile=request.customer_mobile,
                    name=request.customer_name,
                    dob=request.customer_dob,
                    consent_granted=True,
                )
                session.assessment.credit_data = experian or cibil
                logger.info("Bureau data pulled for session %s", session_id)
            except Exception as exc:
                logger.error("Bureau pull failed: %s", exc)

    if request.income_verification_consent:
        session.income_verification_consent = True

    await save_session(session)
    return {
        "status": "consent_recorded",
        "bureau_consent": session.bureau_consent_granted,
        "bureau_data_available": session.assessment.credit_data is not None,
    }


@router.get("/sessions/{session_id}/treatment", response_model=Optional[TreatmentRecommendation])
async def get_treatment(
    session_id: str,
    current_user: TokenData = Depends(get_current_user),
):
    """Get the treatment recommendation once assessment is complete."""
    session = await _require_session(session_id, current_user)

    if session.treatment is None:
        if session.phase in (
            ConversationPhase.TREATMENT_RECOMMENDATION,
            ConversationPhase.COMPLETE,
        ):
            raise HTTPException(
                status_code=503,
                detail="Treatment is being computed. Please retry shortly.",
            )
        raise HTTPException(
            status_code=404,
            detail="Assessment not complete yet. Continue the conversation.",
        )

    return session.treatment


@router.post("/sessions/{session_id}/verify-income")
async def verify_income(
    session_id: str,
    request: IncomeVerifyRequest = Body(default=IncomeVerifyRequest()),
    current_user: TokenData = Depends(get_current_user),
):
    """Trigger Perfios income verification. In mock mode, immediately returns results."""
    session = await _require_session(session_id, current_user)

    if not session.income_verification_consent:
        raise HTTPException(
            status_code=403,
            detail="Income verification consent not granted. Call /consent first.",
        )

    cust_id = request.customer_id or session.customer_id or session.session_id
    mobile = request.mobile or "9999999999"

    try:
        transaction = await _income_service.initiate(
            customer_id=cust_id,
            mobile=mobile,
        )

        from config import settings
        if settings.mock_integrations:
            result = await _income_service.get_result(transaction["transaction_id"])
            if result:
                session.assessment.income_data = result
                await save_session(session)

        return {
            "status": "initiated",
            "transaction_id": transaction.get("transaction_id"),
            "upload_url": transaction.get("upload_url"),
            "income_data_available": session.assessment.income_data is not None,
        }
    except Exception as exc:
        logger.error("Perfios initiation failed: %s", exc)
        raise HTTPException(status_code=502, detail="Income verification unavailable.")


@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session_route(
    session_id: str,
    current_user: TokenData = Depends(get_current_user),
):
    """Delete a session."""
    await _require_session(session_id, current_user)
    await delete_session(session_id)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _require_session(session_id: str, current_user: TokenData) -> ConversationSession:
    session = await get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found.")
    # In production, enforce ownership; in development guest can access any session
    if (
        session.customer_id
        and session.customer_id != current_user.customer_id
        and current_user.customer_id != "guest"
    ):
        raise HTTPException(status_code=403, detail="Access denied.")
    return session


def _session_to_response(session: ConversationSession) -> SessionResponse:
    return SessionResponse(
        session_id=session.session_id,
        phase=session.phase,
        messages=session.messages,
        assessment=session.assessment,
        treatment=session.treatment,
        bureau_consent_granted=session.bureau_consent_granted,
        created_at=session.created_at,
        updated_at=session.updated_at,
    )

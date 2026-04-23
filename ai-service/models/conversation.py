from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

from models.hardship import HardshipAssessment
from models.treatment import TreatmentRecommendation


class ConversationPhase(str, Enum):
    INIT = "init"
    CONSENT = "consent"
    PRODUCT_SELECTION = "product_selection"
    DISASTER_CHECK = "disaster_check"
    HARDSHIP_REASON = "hardship_reason"
    INCOME_VERIFICATION = "income_verification"
    CREDIT_PULL = "credit_pull"
    INTENT_ASSESSMENT = "intent_assessment"
    DURATION_ASSESSMENT = "duration_assessment"
    TREATMENT_RECOMMENDATION = "treatment_recommendation"
    COMPLETE = "complete"


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ConversationSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    phase: ConversationPhase = ConversationPhase.INIT
    messages: list[Message] = Field(default_factory=list)

    bureau_consent_granted: bool = False
    bureau_consent_timestamp: Optional[datetime] = None
    income_verification_consent: bool = False

    assessment: HardshipAssessment = Field(default_factory=HardshipAssessment)
    treatment: Optional[TreatmentRecommendation] = None

    channel: str = "self_serve"
    customer_id: Optional[str] = None
    account_id: Optional[str] = None


class SessionCreateRequest(BaseModel):
    customer_id: Optional[str] = None
    account_id: Optional[str] = None
    channel: str = "self_serve"


class MessageRequest(BaseModel):
    content: str


class MessageResponse(BaseModel):
    session_id: str
    message: Message
    phase: ConversationPhase
    phase_changed: bool = False
    assessment_updated: bool = False

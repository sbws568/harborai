"""
JWT authentication for easefinancials API.
Issues 24-hour tokens; validates Bearer credentials on every request.
In development (APP_ENV=development), unauthenticated requests get a guest identity.
"""
import logging
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel

from config import settings

logger = logging.getLogger(__name__)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security = HTTPBearer(auto_error=False)


class TokenData(BaseModel):
    customer_id: str
    channel: str = "self_serve"


class TokenRequest(BaseModel):
    customer_id: str
    channel: str = "self_serve"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = ACCESS_TOKEN_EXPIRE_MINUTES * 60


def create_access_token(customer_id: str, channel: str = "self_serve") -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": customer_id,
        "channel": channel,
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        customer_id: Optional[str] = payload.get("sub")
        if not customer_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
        return TokenData(customer_id=customer_id, channel=payload.get("channel", "self_serve"))
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {exc}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> TokenData:
    """FastAPI dependency — returns authenticated user or raises 401.
    In development, missing token returns a guest identity to ease local testing.
    """
    if credentials is None:
        if settings.app_env == "development":
            return TokenData(customer_id="guest", channel="self_serve")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return decode_token(credentials.credentials)

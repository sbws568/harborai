"""
easefinancials — Hardship Assessment AI Service
FastAPI application entry point.
"""
import logging
import structlog
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from api.routes import router
from auth import TokenRequest, TokenResponse, create_access_token

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
)
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(
        getattr(logging, settings.log_level.upper(), logging.INFO)
    ),
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# App lifecycle
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(
        "easefinancials AI Service starting | env=%s model=%s mock=%s",
        settings.app_env,
        settings.llm_model,
        settings.mock_integrations,
    )
    yield
    logger.info("easefinancials AI Service shutting down.")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="easefinancials Hardship Assessment Service",
    description=(
        "AI-powered hardship assessment chatbot for Indian banks/NBFCs. "
        "Integrates with Experian, CIBIL, and Perfios. RBI-compliant treatment engine."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(router, prefix="/api/v1", tags=["hardship"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health", tags=["system"])
async def health():
    return {
        "status": "healthy",
        "service": "easefinancials-ai-service",
        "model": settings.llm_model,
        "mock_mode": settings.mock_integrations,
        "environment": settings.app_env,
    }


@app.post("/api/v1/auth/token", response_model=TokenResponse, tags=["auth"])
async def issue_token(request: TokenRequest):
    """
    Issue a JWT for the given customer_id.
    In production, gate this behind real authentication (OTP, password, OAuth).
    For demo/dev: call with any customer_id to get a working token.
    """
    token = create_access_token(
        customer_id=request.customer_id,
        channel=request.channel,
    )
    return TokenResponse(access_token=token)


@app.get("/", tags=["system"])
async def root():
    return JSONResponse({
        "service": "easefinancials Hardship Assessment API",
        "version": "1.0.0",
        "docs": "/docs",
    })


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.app_env == "development",
        log_level=settings.log_level.lower(),
    )

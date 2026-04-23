from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = Field(..., alias="ANTHROPIC_API_KEY")
    app_env: str = Field("development", alias="APP_ENV")
    log_level: str = Field("INFO", alias="LOG_LEVEL")
    secret_key: str = Field("change-me", alias="SECRET_KEY")

    mock_integrations: bool = Field(True, alias="MOCK_INTEGRATIONS")

    redis_url: str = Field("redis://localhost:6379/0", alias="REDIS_URL")
    session_ttl_seconds: int = Field(3600, alias="SESSION_TTL_SECONDS")

    # LLM model — Haiku 4.5 is cheap yet capable
    llm_model: str = "claude-haiku-4-5"

    # Experian India
    experian_api_url: str = Field("https://api.experian.in/credit/v3", alias="EXPERIAN_API_URL")
    experian_api_key: str = Field("", alias="EXPERIAN_API_KEY")
    experian_client_id: str = Field("", alias="EXPERIAN_CLIENT_ID")
    experian_client_secret: str = Field("", alias="EXPERIAN_CLIENT_SECRET")

    # CIBIL
    cibil_api_url: str = Field("https://api.transunion.in/credit/v1", alias="CIBIL_API_URL")
    cibil_api_key: str = Field("", alias="CIBIL_API_KEY")
    cibil_client_id: str = Field("", alias="CIBIL_CLIENT_ID")

    # Perfios
    perfios_api_url: str = Field("https://api.perfios.com/v2", alias="PERFIOS_API_URL")
    perfios_api_key: str = Field("", alias="PERFIOS_API_KEY")
    perfios_institution_id: str = Field("", alias="PERFIOS_INSTITUTION_ID")

    cors_origins: str = Field("http://localhost:3000,http://localhost:8081", alias="CORS_ORIGINS")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()

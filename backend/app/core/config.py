from typing import Literal

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENV: Literal["dev", "prod"] = "dev"
    DATABASE_URL: str = "postgresql+asyncpg://tianda:tianda@localhost:5432/tianda"
    ADMIN_TOKEN: SecretStr = SecretStr("change-me-in-prod")
    IP_SALT: SecretStr = SecretStr("change-me-too")
    APP_VERSION: str = "0.1.0"

    # Comma-separated list of allowed browser origins for CORS.
    # Browser → FastAPI directly (no Next.js proxy), so prod must list each
    # subdomain explicitly. allow_credentials=True is set in main.py to let
    # the cookie domain (.tianda.studio) flow across subdomains.
    CORS_ORIGINS: str = (
        "http://localhost:3000,http://localhost:3002,"
        "http://localhost:3001,http://localhost:3003"
    )

    # Cookie domain — leading dot lets api / web / admin subdomains share the
    # same cookie. Empty string means host-only (use for local dev with
    # 127.0.0.1 / localhost where shared-domain cookies don't apply).
    COOKIE_DOMAIN: str = ""
    COOKIE_SECURE: bool = False

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("CORS_ORIGINS")
    @classmethod
    def _strip_origins(cls, v: str) -> str:
        return ",".join(o.strip() for o in v.split(",") if o.strip())

    @property
    def cors_origins_list(self) -> list[str]:
        return [o for o in self.CORS_ORIGINS.split(",") if o]


settings = Settings()

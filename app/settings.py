"""Runtime configuration loaded from environment variables / the .env file."""

from pydantic_settings import BaseSettings, SettingsConfigDict

FALLBACK_MODEL_NAME = "gemini-3.1-flash-lite"


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    GOOGLE_API_KEY: str
    GOOGLE_MODEL_NAME: str = FALLBACK_MODEL_NAME


config = AppSettings()

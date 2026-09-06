"""
RAILSYNC AI - Backend Configuration Settings
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RAILSYNC AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "dharshenikarthi")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "RAILSYNC_AI_DB")
    
    @property
    def DATABASE_URL(self) -> str:
        env_url = os.getenv("DATABASE_URL")
        if env_url:
            return env_url
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    # JWT Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "railopt-ai-secret-key-super-secure-token-2026-ir-sih")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # CORS
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        case_sensitive = True

settings = Settings()

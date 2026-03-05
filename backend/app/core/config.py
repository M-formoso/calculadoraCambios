from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "CambioCBA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Database - Railway usa DATABASE_URL automaticamente
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/cambiocba"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS - se configura dinamicamente
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    FRONTEND_URL: Optional[str] = None

    # Admin inicial
    ADMIN_EMAIL: str = "admin@cambiocba.com"
    ADMIN_PASSWORD: str = "admin123"
    ADMIN_NOMBRE: str = "Administrador"

    class Config:
        env_file = ".env"
        case_sensitive = True

    def get_cors_origins(self) -> List[str]:
        origins = list(self.BACKEND_CORS_ORIGINS)
        if self.FRONTEND_URL:
            origins.append(self.FRONTEND_URL)
        # Permitir cualquier subdominio de railway.app en produccion
        if self.ENVIRONMENT == "production":
            origins.append("https://*.railway.app")
            origins.append("https://*.up.railway.app")
        return origins


settings = Settings()

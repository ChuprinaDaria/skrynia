from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Skrynia Pani Darii API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Admin
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    # Stripe
    STRIPE_SECRET_KEY: str
    STRIPE_PUBLIC_KEY: str
    STRIPE_WEBHOOK_SECRET: str

    # Przelewy24
    P24_MERCHANT_ID: str
    P24_POS_ID: str
    P24_CRC: str
    P24_API_KEY: str
    P24_TEST_MODE: bool = True

    # InPost
    INPOST_API_TOKEN: str = ""
    INPOST_ORGANIZATION_ID: str = ""

    # Nova Poshta
    NOVA_POSHTA_API_KEY: str = ""
    NOVA_POSHTA_CITY_SENDER: str = ""
    NOVA_POSHTA_WAREHOUSE_SENDER: str = ""
    NOVA_POSHTA_COUNTERPARTY_SENDER: str = ""
    NOVA_POSHTA_CONTACT_SENDER: str = ""
    NOVA_POSHTA_PHONE_SENDER: str = ""

    # DHL
    DHL_API_KEY: str = ""
    DHL_API_SECRET: str = ""
    DHL_ACCOUNT_NUMBER: str = ""

    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # CORS
    FRONTEND_URL: str
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # File Upload
    UPLOAD_DIR: str = "static/uploads"
    MAX_FILE_SIZE: int = 5242880  # 5MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "webp", "avif"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

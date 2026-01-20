from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Rune box API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Admin
    ADMIN_EMAIL: str = "dchuprina@lazysoft.pl"
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
    INPOST_API_TOKEN: str = ""  # ShipX API token (Bearer token) - Legacy API
    INPOST_ORGANIZATION_ID: str = ""  # Organization ID (optional, can be fetched from API)
    INPOST_SANDBOX: bool = True  # Use sandbox environment
    INPOST_GEOWIDGET_TOKEN: str = ""  # Geowidget PUBLIC token (for frontend widget)
    # Global API v2 (OAuth 2.0)
    INPOST_CLIENT_ID: str = ""  # OAuth 2.0 Client ID
    INPOST_CLIENT_SECRET: str = ""  # OAuth 2.0 Client Secret
    INPOST_USE_GLOBAL_API: bool = False  # Use new Global API v2 instead of legacy ShipX API
    # Webhook authentication (Global API v2)
    INPOST_WEBHOOK_HMAC_SECRET: str = ""  # HMAC shared secret for webhook signature verification
    INPOST_WEBHOOK_API_KEY: str = ""  # API key for webhook authentication (optional)
    INPOST_WEBHOOK_API_KEY_HEADER: str = "x-api-key"  # Custom header name for API key
    INPOST_WEBHOOK_BASIC_AUTH_USER: str = ""  # Basic auth username (optional)
    INPOST_WEBHOOK_BASIC_AUTH_PASSWORD: str = ""  # Basic auth password (optional)
    INPOST_WEBHOOK_SIGNATURE_TYPE: str = "HMAC"  # HMAC, DIGITAL, BASIC, or API_KEY
    INPOST_WEBHOOK_SIGNATURE_BODY: str = "timestamp_body"  # body or timestamp_body
    INPOST_WEBHOOK_CERTIFICATE_PATH: str = ""  # Path to InPost public certificate (.pem file)

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

    # CORS
    FRONTEND_URL: str
    BACKEND_URL: Optional[str] = None  # Backend API URL (defaults to FRONTEND_URL if not set)
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # File Upload
    UPLOAD_DIR: str = "static/uploads"
    MAX_FILE_SIZE: int = 10485760  # 10MB (increased from 5MB)
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "webp", "avif"]

    # Facebook Conversions API
    FACEBOOK_PIXEL_ID: Optional[str] = None  # Pixel ID (e.g., "1552229889398632")
    FACEBOOK_ACCESS_TOKEN: Optional[str] = None  # Access token for Conversions API
    FACEBOOK_API_VERSION: str = "v18.0"  # Facebook Graph API version
    FACEBOOK_DATASET_QUALITY_TOKEN: Optional[str] = None  # Dataset Quality API token (for metrics)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

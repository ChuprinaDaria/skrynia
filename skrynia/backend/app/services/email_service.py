from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings
from app.services.email_templates import (
    generate_verification_email_html,
    generate_password_reset_email_html,
    get_email_translation
)
from typing import List
import secrets
from datetime import datetime, timedelta


# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)


def generate_verification_token() -> str:
    """Generate a secure random token for email verification."""
    return secrets.token_urlsafe(32)


def generate_password_reset_code() -> str:
    """Generate a 5-digit password reset code."""
    import random
    return f"{random.randint(10000, 99999)}"


async def send_verification_email(email: str, token: str, full_name: str = None, language: str = "UA") -> None:
    """Send email verification link to user in their preferred language."""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    # Get translations for subject
    t = get_email_translation(language, "email_verification")

    # Generate HTML content with brand styling
    html_content = generate_verification_email_html(
        language=language,
        full_name=full_name or "",
        verification_url=verification_url
    )

    message = MessageSchema(
        subject=t.get("subject", "Підтвердження електронної адреси - Skrynia"),
        recipients=[email],
        body=html_content,
        subtype="html"
    )

    await fm.send_message(message)


async def send_password_reset_code_email(email: str, code: str, full_name: str = None, language: str = "UA") -> None:
    """Send 5-digit password reset code to user in their preferred language."""
    # Get translations for subject
    t = get_email_translation(language, "password_reset")

    # Generate HTML content with brand styling
    html_content = generate_password_reset_email_html(
        language=language,
        full_name=full_name or "",
        reset_code=code
    )

    message = MessageSchema(
        subject=t.get("subject", "Код для скидання пароля - Skrynia"),
        recipients=[email],
        body=html_content,
        subtype="html"
    )

    await fm.send_message(message)


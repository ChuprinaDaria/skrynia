from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings
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


async def send_verification_email(email: str, token: str, full_name: str = None) -> None:
    """Send email verification link to user."""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    
    name = full_name or "Користувач"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }}
            .content {{
                background-color: #ffffff;
                padding: 30px;
                border: 1px solid #e0e0e0;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Ласкаво просимо до Skrynia!</h1>
            </div>
            <div class="content">
                <p>Вітаємо, {name}!</p>
                <p>Дякуємо за реєстрацію. Будь ласка, підтвердіть вашу електронну адресу, натиснувши на кнопку нижче:</p>
                <p style="text-align: center;">
                    <a href="{verification_url}" class="button">Підтвердити email</a>
                </p>
                <p>Або скопіюйте та вставте це посилання у ваш браузер:</p>
                <p style="word-break: break-all; color: #007bff;">{verification_url}</p>
                <p><strong>Важливо:</strong> Це посилання дійсне протягом 24 годин.</p>
                <p>Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.</p>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} Skrynia. Всі права захищені.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Підтвердження електронної адреси - Skrynia",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    
    await fm.send_message(message)


async def send_password_reset_code_email(email: str, code: str, full_name: str = None) -> None:
    """Send 5-digit password reset code to user."""
    name = full_name or "Користувач"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }}
            .content {{
                background-color: #ffffff;
                padding: 30px;
                border: 1px solid #e0e0e0;
            }}
            .code-box {{
                background-color: #f8f9fa;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #007bff;
            }}
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }}
            .warning {{
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Скидання пароля</h1>
            </div>
            <div class="content">
                <p>Вітаємо, {name}!</p>
                <p>Ми отримали запит на скидання пароля для вашого облікового запису.</p>
                <p>Використайте цей код для підтвердження:</p>
                <div class="code-box">
                    {code}
                </div>
                <div class="warning">
                    <p><strong>Важливо:</strong></p>
                    <ul>
                        <li>Цей код дійсний протягом 15 хвилин</li>
                        <li>Не надавайте цей код нікому</li>
                        <li>Якщо ви не запитували скидання пароля, проігноруйте цей лист</li>
                    </ul>
                </div>
                <p>Введіть цей код на сторінці скидання пароля для встановлення нового пароля.</p>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} Skrynia. Всі права захищені.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Код для скидання пароля - Skrynia",
        recipients=[email],
        body=html_content,
        subtype="html"
    )
    
    await fm.send_message(message)


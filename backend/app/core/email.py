from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from typing import List, Dict, Any
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

fm = FastMail(conf)


async def send_email(
    email_to: str,
    subject: str,
    body: str,
    subtype: MessageType = MessageType.html
) -> bool:
    """Send an email"""
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=body,
            subtype=subtype,
        )
        await fm.send_message(message)
        logger.info(f"Email sent successfully to {email_to}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {str(e)}")
        return False


def get_verification_email_template(verification_url: str, user_name: str) -> str:
    """Generate email verification template"""
    return f"""
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
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Вітаємо в Скрині Пані Дарії!</h2>
            <p>Привіт {user_name},</p>
            <p>Дякуємо за реєстрацію! Будь ласка, підтвердіть свою електронну адресу, натиснувши кнопку нижче:</p>
            <a href="{verification_url}" class="button">Підтвердити Email</a>
            <p>Або скопіюйте це посилання в браузер:</p>
            <p>{verification_url}</p>
            <p>Це посилання дійсне протягом 24 годин.</p>
            <div class="footer">
                <p>Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.</p>
                <p>З повагою,<br>Команда Скриня Пані Дарії</p>
            </div>
        </div>
    </body>
    </html>
    """


def get_password_reset_email_template(reset_url: str, user_name: str) -> str:
    """Generate password reset email template"""
    return f"""
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
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Відновлення паролю</h2>
            <p>Привіт {user_name},</p>
            <p>Ви запросили відновлення паролю для вашого облікового запису. Натисніть кнопку нижче, щоб встановити новий пароль:</p>
            <a href="{reset_url}" class="button">Відновити пароль</a>
            <p>Або скопіюйте це посилання в браузер:</p>
            <p>{reset_url}</p>
            <p>Це посилання дійсне протягом 1 години.</p>
            <div class="footer">
                <p>Якщо ви не запитували відновлення паролю, просто проігноруйте цей лист. Ваш пароль залишиться незмінним.</p>
                <p>З повагою,<br>Команда Скриня Пані Дарії</p>
            </div>
        </div>
    </body>
    </html>
    """


def get_order_status_email_template(order_number: str, status: str, customer_name: str, tracking_url: str = None) -> str:
    """Generate order status update email template"""
    status_messages = {
        "paid": "Ваше замовлення оплачено",
        "processing": "Ваше замовлення обробляється",
        "shipped": "Ваше замовлення відправлено",
        "delivered": "Ваше замовлення доставлено",
    }

    status_message = status_messages.get(status, "Статус вашого замовлення оновлено")

    tracking_section = ""
    if tracking_url:
        tracking_section = f"""
        <p>Ви можете відстежити своє замовлення за цим посиланням:</p>
        <a href="{tracking_url}" class="button">Відстежити замовлення</a>
        """

    return f"""
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
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .order-info {{
                background-color: #f5f5f5;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>{status_message}</h2>
            <p>Привіт {customer_name},</p>
            <div class="order-info">
                <p><strong>Номер замовлення:</strong> {order_number}</p>
                <p><strong>Статус:</strong> {status_message}</p>
            </div>
            {tracking_section}
            <div class="footer">
                <p>Дякуємо, що обрали Скриню Пані Дарії!</p>
                <p>З повагою,<br>Команда Скриня Пані Дарії</p>
            </div>
        </div>
    </body>
    </html>
    """


def get_product_view_reminder_template(product_title: str, product_url: str, customer_name: str) -> str:
    """Generate product view reminder email template"""
    return f"""
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
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Не забули про цей товар?</h2>
            <p>Привіт {customer_name},</p>
            <p>Ви недавно переглядали <strong>{product_title}</strong> на нашому сайті.</p>
            <p>Хочете додати його до кошика?</p>
            <a href="{product_url}" class="button">Переглянути товар</a>
            <div class="footer">
                <p>З повагою,<br>Команда Скриня Пані Дарії</p>
            </div>
        </div>
    </body>
    </html>
    """


def get_abandoned_cart_reminder_template(cart_url: str, customer_name: str) -> str:
    """Generate abandoned cart reminder email template"""
    return f"""
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
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>У вас незавершена покупка!</h2>
            <p>Привіт {customer_name},</p>
            <p>Ви залишили товари в кошику. Не пропустіть можливість придбати їх!</p>
            <a href="{cart_url}" class="button">Завершити покупку</a>
            <div class="footer">
                <p>З повагою,<br>Команда Скриня Пані Дарії</p>
            </div>
        </div>
    </body>
    </html>
    """

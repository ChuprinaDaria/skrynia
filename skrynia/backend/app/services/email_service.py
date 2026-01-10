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


async def send_quote_request_confirmation(
    email: str,
    quote_id: int,
    customer_name: str = None,
    necklace_summary: str = None,
    language: str = "uk"
) -> None:
    """Send confirmation email to customer after submitting quote request."""
    # Translations
    translations = {
        "uk": {
            "greeting": "Шановний клієнте",
            "title": "Запит на прорахунок намиста",
            "hello": "Вітаємо",
            "received": "Ми отримали ваш запит на прорахунок вартості намиста.",
            "quote_number": "Номер запиту",
            "details": "Деталі",
            "review_time": "Наш майстер розгляне ваш запит і надішле вам детальний прорахунок протягом",
            "hours": "24 годин",
            "will_receive": "Ви отримаєте email з:",
            "list_beads": "Переліком усіх бусин та фурнітури",
            "price_calc": "Детальною калькуляцією вартості",
            "timing_info": "Інформацією про терміни виготовлення",
            "questions": "Якщо у вас виникли додаткові питання, не соромтеся звертатися до нас.",
            "thanks": "Дякуємо за ваш інтерес до наших виробів!",
            "footer": "Конструктор намист. Всі права захищені.",
            "subject": "Запит на прорахунок #{} отримано - Skrynia"
        },
        "en": {
            "greeting": "Dear Customer",
            "title": "Necklace Price Quote Request",
            "hello": "Hello",
            "received": "We have received your request for a necklace price quote.",
            "quote_number": "Request Number",
            "details": "Details",
            "review_time": "Our craftsman will review your request and send you a detailed quote within",
            "hours": "24 hours",
            "will_receive": "You will receive an email with:",
            "list_beads": "List of all beads and hardware",
            "price_calc": "Detailed price calculation",
            "timing_info": "Information about production time",
            "questions": "If you have any questions, please feel free to contact us.",
            "thanks": "Thank you for your interest in our products!",
            "footer": "Necklace Constructor. All rights reserved.",
            "subject": "Quote Request #{} Received - Skrynia"
        },
        "de": {
            "greeting": "Sehr geehrter Kunde",
            "title": "Anfrage für Halsketten-Preisangebot",
            "hello": "Hallo",
            "received": "Wir haben Ihre Anfrage für ein Halsketten-Preisangebot erhalten.",
            "quote_number": "Anfrage-Nummer",
            "details": "Details",
            "review_time": "Unser Handwerker wird Ihre Anfrage prüfen und Ihnen innerhalb von",
            "hours": "24 Stunden",
            "will_receive": "Sie erhalten eine E-Mail mit:",
            "list_beads": "Liste aller Perlen und Beschläge",
            "price_calc": "Detaillierte Preiskalkulation",
            "timing_info": "Informationen zur Produktionszeit",
            "questions": "Bei Fragen können Sie sich gerne an uns wenden.",
            "thanks": "Vielen Dank für Ihr Interesse an unseren Produkten!",
            "footer": "Halsketten-Konstruktor. Alle Rechte vorbehalten.",
            "subject": "Preisanfrage #{} Erhalten - Skrynia"
        },
        "pl": {
            "greeting": "Szanowny Kliencie",
            "title": "Zapytanie o Wycenę Naszyjnika",
            "hello": "Witamy",
            "received": "Otrzymaliśmy Twoje zapytanie o wycenę naszyjnika.",
            "quote_number": "Numer Zapytania",
            "details": "Szczegóły",
            "review_time": "Nasz rzemieślnik przeanalizuje Twoje zapytanie i wyśle szczegółową wycenę w ciągu",
            "hours": "24 godzin",
            "will_receive": "Otrzymasz e-mail z:",
            "list_beads": "Listą wszystkich koralików i okuć",
            "price_calc": "Szczegółową kalkulacją ceny",
            "timing_info": "Informacją o czasie realizacji",
            "questions": "W razie pytań prosimy o kontakt.",
            "thanks": "Dziękujemy za zainteresowanie naszymi produktami!",
            "footer": "Konstruktor Naszyjników. Wszelkie prawa zastrzeżone.",
            "subject": "Zapytanie o Wycenę #{} Otrzymane - Skrynia"
        }
    }

    t = translations.get(language, translations["uk"])
    name = customer_name or t["greeting"]

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
            .footer {{
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }}
            .info-box {{
                background-color: #e7f3ff;
                border-left: 4px solid #007bff;
                padding: 15px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{t["title"]}</h1>
            </div>
            <div class="content">
                <p>{t["hello"]}, {name}!</p>
                <p>{t["received"]}</p>
                <div class="info-box">
                    <p><strong>{t["quote_number"]}:</strong> #{quote_id}</p>
                    {f'<p><strong>{t["details"]}:</strong> {necklace_summary}</p>' if necklace_summary else ''}
                </div>
                <p>{t["review_time"]} <strong>{t["hours"]}</strong>.</p>
                <p>{t["will_receive"]}</p>
                <ul>
                    <li>{t["list_beads"]}</li>
                    <li>{t["price_calc"]}</li>
                    <li>{t["timing_info"]}</li>
                </ul>
                <p>{t["questions"]}</p>
                <p>{t["thanks"]}</p>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} Skrynia - {t["footer"]}</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject=t["subject"].format(quote_id),
        recipients=[email],
        body=html_content,
        subtype="html"
    )

    await fm.send_message(message)


async def send_new_quote_request_notification(
    admin_email: str,
    quote_id: int,
    customer_email: str,
    customer_name: str = None,
    calculated_brutto: float = None
) -> None:
    """Send notification to admin about new quote request."""
    customer = customer_name or customer_email

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
                background-color: #28a745;
                color: white;
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
            .info-table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            .info-table td {{
                padding: 10px;
                border-bottom: 1px solid #e0e0e0;
            }}
            .info-table td:first-child {{
                font-weight: bold;
                width: 40%;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔔 Новий запит на прорахунок</h1>
            </div>
            <div class="content">
                <p>Надійшов новий запит на прорахунок вартості намиста!</p>
                <table class="info-table">
                    <tr>
                        <td>Номер запиту:</td>
                        <td><strong>#{quote_id}</strong></td>
                    </tr>
                    <tr>
                        <td>Клієнт:</td>
                        <td>{customer}</td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td>{customer_email}</td>
                    </tr>
                    {f'''<tr>
                        <td>Орієнтовна вартість:</td>
                        <td><strong>{calculated_brutto:.2f} PLN</strong> (автопідрахунок)</td>
                    </tr>''' if calculated_brutto else ''}
                </table>
                <p style="text-align: center;">
                    <a href="{settings.FRONTEND_URL}/admin/quotes/{quote_id}" class="button">
                        Переглянути запит в адмінці
                    </a>
                </p>
                <p><small>Не забудьте надіслати клієнту прорахунок протягом 24 годин!</small></p>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} Skrynia - Адмін система</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject=f"🔔 Новий запит на прорахунок #{quote_id}",
        recipients=[admin_email],
        body=html_content,
        subtype="html"
    )

    await fm.send_message(message)


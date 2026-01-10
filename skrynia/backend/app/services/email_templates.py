"""
Email templates for order status notifications and cart reminders.
Supports multiple languages: UA, EN, DE, PL
"""
from typing import Dict, List, Optional
from datetime import datetime
from app.core.config import settings


# Email translations
EMAIL_TRANSLATIONS = {
    "UA": {
        "email_verification": {
            "subject": "Підтвердження електронної адреси - Skrynia",
            "title": "Ласкаво просимо до Skrynia!",
            "greeting": "Вітаємо",
            "verification_text": "Дякуємо за реєстрацію. Будь ласка, підтвердіть вашу електронну адресу, натиснувши на кнопку нижче:",
            "verify_button": "Підтвердити email",
            "or_copy_link": "Або скопіюйте та вставте це посилання у ваш браузер:",
            "important": "Важливо:",
            "expires_in": "Це посилання дійсне протягом 24 годин.",
            "ignore_if_not_you": "Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.",
            "footer": "© {year} Skrynia. Всі права захищені."
        },
        "password_reset": {
            "subject": "Код для скидання пароля - Skrynia",
            "title": "Скидання пароля",
            "greeting": "Вітаємо",
            "reset_text": "Ми отримали запит на скидання пароля для вашого облікового запису.",
            "use_code": "Використайте цей код для підтвердження:",
            "important": "Важливо:",
            "expires_in": "Цей код дійсний протягом 15 хвилин",
            "dont_share": "Не надавайте цей код нікому",
            "ignore_if_not_you": "Якщо ви не запитували скидання пароля, проігноруйте цей лист",
            "enter_code": "Введіть цей код на сторінці скидання пароля для встановлення нового пароля.",
            "footer": "© {year} Skrynia. Всі права захищені."
        },
        "order_received": {
            "subject": "Ваше замовлення прийнято - Skrynia",
            "title": "Дякуємо за ваше замовлення!",
            "greeting": "Вітаємо",
            "order_received_text": "Ваше замовлення успішно прийнято і обробляється.",
            "order_number": "Номер замовлення",
            "order_date": "Дата замовлення",
            "total": "Загальна сума",
            "items": "Товари",
            "next_steps": "Наступні кроки",
            "next_steps_text": "Ми підтвердимо ваше замовлення найближчим часом.",
            "view_order": "Переглянути замовлення",
            "footer": "© {year} Skrynia. Всі права захищені."
        },
        "order_confirmed": {
            "subject": "Ваше замовлення підтверджено - Skrynia",
            "title": "Замовлення підтверджено!",
            "greeting": "Вітаємо",
            "order_confirmed_text": "Ваше замовлення підтверджено і готується до відправки.",
            "order_number": "Номер замовлення",
            "payment_status": "Статус оплати",
            "paid": "Оплачено",
            "pending": "Очікує оплати",
            "view_order": "Переглянути замовлення"
        },
        "order_shipped": {
            "subject": "Ваше замовлення відправлено - Skrynia",
            "title": "Замовлення в дорозі!",
            "greeting": "Вітаємо",
            "order_shipped_text": "Ваше замовлення відправлено і вже в дорозі до вас.",
            "order_number": "Номер замовлення",
            "tracking_number": "Номер відстеження",
            "track_order": "Відстежити замовлення",
            "estimated_delivery": "Орієнтовна дата доставки"
        },
        "order_delivered": {
            "subject": "Ваше замовлення доставлено - Skrynia",
            "title": "Замовлення доставлено!",
            "greeting": "Вітаємо",
            "order_delivered_text": "Ваше замовлення успішно доставлено.",
            "order_number": "Номер замовлення",
            "thank_you": "Дякуємо за покупку!",
            "review": "Залишити відгук",
            "shop_again": "Продовжити покупки"
        },
        "cart_reminder": {
            "subject": "Не забудьте завершити покупку - Skrynia",
            "title": "У вас є товари в корзині",
            "greeting": "Вітаємо",
            "cart_reminder_text": "Ми помітили, що у вас є товари в корзині, які ви ще не завершили.",
            "items_count": "товарів",
            "continue_shopping": "Продовжити покупку",
            "view_cart": "Переглянути корзину"
        }
    },
    "EN": {
        "email_verification": {
            "subject": "Email Verification - Skrynia",
            "title": "Welcome to Skrynia!",
            "greeting": "Hello",
            "verification_text": "Thank you for registering. Please confirm your email address by clicking the button below:",
            "verify_button": "Verify Email",
            "or_copy_link": "Or copy and paste this link into your browser:",
            "important": "Important:",
            "expires_in": "This link is valid for 24 hours.",
            "ignore_if_not_you": "If you didn't register on our website, please ignore this email.",
            "footer": "© {year} Skrynia. All rights reserved."
        },
        "password_reset": {
            "subject": "Password Reset Code - Skrynia",
            "title": "Password Reset",
            "greeting": "Hello",
            "reset_text": "We received a password reset request for your account.",
            "use_code": "Use this code to verify:",
            "important": "Important:",
            "expires_in": "This code is valid for 15 minutes",
            "dont_share": "Do not share this code with anyone",
            "ignore_if_not_you": "If you didn't request a password reset, please ignore this email",
            "enter_code": "Enter this code on the password reset page to set a new password.",
            "footer": "© {year} Skrynia. All rights reserved."
        },
        "order_received": {
            "subject": "Your order has been received - Skrynia",
            "title": "Thank you for your order!",
            "greeting": "Hello",
            "order_received_text": "Your order has been successfully received and is being processed.",
            "order_number": "Order number",
            "order_date": "Order date",
            "total": "Total",
            "items": "Items",
            "next_steps": "Next steps",
            "next_steps_text": "We will confirm your order shortly.",
            "view_order": "View order",
            "footer": "© {year} Skrynia. All rights reserved."
        },
        "order_confirmed": {
            "subject": "Your order has been confirmed - Skrynia",
            "title": "Order confirmed!",
            "greeting": "Hello",
            "order_confirmed_text": "Your order has been confirmed and is being prepared for shipment.",
            "order_number": "Order number",
            "payment_status": "Payment status",
            "paid": "Paid",
            "pending": "Pending payment",
            "view_order": "View order"
        },
        "order_shipped": {
            "subject": "Your order has been shipped - Skrynia",
            "title": "Order on the way!",
            "greeting": "Hello",
            "order_shipped_text": "Your order has been shipped and is on its way to you.",
            "order_number": "Order number",
            "tracking_number": "Tracking number",
            "track_order": "Track order",
            "estimated_delivery": "Estimated delivery date"
        },
        "order_delivered": {
            "subject": "Your order has been delivered - Skrynia",
            "title": "Order delivered!",
            "greeting": "Hello",
            "order_delivered_text": "Your order has been successfully delivered.",
            "order_number": "Order number",
            "thank_you": "Thank you for your purchase!",
            "review": "Leave a review",
            "shop_again": "Continue shopping"
        },
        "cart_reminder": {
            "subject": "Don't forget to complete your purchase - Skrynia",
            "title": "You have items in your cart",
            "greeting": "Hello",
            "cart_reminder_text": "We noticed you have items in your cart that you haven't completed yet.",
            "items_count": "items",
            "continue_shopping": "Continue shopping",
            "view_cart": "View cart"
        }
    },
    "DE": {
        "email_verification": {
            "subject": "E-Mail-Bestätigung - Skrynia",
            "title": "Willkommen bei Skrynia!",
            "greeting": "Hallo",
            "verification_text": "Vielen Dank für Ihre Registrierung. Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken:",
            "verify_button": "E-Mail bestätigen",
            "or_copy_link": "Oder kopieren Sie diesen Link und fügen Sie ihn in Ihren Browser ein:",
            "important": "Wichtig:",
            "expires_in": "Dieser Link ist 24 Stunden gültig.",
            "ignore_if_not_you": "Wenn Sie sich nicht auf unserer Website registriert haben, ignorieren Sie diese E-Mail bitte.",
            "footer": "© {year} Skrynia. Alle Rechte vorbehalten."
        },
        "password_reset": {
            "subject": "Passwort-Wiederherstellungscode - Skrynia",
            "title": "Passwort zurücksetzen",
            "greeting": "Hallo",
            "reset_text": "Wir haben eine Anfrage zum Zurücksetzen des Passworts für Ihr Konto erhalten.",
            "use_code": "Verwenden Sie diesen Code zur Bestätigung:",
            "important": "Wichtig:",
            "expires_in": "Dieser Code ist 15 Minuten gültig",
            "dont_share": "Teilen Sie diesen Code mit niemandem",
            "ignore_if_not_you": "Wenn Sie keine Passwortzurücksetzung angefordert haben, ignorieren Sie diese E-Mail",
            "enter_code": "Geben Sie diesen Code auf der Seite zum Zurücksetzen des Passworts ein, um ein neues Passwort festzulegen.",
            "footer": "© {year} Skrynia. Alle Rechte vorbehalten."
        },
        "order_received": {
            "subject": "Ihre Bestellung wurde erhalten - Skrynia",
            "title": "Vielen Dank für Ihre Bestellung!",
            "greeting": "Hallo",
            "order_received_text": "Ihre Bestellung wurde erfolgreich erhalten und wird bearbeitet.",
            "order_number": "Bestellnummer",
            "order_date": "Bestelldatum",
            "total": "Gesamt",
            "items": "Artikel",
            "next_steps": "Nächste Schritte",
            "next_steps_text": "Wir werden Ihre Bestellung in Kürze bestätigen.",
            "view_order": "Bestellung ansehen",
            "footer": "© {year} Skrynia. Alle Rechte vorbehalten."
        },
        "order_confirmed": {
            "subject": "Ihre Bestellung wurde bestätigt - Skrynia",
            "title": "Bestellung bestätigt!",
            "greeting": "Hallo",
            "order_confirmed_text": "Ihre Bestellung wurde bestätigt und wird für den Versand vorbereitet.",
            "order_number": "Bestellnummer",
            "payment_status": "Zahlungsstatus",
            "paid": "Bezahlt",
            "pending": "Zahlung ausstehend",
            "view_order": "Bestellung ansehen"
        },
        "order_shipped": {
            "subject": "Ihre Bestellung wurde versendet - Skrynia",
            "title": "Bestellung unterwegs!",
            "greeting": "Hallo",
            "order_shipped_text": "Ihre Bestellung wurde versendet und ist auf dem Weg zu Ihnen.",
            "order_number": "Bestellnummer",
            "tracking_number": "Sendungsnummer",
            "track_order": "Bestellung verfolgen",
            "estimated_delivery": "Voraussichtliches Lieferdatum"
        },
        "order_delivered": {
            "subject": "Ihre Bestellung wurde geliefert - Skrynia",
            "title": "Bestellung geliefert!",
            "greeting": "Hallo",
            "order_delivered_text": "Ihre Bestellung wurde erfolgreich geliefert.",
            "order_number": "Bestellnummer",
            "thank_you": "Vielen Dank für Ihren Kauf!",
            "review": "Bewertung abgeben",
            "shop_again": "Weiter einkaufen"
        },
        "cart_reminder": {
            "subject": "Vergessen Sie nicht, Ihren Kauf abzuschließen - Skrynia",
            "title": "Sie haben Artikel in Ihrem Warenkorb",
            "greeting": "Hallo",
            "cart_reminder_text": "Wir haben bemerkt, dass Sie Artikel in Ihrem Warenkorb haben, die Sie noch nicht abgeschlossen haben.",
            "items_count": "Artikel",
            "continue_shopping": "Weiter einkaufen",
            "view_cart": "Warenkorb ansehen"
        }
    },
    "PL": {
        "email_verification": {
            "subject": "Weryfikacja adresu e-mail - Skrynia",
            "title": "Witamy w Skrynia!",
            "greeting": "Witaj",
            "verification_text": "Dziękujemy za rejestrację. Proszę potwierdzić swój adres e-mail, klikając przycisk poniżej:",
            "verify_button": "Potwierdź e-mail",
            "or_copy_link": "Lub skopiuj i wklej ten link do przeglądarki:",
            "important": "Ważne:",
            "expires_in": "Ten link jest ważny przez 24 godziny.",
            "ignore_if_not_you": "Jeśli nie rejestrowałeś się na naszej stronie, zignoruj tę wiadomość.",
            "footer": "© {year} Skrynia. Wszelkie prawa zastrzeżone."
        },
        "password_reset": {
            "subject": "Kod resetowania hasła - Skrynia",
            "title": "Resetowanie hasła",
            "greeting": "Witaj",
            "reset_text": "Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.",
            "use_code": "Użyj tego kodu do weryfikacji:",
            "important": "Ważne:",
            "expires_in": "Ten kod jest ważny przez 15 minut",
            "dont_share": "Nie udostępniaj tego kodu nikomu",
            "ignore_if_not_you": "Jeśli nie prosiłeś o resetowanie hasła, zignoruj tę wiadomość",
            "enter_code": "Wprowadź ten kod na stronie resetowania hasła, aby ustawić nowe hasło.",
            "footer": "© {year} Skrynia. Wszelkie prawa zastrzeżone."
        },
        "order_received": {
            "subject": "Twoje zamówienie zostało przyjęte - Skrynia",
            "title": "Dziękujemy za zamówienie!",
            "greeting": "Witaj",
            "order_received_text": "Twoje zamówienie zostało pomyślnie przyjęte i jest przetwarzane.",
            "order_number": "Numer zamówienia",
            "order_date": "Data zamówienia",
            "total": "Razem",
            "items": "Produkty",
            "next_steps": "Następne kroki",
            "next_steps_text": "Wkrótce potwierdzimy Twoje zamówienie.",
            "view_order": "Zobacz zamówienie",
            "footer": "© {year} Skrynia. Wszelkie prawa zastrzeżone."
        },
        "order_confirmed": {
            "subject": "Twoje zamówienie zostało potwierdzone - Skrynia",
            "title": "Zamówienie potwierdzone!",
            "greeting": "Witaj",
            "order_confirmed_text": "Twoje zamówienie zostało potwierdzone i jest przygotowywane do wysyłki.",
            "order_number": "Numer zamówienia",
            "payment_status": "Status płatności",
            "paid": "Opłacone",
            "pending": "Oczekuje na płatność",
            "view_order": "Zobacz zamówienie"
        },
        "order_shipped": {
            "subject": "Twoje zamówienie zostało wysłane - Skrynia",
            "title": "Zamówienie w drodze!",
            "greeting": "Witaj",
            "order_shipped_text": "Twoje zamówienie zostało wysłane i jest w drodze do Ciebie.",
            "order_number": "Numer zamówienia",
            "tracking_number": "Numer śledzenia",
            "track_order": "Śledź zamówienie",
            "estimated_delivery": "Szacowana data dostawy"
        },
        "order_delivered": {
            "subject": "Twoje zamówienie zostało dostarczone - Skrynia",
            "title": "Zamówienie dostarczone!",
            "greeting": "Witaj",
            "order_delivered_text": "Twoje zamówienie zostało pomyślnie dostarczone.",
            "order_number": "Numer zamówienia",
            "thank_you": "Dziękujemy za zakup!",
            "review": "Zostaw opinię",
            "shop_again": "Kontynuuj zakupy"
        },
        "cart_reminder": {
            "subject": "Nie zapomnij dokończyć zakupu - Skrynia",
            "title": "Masz produkty w koszyku",
            "greeting": "Witaj",
            "cart_reminder_text": "Zauważyliśmy, że masz produkty w koszyku, których jeszcze nie dokończyłeś.",
            "items_count": "produktów",
            "continue_shopping": "Kontynuuj zakupy",
            "view_cart": "Zobacz koszyk"
        }
    }
}


def get_email_translation(language: str, template_key: str) -> Dict[str, str]:
    """Get email translation for specific language and template."""
    lang = language.upper() if language else "UA"
    if lang not in EMAIL_TRANSLATIONS:
        lang = "UA"  # Default to Ukrainian
    return EMAIL_TRANSLATIONS[lang].get(template_key, EMAIL_TRANSLATIONS["UA"][template_key])


def generate_order_email_html(
    language: str,
    template_type: str,
    order_data: Dict,
    items: List[Dict],
    tracking_url: Optional[str] = None
) -> str:
    """Generate HTML email for order status notifications."""
    t = get_email_translation(language, template_type)
    
    # Build items HTML
    items_html = ""
    for item in items:
        image_url = item.get("product_image", "")
        if image_url and not image_url.startswith("http"):
            image_url = f"{settings.FRONTEND_URL}{image_url}"
        
        items_html += f"""
        <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                <table width="100%">
                    <tr>
                        <td width="100" style="padding-right: 15px;">
                            <img src="{image_url}" alt="{item.get('product_title', '')}" 
                                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
                        </td>
                        <td style="vertical-align: top;">
                            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">
                                {item.get('product_title', '')}
                            </h3>
                            <p style="margin: 5px 0; color: #666; font-size: 14px;">
                                {t.get('items', 'Items')}: {item.get('quantity', 1)} × {item.get('price', 0):.2f} {order_data.get('currency', 'PLN')}
                            </p>
                            <p style="margin: 5px 0; color: #333; font-weight: bold; font-size: 16px;">
                                {item.get('subtotal', 0):.2f} {order_data.get('currency', 'PLN')}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """
    
    # Tracking section
    tracking_html = ""
    if tracking_url:
        tracking_html = f"""
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #1976d2;">
                {t.get('tracking_number', 'Tracking number')}: {order_data.get('tracking_number', '')}
            </p>
            <a href="{tracking_url}" 
               style="display: inline-block; padding: 12px 30px; background-color: #1976d2; color: #ffffff; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
                {t.get('track_order', 'Track order')}
            </a>
        </div>
        """
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }}
            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .order-info {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }}
            .order-info p {{
                margin: 8px 0;
                color: #666;
            }}
            .order-info strong {{
                color: #333;
            }}
            .items-table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            .total-section {{
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: right;
            }}
            .total-section h2 {{
                margin: 0;
                color: #333;
                font-size: 24px;
            }}
            .button {{
                display: inline-block;
                padding: 14px 35px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
                text-align: center;
            }}
            .footer {{
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }}
            .divider {{
                height: 1px;
                background-color: #e0e0e0;
                margin: 30px 0;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>{t.get('title', '')}</h1>
            </div>
            <div class="content">
                <p style="font-size: 16px;">
                    {t.get('greeting', 'Hello')}, {order_data.get('customer_name', 'Customer')}!
                </p>
                <p style="font-size: 16px; color: #666;">
                    {t.get(f'{template_type}_text', '')}
                </p>
                
                <div class="order-info">
                    <p><strong>{t.get('order_number', 'Order number')}:</strong> {order_data.get('order_number', '')}</p>
                    <p><strong>{t.get('order_date', 'Order date')}:</strong> {order_data.get('created_at', '')}</p>
                    {f'<p><strong>{t.get("payment_status", "Payment status")}:</strong> {t.get("paid" if order_data.get("payment_status") == "completed" else "pending", "")}</p>' if template_type == 'order_confirmed' else ''}
                </div>
                
                {tracking_html}
                
                <h2 style="color: #333; margin-top: 30px;">{t.get('items', 'Items')}</h2>
                <table class="items-table">
                    {items_html}
                </table>
                
                <div class="total-section">
                    <p style="margin: 5px 0; color: #666;">{t.get('total', 'Total')}:</p>
                    <h2>{order_data.get('total', 0):.2f} {order_data.get('currency', 'PLN')}</h2>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{settings.FRONTEND_URL}/orders/{order_data.get('order_number', '')}" class="button">
                        {t.get('view_order', 'View order')}
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>{t.get('footer', '').format(year=datetime.now().year)}</p>
                <p style="margin-top: 10px;">
                    <a href="{settings.FRONTEND_URL}" style="color: #667eea; text-decoration: none;">Skrynia</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html


def generate_cart_reminder_html(
    language: str,
    customer_name: str,
    items: List[Dict],
    items_count: int
) -> str:
    """Generate HTML email for cart reminder."""
    t = get_email_translation(language, "cart_reminder")
    
    # Build items HTML
    items_html = ""
    for item in items[:3]:  # Show max 3 items
        image_url = item.get("image", "")
        if image_url and not image_url.startswith("http"):
            image_url = f"{settings.FRONTEND_URL}{image_url}"
        
        items_html += f"""
        <tr>
            <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">
                <table width="100%">
                    <tr>
                        <td width="80" style="padding-right: 15px;">
                            <img src="{image_url}" alt="{item.get('title', '')}" 
                                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
                        </td>
                        <td style="vertical-align: top;">
                            <h3 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">
                                {item.get('title', '')}
                            </h3>
                            <p style="margin: 0; color: #666; font-size: 14px;">
                                {item.get('price', 0):.2f} {item.get('currency', 'PLN')}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """
    
    if items_count > 3:
        items_html += f"""
        <tr>
            <td style="padding: 15px; text-align: center; color: #666;">
                + {items_count - 3} {t.get('items_count', 'items')}
            </td>
        </tr>
        """
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }}
            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .items-table {{
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }}
            .button {{
                display: inline-block;
                padding: 14px 35px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
                text-align: center;
            }}
            .footer {{
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>{t.get('title', '')}</h1>
            </div>
            <div class="content">
                <p style="font-size: 16px;">
                    {t.get('greeting', 'Hello')}, {customer_name}!
                </p>
                <p style="font-size: 16px; color: #666;">
                    {t.get('cart_reminder_text', '')}
                </p>
                
                <h2 style="color: #333; margin-top: 30px;">{items_count} {t.get('items_count', 'items')}</h2>
                <table class="items-table">
                    {items_html}
                </table>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{settings.FRONTEND_URL}/cart" class="button">
                        {t.get('view_cart', 'View cart')}
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>© {datetime.now().year} Skrynia. {t.get('footer', 'All rights reserved.')}</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html


def generate_verification_email_html(
    language: str,
    full_name: str,
    verification_url: str
) -> str:
    """Generate HTML email for email verification with brand styling."""
    t = get_email_translation(language, "email_verification")
    name = full_name or t.get('greeting', 'Вітаємо')

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #FFFFF0;
                margin: 0;
                padding: 0;
                background-color: #0A0A0A;
            }}
            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #1a1a1a;
            }}
            .header {{
                background: linear-gradient(135deg, #800020 0%, #600018 100%);
                padding: 40px 20px;
                text-align: center;
                color: #FFFFF0;
                border-bottom: 2px solid #9CAF88;
            }}
            .header h1 {{
                margin: 0;
                font-size: 32px;
                font-weight: 300;
                font-family: 'Georgia', serif;
            }}
            .content {{
                padding: 40px 30px;
                background-color: #1a1a1a;
                color: #FFFFF0;
            }}
            .button {{
                display: inline-block;
                padding: 16px 40px;
                background-color: #800020;
                color: #FFFFF0;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: bold;
                text-align: center;
                transition: background-color 0.3s;
            }}
            .button:hover {{
                background-color: #600018;
            }}
            .info-box {{
                background-color: rgba(156, 175, 136, 0.1);
                border-left: 4px solid #9CAF88;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }}
            .footer {{
                background-color: #0A0A0A;
                padding: 30px;
                text-align: center;
                color: #9CAF88;
                font-size: 12px;
                border-top: 1px solid rgba(156, 175, 136, 0.2);
            }}
            .link-text {{
                color: #9CAF88;
                word-break: break-all;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>{t.get('title', 'Ласкаво просимо до Skrynia!')}</h1>
            </div>
            <div class="content">
                <p style="font-size: 18px; color: #FFFFF0;">
                    {t.get('greeting', 'Вітаємо')}, {name}!
                </p>
                <p style="font-size: 16px; color: #9CAF88;">
                    {t.get('verification_text', 'Дякуємо за реєстрацію.')}
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_url}" class="button">
                        {t.get('verify_button', 'Підтвердити email')}
                    </a>
                </div>

                <p style="font-size: 14px; color: #9CAF88;">
                    {t.get('or_copy_link', 'Або скопіюйте та вставте це посилання у ваш браузер:')}
                </p>
                <p class="link-text" style="font-size: 12px;">
                    {verification_url}
                </p>

                <div class="info-box">
                    <p style="margin: 0; font-weight: bold; color: #FFFFF0;">
                        {t.get('important', 'Важливо:')}
                    </p>
                    <p style="margin: 10px 0 0 0; color: #9CAF88; font-size: 14px;">
                        {t.get('expires_in', 'Це посилання дійсне протягом 24 годин.')}
                    </p>
                </div>

                <p style="font-size: 14px; color: #9CAF88;">
                    {t.get('ignore_if_not_you', 'Якщо ви не реєструвалися, проігноруйте цей лист.')}
                </p>
            </div>
            <div class="footer">
                <p>{t.get('footer', '© {year} Skrynia. Всі права захищені.').format(year=datetime.now().year)}</p>
            </div>
        </div>
    </body>
    </html>
    """

    return html


def generate_password_reset_email_html(
    language: str,
    full_name: str,
    reset_code: str
) -> str:
    """Generate HTML email for password reset code with brand styling."""
    t = get_email_translation(language, "password_reset")
    name = full_name or t.get('greeting', 'Вітаємо')

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #FFFFF0;
                margin: 0;
                padding: 0;
                background-color: #0A0A0A;
            }}
            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #1a1a1a;
            }}
            .header {{
                background: linear-gradient(135deg, #800020 0%, #600018 100%);
                padding: 40px 20px;
                text-align: center;
                color: #FFFFF0;
                border-bottom: 2px solid #9CAF88;
            }}
            .header h1 {{
                margin: 0;
                font-size: 32px;
                font-weight: 300;
                font-family: 'Georgia', serif;
            }}
            .content {{
                padding: 40px 30px;
                background-color: #1a1a1a;
                color: #FFFFF0;
            }}
            .code-box {{
                background: linear-gradient(135deg, rgba(128, 0, 32, 0.2) 0%, rgba(96, 0, 24, 0.2) 100%);
                border: 2px solid #800020;
                border-radius: 8px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
                font-size: 42px;
                font-weight: bold;
                letter-spacing: 12px;
                color: #FFFFF0;
                font-family: 'Courier New', monospace;
            }}
            .warning-box {{
                background-color: rgba(156, 175, 136, 0.1);
                border-left: 4px solid #9CAF88;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
            }}
            .warning-box ul {{
                margin: 10px 0;
                padding-left: 20px;
                color: #9CAF88;
            }}
            .footer {{
                background-color: #0A0A0A;
                padding: 30px;
                text-align: center;
                color: #9CAF88;
                font-size: 12px;
                border-top: 1px solid rgba(156, 175, 136, 0.2);
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>{t.get('title', 'Скидання пароля')}</h1>
            </div>
            <div class="content">
                <p style="font-size: 18px; color: #FFFFF0;">
                    {t.get('greeting', 'Вітаємо')}, {name}!
                </p>
                <p style="font-size: 16px; color: #9CAF88;">
                    {t.get('reset_text', 'Ми отримали запит на скидання пароля.')}
                </p>
                <p style="font-size: 16px; color: #FFFFF0;">
                    {t.get('use_code', 'Використайте цей код для підтвердження:')}
                </p>

                <div class="code-box">
                    {reset_code}
                </div>

                <div class="warning-box">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #FFFFF0;">
                        {t.get('important', 'Важливо:')}
                    </p>
                    <ul style="margin: 0;">
                        <li>{t.get('expires_in', 'Цей код дійсний протягом 15 хвилин')}</li>
                        <li>{t.get('dont_share', 'Не надавайте цей код нікому')}</li>
                        <li>{t.get('ignore_if_not_you', 'Якщо ви не запитували скидання пароля, проігноруйте цей лист')}</li>
                    </ul>
                </div>

                <p style="font-size: 14px; color: #9CAF88;">
                    {t.get('enter_code', 'Введіть цей код на сторінці скидання пароля.')}
                </p>
            </div>
            <div class="footer">
                <p>{t.get('footer', '© {year} Skrynia. Всі права захищені.').format(year=datetime.now().year)}</p>
            </div>
        </div>
    </body>
    </html>
    """

    return html

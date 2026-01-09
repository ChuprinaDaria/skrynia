from app.celery_worker import celery_app
from app.core.email import (
    send_email,
    get_verification_email_template,
    get_password_reset_email_template,
    get_order_status_email_template,
    get_product_view_reminder_template,
    get_abandoned_cart_reminder_template,
)
from app.core.config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)


def run_async(coro):
    """Helper to run async functions in Celery tasks"""
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(coro)


@celery_app.task(name="app.tasks.email_tasks.send_verification_email")
def send_verification_email(email: str, token: str, user_name: str):
    """Send email verification link"""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    body = get_verification_email_template(verification_url, user_name)

    result = run_async(send_email(
        email_to=email,
        subject="Підтвердження email - Скриня Пані Дарії",
        body=body
    ))

    return {"success": result, "email": email}


@celery_app.task(name="app.tasks.email_tasks.send_password_reset_email")
def send_password_reset_email(email: str, token: str, user_name: str):
    """Send password reset link"""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    body = get_password_reset_email_template(reset_url, user_name)

    result = run_async(send_email(
        email_to=email,
        subject="Відновлення паролю - Скриня Пані Дарії",
        body=body
    ))

    return {"success": result, "email": email}


@celery_app.task(name="app.tasks.email_tasks.send_order_status_email")
def send_order_status_email(
    email: str,
    order_number: str,
    status: str,
    customer_name: str,
    tracking_url: str = None
):
    """Send order status update email"""
    body = get_order_status_email_template(
        order_number=order_number,
        status=status,
        customer_name=customer_name,
        tracking_url=tracking_url
    )

    result = run_async(send_email(
        email_to=email,
        subject=f"Оновлення статусу замовлення #{order_number}",
        body=body
    ))

    return {"success": result, "email": email, "order_number": order_number}


@celery_app.task(name="app.tasks.email_tasks.send_product_view_reminder_email")
def send_product_view_reminder_email(
    email: str,
    product_title: str,
    product_slug: str,
    customer_name: str
):
    """Send product view reminder email"""
    product_url = f"{settings.FRONTEND_URL}/products/{product_slug}"
    body = get_product_view_reminder_template(
        product_title=product_title,
        product_url=product_url,
        customer_name=customer_name
    )

    result = run_async(send_email(
        email_to=email,
        subject=f"Не забули про {product_title}?",
        body=body
    ))

    return {"success": result, "email": email}


@celery_app.task(name="app.tasks.email_tasks.send_abandoned_cart_reminder_email")
def send_abandoned_cart_reminder_email(email: str, customer_name: str):
    """Send abandoned cart reminder email"""
    cart_url = f"{settings.FRONTEND_URL}/cart"
    body = get_abandoned_cart_reminder_template(
        cart_url=cart_url,
        customer_name=customer_name
    )

    result = run_async(send_email(
        email_to=email,
        subject="У вас незавершена покупка! - Скриня Пані Дарії",
        body=body
    ))

    return {"success": result, "email": email}

from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

# Create Celery app
celery_app = Celery(
    "skrynia",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Kiev",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Import tasks
from app.tasks import email_tasks, reminder_tasks  # noqa

# Celery Beat schedule for periodic tasks
celery_app.conf.beat_schedule = {
    # Check for product view reminders every day at 10 AM
    "send-product-view-reminders": {
        "task": "app.tasks.reminder_tasks.send_product_view_reminders",
        "schedule": crontab(hour=10, minute=0),
    },
    # Check for abandoned cart reminders every day at 11 AM and 5 PM
    "send-abandoned-cart-reminders": {
        "task": "app.tasks.reminder_tasks.send_abandoned_cart_reminders",
        "schedule": crontab(hour="11,17", minute=0),
    },
}

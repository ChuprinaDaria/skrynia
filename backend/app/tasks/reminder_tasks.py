from app.celery_worker import celery_app
from app.tasks.email_tasks import send_product_view_reminder_email, send_abandoned_cart_reminder_email
from app.db.session import SessionLocal
from app.models.user import User, ProductView, CartItem
from app.models.product import Product
from sqlalchemy import and_
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


@celery_app.task(name="app.tasks.reminder_tasks.send_product_view_reminders")
def send_product_view_reminders():
    """
    Send reminders to users who viewed products 2-3 days ago
    but didn't add them to cart
    """
    db = SessionLocal()
    try:
        # Find product views from 2-3 days ago that haven't received reminders
        two_days_ago = datetime.utcnow() - timedelta(days=2)
        three_days_ago = datetime.utcnow() - timedelta(days=3)

        views = db.query(ProductView).filter(
            and_(
                ProductView.viewed_at >= three_days_ago,
                ProductView.viewed_at <= two_days_ago,
                ProductView.reminder_sent == False
            )
        ).all()

        sent_count = 0
        for view in views:
            user = db.query(User).filter(User.id == view.user_id).first()
            product = db.query(Product).filter(Product.id == view.product_id).first()

            if user and product and user.is_verified:
                # Send reminder email
                send_product_view_reminder_email.delay(
                    email=user.email,
                    product_title=product.title_uk,
                    product_slug=product.slug,
                    customer_name=user.full_name or "Друже"
                )

                # Mark reminder as sent
                view.reminder_sent = True
                sent_count += 1

        db.commit()
        logger.info(f"Sent {sent_count} product view reminders")
        return {"sent": sent_count}

    except Exception as e:
        logger.error(f"Error sending product view reminders: {str(e)}")
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()


@celery_app.task(name="app.tasks.reminder_tasks.send_abandoned_cart_reminders")
def send_abandoned_cart_reminders():
    """
    Send reminders to users who have items in cart for 1-2 days
    """
    db = SessionLocal()
    try:
        # Find cart items from 1-2 days ago that haven't received reminders
        one_day_ago = datetime.utcnow() - timedelta(days=1)
        two_days_ago = datetime.utcnow() - timedelta(days=2)

        cart_items = db.query(CartItem).filter(
            and_(
                CartItem.added_at >= two_days_ago,
                CartItem.added_at <= one_day_ago,
                CartItem.reminder_sent == False
            )
        ).all()

        # Group by user
        users_with_carts = {}
        for item in cart_items:
            if item.user_id not in users_with_carts:
                users_with_carts[item.user_id] = []
            users_with_carts[item.user_id].append(item)

        sent_count = 0
        for user_id, items in users_with_carts.items():
            user = db.query(User).filter(User.id == user_id).first()

            if user and user.is_verified:
                # Send abandoned cart reminder
                send_abandoned_cart_reminder_email.delay(
                    email=user.email,
                    customer_name=user.full_name or "Друже"
                )

                # Mark reminders as sent for all items of this user
                for item in items:
                    item.reminder_sent = True

                sent_count += 1

        db.commit()
        logger.info(f"Sent {sent_count} abandoned cart reminders")
        return {"sent": sent_count}

    except Exception as e:
        logger.error(f"Error sending abandoned cart reminders: {str(e)}")
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

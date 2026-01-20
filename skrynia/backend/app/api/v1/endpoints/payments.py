from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.order import Order, PaymentMethod, PaymentStatus, OrderStatus
from app.services.payment_stripe import StripePaymentService
from app.services.payment_p24 import Przelewy24PaymentService
from app.services.payments import create_checkout_session
from app.services.shipping_inpost import InPostService
from app.services.order_notifications import send_order_status_email
from app.core.config import settings
from datetime import datetime

router = APIRouter()


class PaymentIntentRequest(BaseModel):
    order_id: int
    payment_method: PaymentMethod


class BLIKPaymentRequest(BaseModel):
    order_id: int
    blik_code: Optional[str] = None


class CheckoutSessionRequest(BaseModel):
    order_id: int


@router.post("/create-payment-intent")
def create_payment_intent(
    request: PaymentIntentRequest,
    db: Session = Depends(get_db)
):
    """Create a payment intent for an order."""
    order = db.query(Order).filter(Order.id == request.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.payment_status == PaymentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid"
        )

    try:
        if request.payment_method == PaymentMethod.STRIPE:
            # Create Stripe payment intent
            payment_data = StripePaymentService.create_payment_intent(
                amount=order.total,
                currency="pln",
                metadata={
                    "order_id": order.id,
                    "order_number": order.order_number,
                    "customer_email": order.customer_email
                }
            )

            # Update order with payment intent ID
            order.payment_intent_id = payment_data["id"]
            order.payment_method = PaymentMethod.STRIPE
            db.commit()

            return {
                "client_secret": payment_data["client_secret"],
                "payment_intent_id": payment_data["id"]
            }

        elif request.payment_method == PaymentMethod.PRZELEWY24:
            # Create Przelewy24 transaction
            payment_data = Przelewy24PaymentService.create_transaction(
                order_id=order.order_number,
                amount=order.total,
                description=f"Zamówienie {order.order_number}",
                email=order.customer_email,
                customer_name=order.customer_name
            )

            # Update order
            order.payment_intent_id = payment_data["transaction_id"]
            order.payment_method = PaymentMethod.PRZELEWY24
            order.payment_details = {"token": payment_data["token"]}
            db.commit()

            return {
                "payment_url": payment_data["payment_url"],
                "transaction_id": payment_data["transaction_id"]
            }

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported payment method"
            )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment creation failed: {str(e)}"
        )


@router.post("/create-checkout-session")
def create_stripe_checkout_session(
    request: CheckoutSessionRequest,
    db: Session = Depends(get_db)
):
    """Create Stripe Checkout session for an order."""
    order = db.query(Order).filter(Order.id == request.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.payment_status in [PaymentStatus.COMPLETED, PaymentStatus.PAID_FULLY]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid"
        )

    try:
        checkout_url = create_checkout_session(order, stage=1, db=db)
        return {"checkout_url": checkout_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )


@router.post("/blik")
def create_blik_payment(
    request: BLIKPaymentRequest,
    db: Session = Depends(get_db)
):
    """Create a BLIK payment."""
    order = db.query(Order).filter(Order.id == request.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.payment_status == PaymentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid"
        )

    try:
        # Create BLIK transaction via Przelewy24
        payment_data = Przelewy24PaymentService.create_blik_transaction(
            order_id=order.order_number,
            amount=order.total,
            description=f"Zamówienie {order.order_number}",
            email=order.customer_email,
            blik_code=request.blik_code
        )

        # Update order
        order.payment_intent_id = payment_data["transaction_id"]
        order.payment_method = PaymentMethod.BLIK
        order.payment_details = {"token": payment_data["token"]}
        db.commit()

        return {
            "payment_url": payment_data["payment_url"],
            "transaction_id": payment_data["transaction_id"],
            "payment_type": "blik"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"BLIK payment creation failed: {str(e)}"
        )


@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Handle Stripe webhook events."""
    import logging
    logger = logging.getLogger(__name__)
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = StripePaymentService.verify_webhook_signature(payload, sig_header)
        logger.info(f"Stripe webhook event received: {event['type']}")

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            order_id = int(session["metadata"]["order_id"])
            payment_stage = int(session["metadata"]["payment_stage"])

            order = db.query(Order).filter(Order.id == order_id).first()

            if order:
                if payment_stage == 1:
                    order.payment_status = PaymentStatus.PAID_PARTIALLY
                    order.payment_intent_id = session.get("payment_intent")
                    if not order.paid_at:
                        order.paid_at = datetime.utcnow()
                elif payment_stage == 2:
                    order.payment_status = PaymentStatus.PAID_FULLY
                    order.status = OrderStatus.PAID
                    order.payment_intent_id = session.get("payment_intent")
                    if not order.paid_at:
                        order.paid_at = datetime.utcnow()

                    from app.models.product import Product
                    is_preorder = False
                    for item in order.items:
                        product = db.query(Product).filter(Product.id == item.product_id).first()
                        if product and product.stock_quantity == 0:
                            is_preorder = True
                            break

                    if is_preorder:
                        try:
                            from app.models.shipping import Shipment, ShippingProvider
                            existing_shipment = db.query(Shipment).filter(
                                Shipment.order_id == order.id
                            ).first()

                            if not existing_shipment:
                                inpost = InPostService(sandbox=settings.INPOST_SANDBOX)
                                
                                paczkomat_id = None
                                if order.payment_details and isinstance(order.payment_details, dict):
                                    paczkomat_id = order.payment_details.get('inpost_box_id') or order.payment_details.get('paczkomat_id')

                                if paczkomat_id:
                                    receiver = {
                                        "email": order.customer_email,
                                        "phone": order.customer_phone or "",
                                        "address": {
                                            "street": order.shipping_address_line1,
                                            "building_number": order.shipping_address_line2 or "",
                                            "city": order.shipping_city,
                                            "post_code": order.shipping_postal_code,
                                            "country_code": order.shipping_country
                                        }
                                    }
                                    
                                    name_parts = order.customer_name.split(maxsplit=1)
                                    if len(name_parts) == 2:
                                        receiver["first_name"] = name_parts[0]
                                        receiver["last_name"] = name_parts[1]
                                    else:
                                        receiver["name"] = order.customer_name
                                    
                                    service = "inpost_locker_standard"
                                    if order.shipping_country != "PL":
                                        service = "inpost_locker_standard_international"
                                    
                                    result = inpost.create_shipment(
                                        receiver=receiver,
                                        target_point=paczkomat_id,
                                        service=service,
                                        reference=order.order_number
                                    )

                                    shipment = Shipment(
                                        order_id=order.id,
                                        provider=ShippingProvider.INPOST,
                                        tracking_number=result["tracking_number"],
                                        tracking_url=f"https://inpost.pl/sledzenie-przesylek?number={result['tracking_number']}",
                                        label_url=result.get("label_url"),
                                        locker_id=paczkomat_id,
                                        provider_data={"inpost_shipment_id": result.get("shipment_id")}
                                    )

                                    db.add(shipment)
                                    order.tracking_number = result["tracking_number"]
                                    order.tracking_url = f"https://inpost.pl/sledzenie-przesylek?number={result['tracking_number']}"
                                    order.status = OrderStatus.PROCESSING
                        except Exception as e:
                            pass

                db.commit()
                db.refresh(order)

                background_tasks.add_task(
                    send_order_status_email,
                    order=order,
                    status=order.status,
                    db=db
                )

        elif event["type"] == "checkout.session.expired":
            # Юзер відкрив чекаут, пішов пити каву і закрив вкладку
            # Очищаємо "висяче" замовлення
            session = event["data"]["object"]
            if "metadata" in session and "order_id" in session["metadata"]:
                try:
                    order_id = int(session["metadata"]["order_id"])
                    order = db.query(Order).filter(Order.id == order_id).first()
                    
                    if order and order.status == OrderStatus.PENDING and order.payment_status == PaymentStatus.PENDING:
                        # Змінюємо статус на скасований, щоб не муляло очі
                        order.status = OrderStatus.CANCELLED
                        db.commit()
                except (ValueError, KeyError):
                    # Якщо немає order_id в metadata - ігноруємо
                    pass

        # Charge Events
        elif event["type"] == "charge.captured":
            # Коли charge захоплено (для delayed payment methods)
            charge = event["data"]["object"]
            payment_intent_id = charge.get("payment_intent")
            if payment_intent_id:
                order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()
                if order:
                    order.payment_status = PaymentStatus.COMPLETED
                    if not order.paid_at:
                        order.paid_at = datetime.utcnow()
                    db.commit()

        elif event["type"] == "charge.expired":
            # Коли charge прострочено
            charge = event["data"]["object"]
            payment_intent_id = charge.get("payment_intent")
            if payment_intent_id:
                order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()
                if order and order.status == OrderStatus.PENDING:
                    order.status = OrderStatus.CANCELLED
                    order.payment_status = PaymentStatus.FAILED
                    db.commit()

        elif event["type"] == "charge.failed":
            # Коли charge не вдався
            charge = event["data"]["object"]
            payment_intent_id = charge.get("payment_intent")
            if payment_intent_id:
                order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()
                if order:
                    order.payment_status = PaymentStatus.FAILED
                    db.commit()

        elif event["type"] == "charge.pending":
            # Коли charge в очікуванні (для delayed payment methods)
            charge = event["data"]["object"]
            payment_intent_id = charge.get("payment_intent")
            if payment_intent_id:
                order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()
                if order:
                    order.payment_status = PaymentStatus.PENDING
                    db.commit()

        elif event["type"] == "charge.refunded":
            # Пожарна тривога: рефанд зроблено вручну в Stripe Dashboard
            charge = event["data"]["object"]
            payment_intent_id = charge.get("payment_intent")
            
            if payment_intent_id:
                order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()
                
                if order:
                    # Оновлюємо статуси
                    order.payment_status = PaymentStatus.REFUNDED
                    order.status = OrderStatus.REFUNDED
                    db.commit()
                    
                    # Скасовуємо InPost shipment якщо можливо
                    try:
                        from app.models.shipping import Shipment, ShippingProvider, ShippingStatus
                        shipment = db.query(Shipment).filter(
                            Shipment.order_id == order.id,
                            Shipment.provider == ShippingProvider.INPOST
                        ).first()
                        
                        if shipment and shipment.status in [ShippingStatus.LABEL_CREATED, ShippingStatus.READY_TO_SEND]:
                            # Спробуємо скасувати через InPost API
                            try:
                                inpost = InPostService(sandbox=settings.INPOST_SANDBOX)
                                if shipment.provider_data and shipment.provider_data.get("inpost_shipment_id"):
                                    shipment_id = shipment.provider_data["inpost_shipment_id"]
                                    # Примітка: InPost API може не мати прямого методу скасування
                                    # Але оновлюємо статус локально
                                    shipment.status = ShippingStatus.CANCELLED
                                    db.commit()
                            except Exception:
                                # Якщо не вдалося скасувати через API - просто оновлюємо статус
                                shipment.status = ShippingStatus.CANCELLED
                                db.commit()
                    except Exception:
                        # Якщо помилка з shipment - не критично, головне статус замовлення оновлено
                        pass

        elif event["type"] == "charge.succeeded":
            # Коли charge успішний
            charge = event["data"]["object"]
            payment_intent_id = charge.get("payment_intent")
            if payment_intent_id:
                order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()
                if order:
                    if order.payment_status != PaymentStatus.PAID_PARTIALLY:
                        order.payment_status = PaymentStatus.COMPLETED
                    if not order.paid_at:
                        order.paid_at = datetime.utcnow()
                    db.commit()

        elif event["type"] == "charge.updated":
            # Коли charge оновлено (metadata, description)
            charge = event["data"]["object"]
            payment_intent_id = charge.get("payment_intent")
            if payment_intent_id:
                order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()
                if order:
                    # Можна оновити metadata замовлення якщо потрібно
                    # Поки просто логуємо
                    pass

        elif event["type"] == "charge.dispute.closed":
            # Коли dispute закрито
            dispute = event["data"]["object"]
            charge_id = dispute.get("charge")
            if charge_id:
                # Знаходимо order через charge -> payment_intent
                # Stripe API потрібен для отримання payment_intent з charge
                # Поки просто логуємо
                pass

        elif event["type"] == "charge.dispute.created":
            # Коли dispute створено
            dispute = event["data"]["object"]
            charge_id = dispute.get("charge")
            # Логуємо dispute для адміністратора
            logger.warning(f"Stripe dispute created for charge: {charge_id}")

        elif event["type"] == "charge.dispute.funds_reinstated":
            # Коли кошти повернуто після dispute
            dispute = event["data"]["object"]
            charge_id = dispute.get("charge")
            # Логуємо повернення коштів
            logger.info(f"Stripe dispute funds reinstated for charge: {charge_id}")

        elif event["type"] == "charge.dispute.funds_withdrawn":
            # Коли кошти знято через dispute
            dispute = event["data"]["object"]
            charge_id = dispute.get("charge")
            # Логуємо зняття коштів
            logger.warning(f"Stripe dispute funds withdrawn for charge: {charge_id}")

        elif event["type"] == "charge.dispute.updated":
            # Коли dispute оновлено
            dispute = event["data"]["object"]
            charge_id = dispute.get("charge")
            # Логуємо оновлення dispute
            pass

        elif event["type"] == "charge.refund.updated":
            # Коли refund оновлено
            refund = event["data"]["object"]
            charge_id = refund.get("charge")
            # Логуємо оновлення refund
            pass

        # Checkout Events
        elif event["type"] == "checkout.session.async_payment_failed":
            # Коли async payment не вдався (delayed payment methods)
            session = event["data"]["object"]
            if "metadata" in session and "order_id" in session["metadata"]:
                try:
                    order_id = int(session["metadata"]["order_id"])
                    order = db.query(Order).filter(Order.id == order_id).first()
                    if order:
                        order.payment_status = PaymentStatus.FAILED
                        db.commit()
                except (ValueError, KeyError):
                    pass

        elif event["type"] == "checkout.session.async_payment_succeeded":
            # Коли async payment успішний (delayed payment methods)
            session = event["data"]["object"]
            if "metadata" in session and "order_id" in session["metadata"]:
                try:
                    order_id = int(session["metadata"]["order_id"])
                    payment_stage = int(session["metadata"].get("payment_stage", "2"))
                    order = db.query(Order).filter(Order.id == order_id).first()
                    if order:
                        if payment_stage == 2:
                            order.payment_status = PaymentStatus.PAID_FULLY
                            order.status = OrderStatus.PAID
                        else:
                            order.payment_status = PaymentStatus.COMPLETED
                        order.payment_intent_id = session.get("payment_intent")
                        if not order.paid_at:
                            order.paid_at = datetime.utcnow()
                        db.commit()
                except (ValueError, KeyError):
                    pass

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/p24/webhook")
async def przelewy24_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Przelewy24 webhook notifications."""
    data = await request.json()

    try:
        # First verify notification sign
        if not Przelewy24PaymentService.verify_notification_sign(data):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid notification sign"
            )

        # Extract notification data
        session_id = data.get("sessionId")
        order_id = data.get("orderId")
        amount = data.get("amount") / 100  # Convert from grosze to PLN
        currency = data.get("currency", "PLN")

        # Verify transaction with P24 API
        verification = Przelewy24PaymentService.verify_transaction(
            session_id=session_id,
            amount=amount,
            order_id=order_id,
            currency=currency
        )

        if verification["verified"]:
            # Find and update order
            order = db.query(Order).filter(Order.payment_intent_id == session_id).first()

            if order:
                order.payment_status = PaymentStatus.COMPLETED
                order.status = OrderStatus.PAID
                order.paid_at = datetime.utcnow()
                db.commit()

        return {"status": "OK"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

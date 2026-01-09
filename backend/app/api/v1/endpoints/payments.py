from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.models.order import Order, PaymentMethod, PaymentStatus, OrderStatus
from app.services.payment_stripe import StripePaymentService
from app.services.payment_p24 import Przelewy24PaymentService
from datetime import datetime

router = APIRouter()


class PaymentIntentRequest(BaseModel):
    order_id: int
    payment_method: PaymentMethod


class BLIKPaymentRequest(BaseModel):
    order_id: int
    blik_code: Optional[str] = None


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
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = StripePaymentService.verify_webhook_signature(payload, sig_header)

        # Handle different event types
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            payment_intent_id = payment_intent["id"]

            # Find and update order
            order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()

            if order:
                order.payment_status = PaymentStatus.COMPLETED
                order.status = OrderStatus.PAID
                order.paid_at = datetime.utcnow()
                db.commit()

        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            payment_intent_id = payment_intent["id"]

            # Find and update order
            order = db.query(Order).filter(Order.payment_intent_id == payment_intent_id).first()

            if order:
                order.payment_status = PaymentStatus.FAILED
                db.commit()

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
        # Verify transaction
        session_id = data.get("sessionId")
        order_id = data.get("orderId")
        amount = data.get("amount") / 100  # Convert from grosze to PLN

        verification = Przelewy24PaymentService.verify_transaction(
            session_id=session_id,
            amount=amount,
            order_id=order_id
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

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

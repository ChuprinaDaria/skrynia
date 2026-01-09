import stripe
from app.core.config import settings
from typing import Dict, Any

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripePaymentService:
    @staticmethod
    def create_payment_intent(
        amount: float,
        currency: str = "pln",
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Create a Stripe payment intent.

        Args:
            amount: Amount in PLN (will be converted to groszy)
            currency: Currency code (default: pln)
            metadata: Additional metadata

        Returns:
            Payment intent data
        """
        try:
            # Stripe expects amount in smallest currency unit (groszy for PLN)
            amount_in_groszy = int(amount * 100)

            intent = stripe.PaymentIntent.create(
                amount=amount_in_groszy,
                currency=currency.lower(),
                metadata=metadata or {},
                automatic_payment_methods={"enabled": True},
            )

            return {
                "id": intent.id,
                "client_secret": intent.client_secret,
                "status": intent.status,
                "amount": amount,
                "currency": currency.upper()
            }

        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    def confirm_payment(payment_intent_id: str) -> Dict[str, Any]:
        """
        Confirm a payment intent.

        Args:
            payment_intent_id: Stripe payment intent ID

        Returns:
            Payment status
        """
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)

            return {
                "id": intent.id,
                "status": intent.status,
                "amount": intent.amount / 100,  # Convert back to PLN
                "currency": intent.currency.upper()
            }

        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    def create_refund(payment_intent_id: str, amount: float = None) -> Dict[str, Any]:
        """
        Create a refund for a payment.

        Args:
            payment_intent_id: Stripe payment intent ID
            amount: Partial refund amount (optional, full refund if not provided)

        Returns:
            Refund data
        """
        try:
            refund_data = {"payment_intent": payment_intent_id}

            if amount:
                refund_data["amount"] = int(amount * 100)

            refund = stripe.Refund.create(**refund_data)

            return {
                "id": refund.id,
                "status": refund.status,
                "amount": refund.amount / 100,
                "currency": refund.currency.upper()
            }

        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    def verify_webhook_signature(payload: bytes, sig_header: str) -> Dict[str, Any]:
        """
        Verify Stripe webhook signature.

        Args:
            payload: Request payload
            sig_header: Stripe signature header

        Returns:
            Webhook event data
        """
        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                settings.STRIPE_WEBHOOK_SECRET
            )
            return event

        except ValueError:
            raise Exception("Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise Exception("Invalid signature")

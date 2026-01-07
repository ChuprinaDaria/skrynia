import hashlib
import requests
from typing import Dict, Any
from app.core.config import settings


class Przelewy24PaymentService:
    """
    Przelewy24 payment gateway integration.
    Supports standard transfers, BLIK, and other Polish payment methods.
    """

    BASE_URL = "https://sandbox.przelewy24.pl" if settings.P24_TEST_MODE else "https://secure.przelewy24.pl"

    @staticmethod
    def _generate_crc(data: Dict[str, Any]) -> str:
        """Generate CRC checksum for Przelewy24."""
        crc_string = f"{data['sessionId']}|{settings.P24_MERCHANT_ID}|{data['amount']}|{data['currency']}|{settings.P24_CRC}"
        return hashlib.md5(crc_string.encode()).hexdigest()

    @staticmethod
    def create_transaction(
        order_id: str,
        amount: float,
        description: str,
        email: str,
        customer_name: str = None,
        payment_method: int = None  # 181 for BLIK
    ) -> Dict[str, Any]:
        """
        Create a Przelewy24 transaction.

        Args:
            order_id: Unique order identifier
            amount: Amount in PLN (will be converted to grosze)
            description: Transaction description
            email: Customer email
            customer_name: Customer name (optional)
            payment_method: Payment method code (181 for BLIK)

        Returns:
            Transaction data with payment URL
        """
        # Amount in grosze (smallest unit)
        amount_in_grosze = int(amount * 100)

        # Prepare transaction data
        transaction_data = {
            "merchantId": int(settings.P24_MERCHANT_ID),
            "posId": int(settings.P24_POS_ID),
            "sessionId": f"{settings.P24_MERCHANT_ID}_{order_id}",
            "amount": amount_in_grosze,
            "currency": "PLN",
            "description": description,
            "email": email,
            "country": "PL",
            "language": "pl",
            "urlReturn": f"{settings.FRONTEND_URL}/order/success",
            "urlStatus": f"{settings.FRONTEND_URL}/api/payments/p24/webhook",
        }

        if customer_name:
            transaction_data["client"] = customer_name

        if payment_method:
            transaction_data["method"] = payment_method

        # Generate CRC
        transaction_data["sign"] = Przelewy24PaymentService._generate_crc(transaction_data)

        # Make API request
        try:
            response = requests.post(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/transaction/register",
                json=transaction_data,
                auth=(settings.P24_POS_ID, settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            if result.get("data", {}).get("token"):
                token = result["data"]["token"]
                payment_url = f"{Przelewy24PaymentService.BASE_URL}/trnRequest/{token}"

                return {
                    "transaction_id": transaction_data["sessionId"],
                    "token": token,
                    "payment_url": payment_url,
                    "status": "pending"
                }
            else:
                raise Exception(f"P24 transaction registration failed: {result}")

        except requests.exceptions.RequestException as e:
            raise Exception(f"P24 API error: {str(e)}")

    @staticmethod
    def verify_transaction(session_id: str, amount: float, order_id: int) -> Dict[str, Any]:
        """
        Verify Przelewy24 transaction after payment.

        Args:
            session_id: Transaction session ID
            amount: Transaction amount
            order_id: Order ID

        Returns:
            Verification result
        """
        amount_in_grosze = int(amount * 100)

        verify_data = {
            "merchantId": int(settings.P24_MERCHANT_ID),
            "posId": int(settings.P24_POS_ID),
            "sessionId": session_id,
            "amount": amount_in_grosze,
            "currency": "PLN",
            "orderId": order_id
        }

        # Generate CRC for verification
        crc_string = f"{session_id}|{order_id}|{amount_in_grosze}|PLN|{settings.P24_CRC}"
        verify_data["sign"] = hashlib.md5(crc_string.encode()).hexdigest()

        try:
            response = requests.put(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/transaction/verify",
                json=verify_data,
                auth=(settings.P24_POS_ID, settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            return {
                "verified": result.get("data", {}).get("status") == "success",
                "status": result.get("data", {}).get("status"),
                "session_id": session_id
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"P24 verification error: {str(e)}")

    @staticmethod
    def create_blik_transaction(
        order_id: str,
        amount: float,
        description: str,
        email: str,
        blik_code: str = None
    ) -> Dict[str, Any]:
        """
        Create a BLIK payment transaction.

        Args:
            order_id: Unique order identifier
            amount: Amount in PLN
            description: Transaction description
            email: Customer email
            blik_code: 6-digit BLIK code (if provided upfront)

        Returns:
            BLIK transaction data
        """
        # BLIK method code in P24 is 181
        transaction = Przelewy24PaymentService.create_transaction(
            order_id=order_id,
            amount=amount,
            description=description,
            email=email,
            payment_method=181
        )

        transaction["payment_type"] = "blik"
        return transaction

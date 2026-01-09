import hashlib
import json
import requests
from typing import Dict, Any, Optional
from app.core.config import settings


class Przelewy24PaymentService:
    """
    Przelewy24 payment gateway integration.
    Supports standard transfers, BLIK, and other Polish payment methods.
    """

    BASE_URL = "https://sandbox.przelewy24.pl" if settings.P24_TEST_MODE else "https://secure.przelewy24.pl"
    PAYMENT_URL = "https://secure.przelewy24.pl"  # Payment URL always uses production domain

    @staticmethod
    def _generate_sign_for_registration(session_id: str, merchant_id: int, amount: int, currency: str, crc: str) -> str:
        """
        Generate sign (checksum) for transaction registration.
        Format: {"sessionId":"str","merchantId":int,"amount":int,"currency":"str","crc":"str"}
        Encoded with JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES, then hashed with SHA-384.
        """
        params = {
            "sessionId": session_id,
            "merchantId": merchant_id,
            "amount": amount,
            "currency": currency,
            "crc": crc
        }
        # JSON encoding with unescaped unicode and slashes (as per P24 documentation)
        combined_string = json.dumps(params, ensure_ascii=False, separators=(',', ':'))
        # Hash with SHA-384
        return hashlib.sha384(combined_string.encode('utf-8')).hexdigest()

    @staticmethod
    def _generate_sign_for_verification(session_id: str, order_id: int, amount: int, currency: str, crc: str) -> str:
        """
        Generate sign (checksum) for transaction verification.
        Format: {"sessionId":"str","orderId":int,"amount":int,"currency":"str","crc":"str"}
        Encoded with JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES, then hashed with SHA-384.
        """
        params = {
            "sessionId": session_id,
            "orderId": order_id,
            "amount": amount,
            "currency": currency,
            "crc": crc
        }
        # JSON encoding with unescaped unicode and slashes (as per P24 documentation)
        combined_string = json.dumps(params, ensure_ascii=False, separators=(',', ':'))
        # Hash with SHA-384
        return hashlib.sha384(combined_string.encode('utf-8')).hexdigest()

    @staticmethod
    def _generate_sign_for_notification(
        merchant_id: int,
        pos_id: int,
        session_id: str,
        amount: int,
        origin_amount: int,
        currency: str,
        order_id: int,
        method_id: int,
        statement: str,
        crc: str
    ) -> str:
        """
        Generate sign (checksum) for notification verification.
        Format: {"merchantId":int,"posId":int,"sessionId":"string","amount":int,"originAmount":int,
                 "currency":"string","orderId":int,"methodId":int,"statement":"string","crc":"string"}
        Encoded with JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES, then hashed with SHA-384.
        """
        params = {
            "merchantId": merchant_id,
            "posId": pos_id,
            "sessionId": session_id,
            "amount": amount,
            "originAmount": origin_amount,
            "currency": currency,
            "orderId": order_id,
            "methodId": method_id,
            "statement": statement,
            "crc": crc
        }
        # JSON encoding with unescaped unicode and slashes (as per P24 documentation)
        combined_string = json.dumps(params, ensure_ascii=False, separators=(',', ':'))
        # Hash with SHA-384
        return hashlib.sha384(combined_string.encode('utf-8')).hexdigest()

    @staticmethod
    def verify_notification_sign(notification_data: Dict[str, Any]) -> bool:
        """
        Verify notification sign from Przelewy24.

        Args:
            notification_data: Notification data received from P24

        Returns:
            True if sign is valid, False otherwise
        """
        received_sign = notification_data.get("sign")
        if not received_sign:
            return False

        merchant_id = notification_data.get("merchantId")
        pos_id = notification_data.get("posId")
        session_id = notification_data.get("sessionId")
        amount = notification_data.get("amount")
        origin_amount = notification_data.get("originAmount")
        currency = notification_data.get("currency", "PLN")
        order_id = notification_data.get("orderId")
        method_id = notification_data.get("methodId")
        statement = notification_data.get("statement", "")

        # Calculate expected sign
        expected_sign = Przelewy24PaymentService._generate_sign_for_notification(
            merchant_id=merchant_id,
            pos_id=pos_id,
            session_id=session_id,
            amount=amount,
            origin_amount=origin_amount,
            currency=currency,
            order_id=order_id,
            method_id=method_id,
            statement=statement,
            crc=settings.P24_CRC
        )

        return received_sign.lower() == expected_sign.lower()

    @staticmethod
    def create_transaction(
        order_id: str,
        amount: float,
        description: str,
        email: str,
        customer_name: Optional[str] = None,
        payment_method: Optional[int] = None,
        address: Optional[str] = None,
        zip_code: Optional[str] = None,
        city: Optional[str] = None,
        phone: Optional[str] = None,
        country: str = "PL",
        language: str = "pl",
        url_return: Optional[str] = None,
        url_status: Optional[str] = None,
        cart: Optional[list] = None,
        additional: Optional[Dict[str, Any]] = None
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
            address: Customer address (optional)
            zip_code: Customer zip code (optional)
            city: Customer city (optional)
            phone: Customer phone (optional)
            country: Country code (default: "PL")
            language: Language code (default: "pl")
            url_return: Return URL after payment (optional, uses default if not provided)
            url_status: Status notification URL (optional, uses default if not provided)
            cart: Cart items array (optional)
            additional: Additional transaction data (optional)

        Returns:
            Transaction data with payment URL
        """
        # Amount in grosze (smallest unit)
        amount_in_grosze = int(amount * 100)
        merchant_id = int(settings.P24_MERCHANT_ID)
        pos_id = int(settings.P24_POS_ID)
        session_id = f"{merchant_id}_{order_id}"

        # Prepare transaction data
        transaction_data = {
            "merchantId": merchant_id,
            "posId": pos_id,
            "sessionId": session_id,
            "amount": amount_in_grosze,
            "currency": "PLN",
            "description": description[:1024],  # Max 1024 characters
            "email": email[:50],  # Max 50 characters
            "country": country,
            "language": language,
            "urlReturn": url_return or f"{settings.FRONTEND_URL}/order/success",
            "urlStatus": url_status or f"{(settings.BACKEND_URL or settings.FRONTEND_URL)}/api/v1/payments/p24/webhook",
        }

        # Optional fields
        if customer_name:
            transaction_data["client"] = customer_name[:40]  # Max 40 characters
        if address:
            transaction_data["address"] = address[:80]  # Max 80 characters
        if zip_code:
            transaction_data["zip"] = zip_code[:10]  # Max 10 characters
        if city:
            transaction_data["city"] = city[:50]  # Max 50 characters
        if phone:
            transaction_data["phone"] = phone[:12]  # Max 12 characters
        if payment_method:
            transaction_data["method"] = payment_method
        if cart:
            transaction_data["cart"] = cart
        if additional:
            transaction_data["additional"] = additional

        # Generate sign using SHA-384 as per P24 documentation
        transaction_data["sign"] = Przelewy24PaymentService._generate_sign_for_registration(
            session_id=session_id,
            merchant_id=merchant_id,
            amount=amount_in_grosze,
            currency="PLN",
            crc=settings.P24_CRC
        )

        # Make API request
        try:
            response = requests.post(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/transaction/register",
                json=transaction_data,
                auth=(str(pos_id), settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            if result.get("data", {}).get("token"):
                token = result["data"]["token"]
                # Payment URL always uses production domain (secure.przelewy24.pl)
                payment_url = f"{Przelewy24PaymentService.PAYMENT_URL}/trnRequest/{token}"

                return {
                    "transaction_id": session_id,
                    "token": token,
                    "payment_url": payment_url,
                    "status": "pending"
                }
            else:
                raise Exception(f"P24 transaction registration failed: {result}")

        except requests.exceptions.RequestException as e:
            raise Exception(f"P24 API error: {str(e)}")

    @staticmethod
    def verify_transaction(session_id: str, amount: float, order_id: int, currency: str = "PLN") -> Dict[str, Any]:
        """
        Verify Przelewy24 transaction after payment.

        Args:
            session_id: Transaction session ID
            amount: Transaction amount in PLN (will be converted to grosze)
            order_id: Order ID from P24
            currency: Currency code (default: "PLN")

        Returns:
            Verification result
        """
        amount_in_grosze = int(amount * 100)
        merchant_id = int(settings.P24_MERCHANT_ID)
        pos_id = int(settings.P24_POS_ID)

        verify_data = {
            "merchantId": merchant_id,
            "posId": pos_id,
            "sessionId": session_id,
            "amount": amount_in_grosze,
            "currency": currency,
            "orderId": order_id
        }

        # Generate sign using SHA-384 as per P24 documentation
        verify_data["sign"] = Przelewy24PaymentService._generate_sign_for_verification(
            session_id=session_id,
            order_id=order_id,
            amount=amount_in_grosze,
            currency=currency,
            crc=settings.P24_CRC
        )

        try:
            response = requests.put(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/transaction/verify",
                json=verify_data,
                auth=(str(pos_id), settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            return {
                "verified": result.get("data", {}).get("status") == "success",
                "status": result.get("data", {}).get("status"),
                "session_id": session_id,
                "order_id": order_id
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"P24 verification error: {str(e)}")

    @staticmethod
    def create_blik_transaction(
        order_id: str,
        amount: float,
        description: str,
        email: str,
        blik_code: Optional[str] = None,
        psu_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a BLIK payment transaction.
        First registers the transaction, then charges it with BLIK code if provided.

        Args:
            order_id: Unique order identifier
            amount: Amount in PLN
            description: Transaction description
            email: Customer email
            blik_code: 6-digit BLIK code (optional, can be charged later)
            psu_data: PSU (Payment Service User) data for BLIK (optional)

        Returns:
            BLIK transaction data
        """
        # Register transaction first
        additional = {}
        if psu_data:
            additional["PSU"] = psu_data

        transaction = Przelewy24PaymentService.create_transaction(
            order_id=order_id,
            amount=amount,
            description=description,
            email=email,
            additional=additional if additional else None
        )

        transaction["payment_type"] = "blik"

        # If BLIK code is provided, charge immediately
        if blik_code:
            charge_result = Przelewy24PaymentService.blik_charge_by_code(
                token=transaction["token"],
                blik_code=blik_code
            )
            transaction.update(charge_result)

        return transaction

    @staticmethod
    def blik_charge_by_code(
        token: str,
        blik_code: str,
        alias_value: Optional[str] = None,
        alias_label: Optional[str] = None,
        recurring: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Charge BLIK payment using 6-digit code (T6).

        Args:
            token: Token from transaction registration
            blik_code: 6-digit BLIK code
            alias_value: Unique alias for future payments (optional)
            alias_label: Alias label displayed in app (optional, required if alias_value provided)
            recurring: Recurring payment parameters (optional)

        Returns:
            Charge result with orderId
        """
        charge_data = {
            "token": token,
            "blikCode": blik_code
        }

        if alias_value:
            charge_data["aliasValue"] = alias_value
        if alias_label:
            charge_data["aliasLabel"] = alias_label
        if recurring:
            charge_data["recurring"] = recurring

        try:
            response = requests.post(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/paymentMethod/blik/chargeByCode",
                json=charge_data,
                auth=(str(settings.P24_POS_ID), settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            return {
                "order_id": result.get("data", {}).get("orderId"),
                "message": result.get("data", {}).get("message"),
                "status": "charged"
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"BLIK charge error: {str(e)}")

    @staticmethod
    def blik_charge_by_alias(
        token: str,
        alias_value: Optional[str] = None,
        alias_label: Optional[str] = None,
        alternative_key: Optional[str] = None,
        recurring: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Charge BLIK payment using alias (1-click payment).

        Args:
            token: Token from transaction registration
            alias_value: Alias value from previous transaction
            alias_label: Alias label (optional)
            alternative_key: Alternative key for multiple apps (optional, used when error 51 occurs)
            recurring: Recurring payment parameters (optional)

        Returns:
            Charge result with orderId
        """
        charge_data = {
            "token": token,
            "type": "alias"
        }

        if alias_value:
            charge_data["aliasValue"] = alias_value
        if alias_label:
            charge_data["aliasLabel"] = alias_label
        if alternative_key:
            charge_data["alternativeKey"] = alternative_key
        if recurring:
            charge_data["recurring"] = recurring

        try:
            response = requests.post(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/paymentMethod/blik/chargeByAlias",
                json=charge_data,
                auth=(str(settings.P24_POS_ID), settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            return {
                "order_id": result.get("data", {}).get("orderId"),
                "message": result.get("data", {}).get("message"),
                "status": "charged"
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"BLIK charge by alias error: {str(e)}")

    @staticmethod
    def get_blik_aliases_by_email(email: str, custom: bool = False) -> Dict[str, Any]:
        """
        Get BLIK aliases for a given email address.

        Args:
            email: Customer email address
            custom: If True, get custom aliases (with aliasValue/aliasLabel), else standard aliases

        Returns:
            List of aliases
        """
        endpoint = "/custom" if custom else ""
        try:
            response = requests.get(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/paymentMethod/blik/getAliasesByEmail/{email}{endpoint}",
                auth=(str(settings.P24_POS_ID), settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            return {
                "aliases": result.get("data", []),
                "response_code": result.get("responseCode")
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"Get BLIK aliases error: {str(e)}")

    @staticmethod
    def get_transaction_by_session_id(session_id: str) -> Dict[str, Any]:
        """
        Get transaction information by session ID.

        Args:
            session_id: Transaction session ID

        Returns:
            Transaction data
        """
        try:
            response = requests.get(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/transaction/by/sessionId/{session_id}",
                auth=(str(settings.P24_POS_ID), settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            return result.get("data", {})

        except requests.exceptions.RequestException as e:
            raise Exception(f"Get transaction error: {str(e)}")

    @staticmethod
    def test_access() -> Dict[str, Any]:
        """
        Test connection to Przelewy24 API.

        Returns:
            Test result
        """
        try:
            response = requests.get(
                f"{Przelewy24PaymentService.BASE_URL}/api/v1/testAccess",
                auth=(str(settings.P24_POS_ID), settings.P24_API_KEY),
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            result = response.json()

            return {
                "success": result.get("data", False),
                "error": result.get("error")
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"Test access error: {str(e)}")

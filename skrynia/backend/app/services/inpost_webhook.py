import hmac
import hashlib
import base64
import os
from typing import Dict, Any, Optional
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.backends import default_backend
from app.core.config import settings


class InPostWebhookVerifier:
    """Verify InPost Global API v2 webhook signatures."""
    
    @staticmethod
    def verify_hmac_signature(
        payload: bytes,
        signature: str,
        timestamp: Optional[str] = None,
        secret: str = None
    ) -> bool:
        """
        Verify HMAC signature for webhook.
        
        Args:
            payload: Request body as bytes
            signature: Signature from x-inpost-signature header
            timestamp: Timestamp from x-inpost-timestamp header (optional)
            secret: HMAC shared secret
            
        Returns:
            True if signature is valid
        """
        if not secret:
            secret = settings.INPOST_WEBHOOK_HMAC_SECRET
        
        if not secret:
            return False
        
        signature_body = settings.INPOST_WEBHOOK_SIGNATURE_BODY
        
        if signature_body == "timestamp_body" and timestamp:
            payload_to_sign = f"{timestamp}.{payload.decode('utf-8')}".encode('utf-8')
        else:
            payload_to_sign = payload
        
        expected_signature = base64.b64encode(
            hmac.new(
                secret.encode('utf-8'),
                payload_to_sign,
                hashlib.sha256
            ).digest()
        ).decode('utf-8')
        
        return hmac.compare_digest(expected_signature, signature)
    
    @staticmethod
    def verify_basic_auth(
        auth_header: Optional[str],
        username: str = None,
        password: str = None
    ) -> bool:
        """
        Verify Basic Authentication.
        
        Args:
            auth_header: Authorization header value
            username: Expected username
            password: Expected password
            
        Returns:
            True if credentials match
        """
        if not auth_header or not auth_header.startswith("Basic "):
            return False
        
        if not username:
            username = settings.INPOST_WEBHOOK_BASIC_AUTH_USER
        if not password:
            password = settings.INPOST_WEBHOOK_BASIC_AUTH_PASSWORD
        
        if not username or not password:
            return False
        
        try:
            encoded = auth_header.replace("Basic ", "")
            decoded = base64.b64decode(encoded).decode('utf-8')
            user, pwd = decoded.split(":", 1)
            return user == username and pwd == password
        except Exception:
            return False
    
    @staticmethod
    def verify_api_key(
        api_key_header: Optional[str],
        expected_key: str = None,
        header_name: str = None
    ) -> bool:
        """
        Verify API Key from custom header.
        
        Args:
            api_key_header: API key value from header
            expected_key: Expected API key
            header_name: Header name (for logging)
            
        Returns:
            True if API key matches
        """
        if not api_key_header:
            return False
        
        if not expected_key:
            expected_key = settings.INPOST_WEBHOOK_API_KEY
        
        if not expected_key:
            return False
        
        return hmac.compare_digest(expected_key, api_key_header)
    
    @staticmethod
    def load_public_key_from_certificate(certificate_path: str = None) -> Any:
        """
        Load InPost public key from certificate file.
        
        Args:
            certificate_path: Path to .pem certificate file
            
        Returns:
            Public key object
        """
        if not certificate_path:
            certificate_path = settings.INPOST_WEBHOOK_CERTIFICATE_PATH
        
        if not certificate_path:
            raise ValueError("Certificate path is required for Digital signature verification")
        
        if not os.path.exists(certificate_path):
            raise FileNotFoundError(f"Certificate file not found: {certificate_path}")
        
        with open(certificate_path, 'rb') as cert_file:
            cert_data = cert_file.read()
        
        public_key = load_pem_public_key(cert_data, backend=default_backend())
        return public_key
    
    @staticmethod
    def verify_digital_signature(
        payload: bytes,
        signature: str,
        timestamp: Optional[str] = None,
        certificate_path: str = None
    ) -> bool:
        """
        Verify RSA Digital Signature (SHA256withRSA).
        
        Args:
            payload: Request body as bytes
            signature: Base64-encoded signature from x-inpost-signature header
            timestamp: Timestamp from x-inpost-timestamp header (optional)
            certificate_path: Path to InPost public certificate
            
        Returns:
            True if signature is valid
        """
        try:
            public_key = InPostWebhookVerifier.load_public_key_from_certificate(certificate_path)
            
            signature_body = settings.INPOST_WEBHOOK_SIGNATURE_BODY
            
            if signature_body == "timestamp_body" and timestamp:
                payload_to_sign = f"{timestamp}.{payload.decode('utf-8')}".encode('utf-8')
            else:
                payload_to_sign = payload
            
            signature_bytes = base64.b64decode(signature)
            
            public_key.verify(
                signature_bytes,
                payload_to_sign,
                padding.PKCS1v15(),
                hashes.SHA256()
            )
            
            return True
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Digital signature verification failed: {str(e)}")
            return False
    
    @staticmethod
    def verify_webhook(
        payload: bytes,
        headers: Dict[str, str],
        auth_method: Optional[str] = None
    ) -> bool:
        """
        Verify webhook using configured authentication method.
        
        Args:
            payload: Request body as bytes
            headers: Request headers dictionary
            auth_method: Authentication method to use (auto-detect if None)
            
        Returns:
            True if webhook is verified
        """
        signature = headers.get("x-inpost-signature")
        timestamp = headers.get("x-inpost-timestamp")
        api_version = headers.get("x-inpost-api-version")
        topic = headers.get("x-inpost-topic")
        event_id = headers.get("x-inpost-event-id")
        
        if not auth_method:
            auth_method = settings.INPOST_WEBHOOK_SIGNATURE_TYPE
        
        if auth_method == "HMAC":
            if not signature:
                return False
            return InPostWebhookVerifier.verify_hmac_signature(
                payload, signature, timestamp
            )
        elif auth_method == "DIGITAL":
            if not signature:
                return False
            return InPostWebhookVerifier.verify_digital_signature(
                payload, signature, timestamp
            )
        elif auth_method == "BASIC":
            auth_header = headers.get("authorization")
            return InPostWebhookVerifier.verify_basic_auth(auth_header)
        elif auth_method == "API_KEY":
            header_name = settings.INPOST_WEBHOOK_API_KEY_HEADER
            api_key = headers.get(header_name.lower())
            return InPostWebhookVerifier.verify_api_key(api_key)
        
        return False


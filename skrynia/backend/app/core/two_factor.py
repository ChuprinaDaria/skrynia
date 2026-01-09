"""
Two-Factor Authentication (2FA) utilities using TOTP.
"""
import pyotp
import qrcode
from io import BytesIO
import base64
from app.core.config import settings


def generate_secret() -> str:
    """Generate a new TOTP secret."""
    return pyotp.random_base32()


def get_totp_uri(email: str, secret: str, issuer: str = None) -> str:
    """Generate TOTP URI for QR code."""
    issuer = issuer or settings.APP_NAME
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(
        name=email,
        issuer_name=issuer
    )


def generate_qr_code(uri: str) -> str:
    """Generate QR code as base64 string."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"


def verify_totp(secret: str, token: str) -> bool:
    """Verify TOTP token."""
    totp = pyotp.TOTP(secret)
    return totp.verify(token, valid_window=1)


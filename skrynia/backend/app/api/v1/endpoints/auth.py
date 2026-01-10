from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, ProgrammingError
from datetime import timedelta, datetime, timezone
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import (
    verify_password, 
    create_access_token, 
    get_password_hash,
    get_current_user,
    get_current_admin_user
)
from app.core.two_factor import generate_secret, get_totp_uri, generate_qr_code, verify_totp
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserLogin, Token, UserCreate, User as UserSchema
from app.services.email_service import (
    send_verification_email, 
    generate_verification_token,
    send_password_reset_code_email,
    generate_password_reset_code
)

router = APIRouter()


class Login2FA(UserLogin):
    two_factor_token: str = None


class TwoFactorSetup(BaseModel):
    qr_code: str
    secret: str


class TwoFactorVerify(BaseModel):
    token: str


@router.post("/login")
def login(user_credentials: Login2FA, db: Session = Depends(get_db)):
    """Login and get access token. Requires 2FA if enabled."""
    try:
        user = db.query(User).filter(User.email == user_credentials.email).first()
    except OperationalError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection error. Please check database configuration.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}",
        )

    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account not activated. Please verify your email."
        )
    
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not verified. Please check your email for verification link."
        )

    # Check if 2FA is enabled
    if user.two_factor_enabled:
        if not user_credentials.two_factor_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="2FA token required"
            )
        
        if not verify_totp(user.two_factor_secret, user_credentials.two_factor_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid 2FA token"
            )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserSchema)
async def register(
    user_in: UserCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Register a new user (customers only, not admin). Sends verification email."""
    try:
        # Check if user already exists
        user = db.query(User).filter(User.email == user_in.email).first()
    except (OperationalError, ProgrammingError) as e:
        error_msg = str(e)
        if "does not exist" in error_msg or "relation" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database tables are not initialized. Please run migrations.",
            )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection error. Please check database configuration.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}",
        )
    
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Generate verification token
    verification_token = generate_verification_token()
    
    # Get user's preferred language (default to English)
    user_language = user_in.language if hasattr(user_in, 'language') and user_in.language else "EN"
    
    # Create new user (inactive until email verified)
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        is_active=False,  # Will be activated after email verification
        is_admin=False,
        email_verified=False,
        email_verification_token=verification_token,
        email_verification_sent_at=datetime.now(timezone.utc),
        language=user_language
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}",
        )

    # Send verification email in background (in user's preferred language)
    background_tasks.add_task(
        send_verification_email,
        email=new_user.email,
        token=verification_token,
        full_name=new_user.full_name,
        language=user_language
    )

    return new_user


@router.get("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user email with token from email link."""
    user = db.query(User).filter(User.email_verification_token == token).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid verification token"
        )
    
    # Check if token is expired (24 hours)
    if user.email_verification_sent_at:
        time_diff = datetime.now(timezone.utc) - user.email_verification_sent_at
        if time_diff > timedelta(hours=24):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification token expired. Please request a new one."
            )
    
    # Verify email and activate account
    user.email_verified = True
    user.is_active = True
    user.email_verification_token = None
    user.email_verification_sent_at = None
    
    db.commit()
    
    return {"message": "Email verified successfully. You can now log in."}


@router.post("/resend-verification")
async def resend_verification(
    email: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Resend verification email."""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate new token
    verification_token = generate_verification_token()
    user.email_verification_token = verification_token
    user.email_verification_sent_at = datetime.now(timezone.utc)
    
    db.commit()
    
    # Send verification email in background (use user's language preference or default to English)
    user_language = getattr(user, 'language', None) or "EN"
    background_tasks.add_task(
        send_verification_email,
        email=user.email,
        token=verification_token,
        full_name=user.full_name,
        language=user_language
    )
    
    return {"message": "Verification email sent"}


@router.post("/2fa/setup", response_model=TwoFactorSetup)
def setup_2fa(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Setup 2FA for admin user."""
    if current_user.two_factor_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA is already enabled"
        )
    
    secret = generate_secret()
    uri = get_totp_uri(current_user.email, secret)
    qr_code = generate_qr_code(uri)
    
    # Save secret temporarily (user needs to verify before enabling)
    current_user.two_factor_secret = secret
    db.commit()
    
    return {"qr_code": qr_code, "secret": secret}


@router.post("/2fa/verify")
def verify_2fa(
    verify_data: TwoFactorVerify,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Verify and enable 2FA."""
    if not current_user.two_factor_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA setup required first"
        )
    
    if not verify_totp(current_user.two_factor_secret, verify_data.token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Enable 2FA
    current_user.two_factor_enabled = True
    db.commit()
    
    return {"message": "2FA enabled successfully"}


@router.post("/2fa/disable")
def disable_2fa(
    verify_data: TwoFactorVerify,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Disable 2FA."""
    if not current_user.two_factor_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA is not enabled"
        )
    
    if not verify_totp(current_user.two_factor_secret, verify_data.token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )
    
    # Disable 2FA
    current_user.two_factor_enabled = False
    current_user.two_factor_secret = None
    db.commit()
    
    return {"message": "2FA disabled successfully"}


class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetVerify(BaseModel):
    email: str
    code: str
    new_password: str


@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Request password reset - sends 5-digit code to email."""
    user = db.query(User).filter(User.email == request.email).first()
    
    # Don't reveal if user exists for security
    if not user:
        # Return success even if user doesn't exist to prevent email enumeration
        return {"message": "If the email exists, a reset code has been sent"}
    
    # Check if too many attempts (prevent abuse)
    if user.password_reset_code_attempts and user.password_reset_code_attempts >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many reset attempts. Please try again later."
        )
    
    # Check if code was sent recently (rate limiting)
    if user.password_reset_code_sent_at:
        time_diff = datetime.now(timezone.utc) - user.password_reset_code_sent_at
        if time_diff < timedelta(minutes=2):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Please wait before requesting another code"
            )
    
    # Generate 5-digit code
    reset_code = generate_password_reset_code()
    
    # Save code and timestamp
    user.password_reset_code = reset_code
    user.password_reset_code_sent_at = datetime.now(timezone.utc)
    user.password_reset_code_attempts = 0  # Reset attempts counter
    
    db.commit()
    
    # Send code via email in background
    background_tasks.add_task(
        send_password_reset_code_email,
        email=user.email,
        code=reset_code,
        full_name=user.full_name
    )
    
    return {"message": "If the email exists, a reset code has been sent"}


@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordResetVerify,
    db: Session = Depends(get_db)
):
    """Verify reset code and set new password."""
    user = db.query(User).filter(User.email == reset_data.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if code exists
    if not user.password_reset_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No reset code found. Please request a new one."
        )
    
    # Check if code is expired (15 minutes)
    if user.password_reset_code_sent_at:
        time_diff = datetime.now(timezone.utc) - user.password_reset_code_sent_at
        if time_diff > timedelta(minutes=15):
            # Clear expired code
            user.password_reset_code = None
            user.password_reset_code_sent_at = None
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset code expired. Please request a new one."
            )
    
    # Check attempts
    if user.password_reset_code_attempts and user.password_reset_code_attempts >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed attempts. Please request a new code."
        )
    
    # Verify code
    if user.password_reset_code != reset_data.code:
        # Increment attempts
        user.password_reset_code_attempts = (user.password_reset_code_attempts or 0) + 1
        db.commit()
        
        remaining_attempts = 5 - user.password_reset_code_attempts
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid code. {remaining_attempts} attempts remaining."
        )
    
    # Code is valid - reset password
    hashed_password = get_password_hash(reset_data.new_password)
    user.hashed_password = hashed_password
    user.password_reset_code = None
    user.password_reset_code_sent_at = None
    user.password_reset_code_attempts = 0
    
    db.commit()
    
    return {"message": "Password reset successfully. You can now log in with your new password."}

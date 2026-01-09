from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from datetime import timedelta
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
            detail="Inactive user"
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
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (customers only, not admin)."""
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        is_active=True,
        is_admin=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


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

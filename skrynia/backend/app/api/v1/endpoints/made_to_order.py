from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.made_to_order import MadeToOrderRequest
from app.models.product import Product
from app.models.user import User
from app.schemas.made_to_order import (
    MadeToOrderRequestCreate,
    MadeToOrderRequestUpdate,
    MadeToOrderRequest as MadeToOrderRequestSchema
)
from app.core.security import get_current_admin_user

router = APIRouter()


@router.post("/", response_model=MadeToOrderRequestSchema, status_code=status.HTTP_201_CREATED)
def create_made_to_order_request(
    request: MadeToOrderRequestCreate,
    db: Session = Depends(get_db)
):
    """Create a new made-to-order request."""
    # Verify product exists and is made-to-order
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    if not product.is_made_to_order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This product is not available for made-to-order"
        )
    
    # Create request
    db_request = MadeToOrderRequest(
        product_id=request.product_id,
        customer_name=request.customer_name,
        customer_email=request.customer_email,
        customer_phone=request.customer_phone,
        custom_text=request.custom_text,
        description=request.description,
        status="new"
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request


@router.get("/", response_model=List[MadeToOrderRequestSchema])
def get_made_to_order_requests(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    is_read: bool = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all made-to-order requests (admin only)."""
    from app.models.product import Product
    
    query = db.query(MadeToOrderRequest)
    
    if status:
        query = query.filter(MadeToOrderRequest.status == status)
    
    if is_read is not None:
        query = query.filter(MadeToOrderRequest.is_read == is_read)
    
    requests = query.order_by(MadeToOrderRequest.created_at.desc()).offset(skip).limit(limit).all()
    return requests


@router.get("/{request_id}", response_model=MadeToOrderRequestSchema)
def get_made_to_order_request(
    request_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get a specific made-to-order request (admin only)."""
    request = db.query(MadeToOrderRequest).filter(MadeToOrderRequest.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    return request


@router.patch("/{request_id}", response_model=MadeToOrderRequestSchema)
def update_made_to_order_request(
    request_id: int,
    update: MadeToOrderRequestUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a made-to-order request (admin only)."""
    request = db.query(MadeToOrderRequest).filter(MadeToOrderRequest.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    # Зберігаємо поточний product_id, щоб він не змінився
    original_product_id = request.product_id
    
    # Оновлюємо тільки дозволені поля (product_id не можна змінювати)
    if update.status is not None:
        request.status = update.status
    if update.is_read is not None:
        request.is_read = update.is_read
    if update.admin_notes is not None:
        request.admin_notes = update.admin_notes
    
    # Гарантуємо, що product_id залишається незмінним
    request.product_id = original_product_id
    
    # Оновлюємо updated_at
    from datetime import datetime, timezone
    request.updated_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(request)
    
    return request


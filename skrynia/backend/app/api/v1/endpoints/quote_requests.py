from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from collections import defaultdict

from app.db.session import get_db
from app.models.quote_request import QuoteRequest, QuoteStatus
from app.models.bead import Bead
from app.models.user import User
from app.schemas.quote_request import (
    QuoteRequest as QuoteRequestSchema,
    QuoteRequestCreate,
    QuoteRequestUpdate,
    QuoteRequestList,
    QuoteRequestAdminResponse,
    QuoteCalculation,
    BeadCalculation
)
from app.core.security import get_current_admin_user
from app.services.email_service import (
    send_quote_request_confirmation,
    send_new_quote_request_notification
)
from app.core.config import settings

router = APIRouter()


def calculate_necklace_price(necklace_data: dict, db: Session) -> tuple[float, float, List[BeadCalculation]]:
    """
    Calculate netto and brutto prices for a necklace configuration.
    Returns (total_netto, total_brutto, bead_details).
    """
    bead_counts = defaultdict(int)

    # Count all beads
    for thread in necklace_data.get("threads", []):
        for bead_item in thread.get("beads", []):
            bead_counts[bead_item["bead_id"]] += 1

    # Add clasp if present
    clasp = necklace_data.get("clasp")
    if clasp and clasp.get("bead_id"):
        bead_counts[clasp["bead_id"]] += 1

    # Get bead prices from database
    bead_ids = list(bead_counts.keys())
    beads = db.query(Bead).filter(Bead.id.in_(bead_ids)).all()

    if len(beads) != len(bead_ids):
        missing_ids = set(bead_ids) - {b.id for b in beads}
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Beads not found: {missing_ids}"
        )

    # Calculate totals
    total_netto = 0.0
    total_brutto = 0.0
    bead_details = []

    for bead in beads:
        quantity = bead_counts[bead.id]
        bead_netto = bead.price_netto * quantity
        bead_brutto = bead.price_brutto * quantity

        total_netto += bead_netto
        total_brutto += bead_brutto

        bead_details.append(BeadCalculation(
            bead_id=bead.id,
            name=bead.name,
            quantity=quantity,
            price_netto=bead.price_netto,
            price_brutto=bead.price_brutto,
            total_netto=bead_netto,
            total_brutto=bead_brutto
        ))

    return total_netto, total_brutto, bead_details


@router.post("/", response_model=QuoteRequestSchema, status_code=status.HTTP_201_CREATED)
async def create_quote_request(
    quote: QuoteRequestCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(lambda: None)  # Optional authentication
):
    """
    Create a new quote request.
    Can be used by both authenticated and guest users.
    """
    try:
        # Try to get current user if authenticated
        from app.core.security import get_current_user as get_user
        current_user = get_user(db=db)
    except Exception:
        # User not authenticated
        current_user = None

    # Convert necklace_data to dict for JSON storage
    necklace_data_dict = quote.necklace_data.model_dump()

    # Validate clasp
    if not necklace_data_dict.get("clasp"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Clasp is required for necklace"
        )

    # Calculate prices
    try:
        total_netto, total_brutto, bead_details = calculate_necklace_price(
            necklace_data_dict,
            db
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Price calculation failed: {str(e)}"
        )

    # Create quote request
    db_quote = QuoteRequest(
        user_id=current_user.id if current_user else None,
        necklace_configuration_id=quote.necklace_configuration_id,
        email=quote.email,
        customer_name=quote.customer_name,
        customer_phone=quote.customer_phone,
        necklace_data=necklace_data_dict,
        comment=quote.comment,
        calculated_netto=total_netto,
        calculated_brutto=total_brutto,
        status=QuoteStatus.PENDING,
        is_read=False,
        admin_quote_currency="PLN"
    )

    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)

    # Send confirmation email to customer
    try:
        # Multilingual necklace summary
        thread_count = len(necklace_data_dict['threads'])
        summary_translations = {
            "uk": f"{thread_count} ниток" if thread_count > 1 else f"{thread_count} нитка",
            "en": f"{thread_count} threads" if thread_count > 1 else f"{thread_count} thread",
            "de": f"{thread_count} Fäden" if thread_count > 1 else f"{thread_count} Faden",
            "pl": f"{thread_count} nici" if thread_count > 1 else f"{thread_count} nić"
        }
        necklace_summary = summary_translations.get(quote.language, summary_translations["uk"])

        await send_quote_request_confirmation(
            email=quote.email,
            quote_id=db_quote.id,
            customer_name=quote.customer_name,
            necklace_summary=necklace_summary,
            language=quote.language
        )
    except Exception as e:
        print(f"Failed to send customer confirmation email: {e}")

    # Send notification email to admin
    try:
        await send_new_quote_request_notification(
            admin_email=settings.ADMIN_EMAIL,
            quote_id=db_quote.id,
            customer_email=quote.email,
            customer_name=quote.customer_name,
            calculated_brutto=total_brutto
        )
    except Exception as e:
        print(f"Failed to send admin notification email: {e}")

    return db_quote


@router.get("/", response_model=List[QuoteRequestList])
def get_quote_requests(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[QuoteStatus] = None,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all quote requests (admin only).
    Can filter by status.
    """
    query = db.query(QuoteRequest)

    if status_filter:
        query = query.filter(QuoteRequest.status == status_filter)

    quotes = (
        query
        .order_by(QuoteRequest.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return quotes


@router.get("/{quote_id}", response_model=QuoteRequestSchema)
def get_quote_request(
    quote_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get a single quote request by ID (admin only).
    Automatically marks as read.
    """
    quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()

    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote request not found"
        )

    # Mark as read
    if not quote.is_read:
        quote.is_read = True
        db.commit()
        db.refresh(quote)

    return quote


@router.get("/{quote_id}/calculation", response_model=QuoteCalculation)
def get_quote_calculation(
    quote_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed price calculation for a quote request (admin only).
    """
    quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()

    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote request not found"
        )

    # Recalculate prices
    try:
        total_netto, total_brutto, bead_details = calculate_necklace_price(
            quote.necklace_data,
            db
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Price calculation failed: {str(e)}"
        )

    return QuoteCalculation(
        beads=bead_details,
        total_netto=total_netto,
        total_brutto=total_brutto,
        currency="PLN"
    )


@router.put("/{quote_id}", response_model=QuoteRequestSchema)
def update_quote_request(
    quote_id: int,
    quote_update: QuoteRequestUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Update a quote request (admin only).
    """
    db_quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()

    if not db_quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote request not found"
        )

    # Update only provided fields
    update_data = quote_update.model_dump(exclude_unset=True)

    # Set quoted_at timestamp if status changes to QUOTED
    if "status" in update_data and update_data["status"] == QuoteStatus.QUOTED:
        if db_quote.status != QuoteStatus.QUOTED:
            update_data["quoted_at"] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(db_quote, field, value)

    db.commit()
    db.refresh(db_quote)

    return db_quote


@router.post("/{quote_id}/respond", response_model=QuoteRequestSchema)
async def respond_to_quote(
    quote_id: int,
    response: QuoteRequestAdminResponse,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Admin responds to a quote request with price and notes.
    Changes status to QUOTED and sends email to customer.
    """
    db_quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()

    if not db_quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote request not found"
        )

    # Update quote
    db_quote.status = QuoteStatus.QUOTED
    db_quote.admin_notes = response.admin_notes
    db_quote.admin_quote_price = response.admin_quote_price
    db_quote.admin_quote_currency = response.admin_quote_currency
    db_quote.quoted_at = datetime.utcnow()

    db.commit()
    db.refresh(db_quote)

    # TODO: Send email to customer with quote details
    # This would be a separate email template with pricing details

    return db_quote


@router.delete("/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote_request(
    quote_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a quote request (admin only).
    """
    db_quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()

    if not db_quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote request not found"
        )

    db.delete(db_quote)
    db.commit()

    return None

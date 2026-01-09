from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User
from app.models.order import Order
from app.models.shipping import Shipment, ShippingProvider, ShippingStatus
from app.core.security import get_current_admin_user
from app.services.shipping_inpost import InPostService
from app.services.shipping_novaposhta import NovaPoshtaService
from app.services.shipping_dhl import DHLService
from app.services.shipping_poczta import PocztaPolskaService

router = APIRouter()


class ShippingQuoteRequest(BaseModel):
    origin_country: str
    origin_postal_code: str
    destination_country: str
    destination_postal_code: str
    weight: float
    provider: Optional[ShippingProvider] = None


class CreateShipmentRequest(BaseModel):
    order_id: int
    provider: ShippingProvider
    # InPost specific
    paczkomat_id: Optional[str] = None
    # DHL/Poczta specific
    service_type: Optional[str] = None


@router.post("/quote")
def get_shipping_quote(
    request: ShippingQuoteRequest,
    db: Session = Depends(get_db)
):
    """
    Get shipping quotes from different providers.

    Returns available shipping options with prices.
    """
    quotes = []

    try:
        # DHL Quote
        if not request.provider or request.provider == ShippingProvider.DHL:
            dhl = DHLService()
            dhl_rates = dhl.get_rates(
                origin_country=request.origin_country,
                origin_postal_code=request.origin_postal_code,
                destination_country=request.destination_country,
                destination_postal_code=request.destination_postal_code,
                weight=request.weight
            )

            for rate in dhl_rates:
                quotes.append({
                    "provider": "dhl",
                    "service_name": rate["service_name"],
                    "price": rate["total_price"],
                    "currency": rate["currency"],
                    "delivery_time": rate["delivery_time"]
                })

    except Exception as e:
        # Continue even if one provider fails
        pass

    try:
        # Nova Poshta (if Ukraine)
        if request.destination_country == "UA":
            np = NovaPoshtaService()
            # Simplified - real implementation needs city refs
            cost = np.calculate_cost(
                city_sender="",  # Would need proper city reference
                city_recipient="",
                weight=request.weight
            )

            quotes.append({
                "provider": "nova_poshta",
                "service_name": "Warehouse to Warehouse",
                "price": cost,
                "currency": "UAH",
                "delivery_time": "2-3 days"
            })

    except Exception as e:
        pass

    try:
        # Poczta Polska (if Poland)
        if request.destination_country == "PL":
            pp = PocztaPolskaService()
            cost_standard = pp.calculate_cost(
                weight=request.weight,
                service_type="standard",
                destination="domestic" if request.origin_country == "PL" else "eu"
            )
            cost_priority = pp.calculate_cost(
                weight=request.weight,
                service_type="priority",
                destination="domestic" if request.origin_country == "PL" else "eu"
            )

            quotes.append({
                "provider": "poczta_polska",
                "service_name": "Standard",
                "price": cost_standard,
                "currency": "PLN",
                "delivery_time": "3-5 days"
            })
            quotes.append({
                "provider": "poczta_polska",
                "service_name": "Priority",
                "price": cost_priority,
                "currency": "PLN",
                "delivery_time": "1-2 days"
            })

    except Exception as e:
        pass

    if not quotes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No shipping quotes available for this route"
        )

    return {"quotes": quotes}


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_shipment(
    request: CreateShipmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a shipment for an order (admin only).

    Generates shipping label and tracking number.
    """
    # Get order
    order = db.query(Order).filter(Order.id == request.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Check if shipment already exists
    existing = db.query(Shipment).filter(Shipment.order_id == request.order_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Shipment already exists for this order"
        )

    try:
        shipment_data = None

        if request.provider == ShippingProvider.INPOST:
            if not request.paczkomat_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Paczkomat ID required for InPost"
                )

            inpost = InPostService()
            result = inpost.create_shipment(
                receiver_email=order.customer_email,
                receiver_phone=order.customer_phone or "",
                receiver_name=order.customer_name,
                paczkomat_id=request.paczkomat_id,
                reference=order.order_number
            )

            shipment_data = {
                "tracking_number": result["tracking_number"],
                "tracking_url": f"https://inpost.pl/sledzenie-przesylek?number={result['tracking_number']}",
                "label_url": result.get("label_url"),
                "locker_id": request.paczkomat_id
            }

        elif request.provider == ShippingProvider.DHL:
            dhl = DHLService()
            result = dhl.create_shipment(
                shipper_name="Skrynia Pani Darii",
                shipper_company="Skrynia Pani Darii",
                shipper_address="Your Address",  # From settings
                shipper_city="Your City",
                shipper_postal_code="12-345",
                shipper_country="PL",
                shipper_phone="+48123456789",
                shipper_email="runebox@lazysoft.pl",
                recipient_name=order.customer_name,
                recipient_company="",
                recipient_address=order.shipping_address_line1,
                recipient_city=order.shipping_city,
                recipient_postal_code=order.shipping_postal_code,
                recipient_country=order.shipping_country,
                recipient_phone=order.customer_phone or "",
                recipient_email=order.customer_email,
                weight=2.0,  # Calculate from order items
                reference=order.order_number
            )

            shipment_data = {
                "tracking_number": result["tracking_number"],
                "tracking_url": f"https://www.dhl.com/tracking?AWB={result['tracking_number']}",
                "label_url": result.get("label_url")
            }

        elif request.provider == ShippingProvider.NOVA_POSHTA:
            np = NovaPoshtaService()
            # This is simplified - real implementation needs city/warehouse selection
            result = np.create_internet_document(
                recipient_name=order.customer_name,
                recipient_phone=order.customer_phone or "",
                city_recipient="",  # Need to select city first
                recipient_warehouse="",  # Need to select warehouse
                description=f"Замовлення {order.order_number}",
                weight=2.0,
                cost=order.total
            )

            shipment_data = {
                "tracking_number": result["tracking_number"],
                "tracking_url": f"https://novaposhta.ua/tracking/?cargo_number={result['tracking_number']}"
            }

        elif request.provider == ShippingProvider.POCZTA_POLSKA:
            pp = PocztaPolskaService()
            result = pp.create_eprzesylka(
                sender_name="Skrynia Pani Darii",
                sender_address="Your Address",
                sender_postal_code="12-345",
                sender_city="Your City",
                recipient_name=order.customer_name,
                recipient_address=order.shipping_address_line1,
                recipient_postal_code=order.shipping_postal_code,
                recipient_city=order.shipping_city,
                weight=2.0
            )

            shipment_data = {
                "tracking_number": result["tracking_number"],
                "tracking_url": f"https://emonitoring.poczta-polska.pl/?numer={result['tracking_number']}"
            }

        # Create shipment record
        shipment = Shipment(
            order_id=order.id,
            provider=request.provider,
            tracking_number=shipment_data["tracking_number"],
            tracking_url=shipment_data.get("tracking_url"),
            status=ShippingStatus.LABEL_CREATED,
            locker_id=shipment_data.get("locker_id"),
            label_url=shipment_data.get("label_url")
        )

        db.add(shipment)

        # Update order
        order.tracking_number = shipment_data["tracking_number"]
        order.tracking_url = shipment_data.get("tracking_url")

        db.commit()
        db.refresh(shipment)

        return shipment

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create shipment: {str(e)}"
        )


@router.get("/track/{tracking_number}")
def track_shipment(
    tracking_number: str,
    provider: ShippingProvider = Query(...),
    db: Session = Depends(get_db)
):
    """
    Track a shipment (public endpoint).

    Customers can track their orders.
    """
    try:
        if provider == ShippingProvider.INPOST:
            inpost = InPostService()
            result = inpost.get_tracking(tracking_number)

        elif provider == ShippingProvider.DHL:
            dhl = DHLService()
            result = dhl.get_tracking(tracking_number)

        elif provider == ShippingProvider.NOVA_POSHTA:
            np = NovaPoshtaService()
            result = np.get_tracking(tracking_number)

        elif provider == ShippingProvider.POCZTA_POLSKA:
            pp = PocztaPolskaService()
            result = pp.get_tracking(tracking_number)

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported provider"
            )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Tracking failed: {str(e)}"
        )


@router.get("/paczkomats")
def get_paczkomats(
    city: Optional[str] = None,
    postcode: Optional[str] = None
):
    """
    Get list of InPost Paczkomats (public endpoint).

    For customers to select pickup point.
    """
    try:
        inpost = InPostService()
        paczkomats = inpost.get_paczkomats(city=city, postcode=postcode)

        return {"paczkomats": paczkomats}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch paczkomats: {str(e)}"
        )


@router.get("/nova-poshta/cities")
def get_nova_poshta_cities(city_name: str):
    """Get Nova Poshta cities (public endpoint)."""
    try:
        np = NovaPoshtaService()
        cities = np.get_cities(city_name)

        return {"cities": cities}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch cities: {str(e)}"
        )


@router.get("/nova-poshta/warehouses/{city_ref}")
def get_nova_poshta_warehouses(city_ref: str):
    """Get Nova Poshta warehouses for a city (public endpoint)."""
    try:
        np = NovaPoshtaService()
        warehouses = np.get_warehouses(city_ref)

        return {"warehouses": warehouses}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch warehouses: {str(e)}"
        )

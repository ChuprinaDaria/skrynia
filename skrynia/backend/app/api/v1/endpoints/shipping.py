from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import ipaddress
import logging

from app.db.session import get_db
from app.models.user import User
from app.models.order import Order, OrderStatus
from app.models.shipping import Shipment, ShippingProvider, ShippingStatus
from app.core.security import get_current_admin_user
from app.core.config import settings
from app.services.shipping_inpost import InPostService, InPostAPIError, InPostValidationError, InPostResourceNotFoundError
from app.services.shipping_novaposhta import NovaPoshtaService
from app.services.shipping_dhl import DHLService
from app.services.shipping_poczta import PocztaPolskaService
from app.services.order_notifications import send_order_status_email

logger = logging.getLogger(__name__)

# InPost webhook IP range: 91.216.25.0/24
INPOST_WEBHOOK_IP_RANGE = ipaddress.ip_network("91.216.25.0/24")

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
async def create_shipment(
    request: CreateShipmentRequest,
    background_tasks: BackgroundTasks,
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

            inpost = InPostService(sandbox=getattr(settings, "INPOST_SANDBOX", True))
            result = inpost.create_shipment(
                receiver_email=order.customer_email,
                receiver_phone=order.customer_phone or "",
                receiver_name=order.customer_name,
                target_point=request.paczkomat_id,
                reference=order.order_number
            )

            shipment_data = {
                "tracking_number": result["tracking_number"],
                "tracking_url": f"https://inpost.pl/sledzenie-przesylek?number={result['tracking_number']}",
                "label_url": result.get("label_url"),
                "locker_id": request.paczkomat_id,
                "shipment_id": result.get("shipment_id")  # Store for webhook matching
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
        provider_data = {}
        if request.provider == ShippingProvider.INPOST and shipment_data:
            # Store InPost shipment_id for webhook matching
            # shipment_data should contain shipment_id from create_shipment result
            if "shipment_id" in shipment_data:
                provider_data["inpost_shipment_id"] = shipment_data["shipment_id"]
            provider_data["created_at"] = datetime.now().isoformat()
        
        shipment = Shipment(
            order_id=order.id,
            provider=request.provider,
            tracking_number=shipment_data["tracking_number"],
            tracking_url=shipment_data.get("tracking_url"),
            status=ShippingStatus.LABEL_CREATED,
            locker_id=shipment_data.get("locker_id"),
            label_url=shipment_data.get("label_url"),
            provider_data=provider_data if provider_data else None
        )

        db.add(shipment)

        # Update order
        order.tracking_number = shipment_data["tracking_number"]
        order.tracking_url = shipment_data.get("tracking_url")
        order.status = OrderStatus.PROCESSING  # Update order status when shipment created

        db.commit()
        db.refresh(shipment)
        db.refresh(order)

        # Send email notification with tracking number
        background_tasks.add_task(
            send_order_status_email,
            order=order,
            status=OrderStatus.PROCESSING,
            db=db
        )

        return shipment

    except (InPostAPIError, InPostValidationError, InPostResourceNotFoundError) as e:
        raise HTTPException(
            status_code=e.status_code or status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"InPost API error: {e.message}"
        )
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
            inpost = InPostService(sandbox=getattr(settings, "INPOST_SANDBOX", True))
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

    except (InPostAPIError, InPostValidationError, InPostResourceNotFoundError) as e:
        raise HTTPException(
            status_code=e.status_code or status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"InPost API error: {e.message}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Tracking failed: {str(e)}"
        )


@router.get("/paczkomats")
def get_paczkomats(
    # Basic filters
    name: Optional[str] = None,
    city: Optional[str] = None,
    postcode: Optional[str] = None,
    # Point type filters
    type: Optional[str] = Query(None, description="Point type: parcel_locker, parcel_locker_only, parcel_locker_superpop, pop"),
    partner_id: Optional[str] = None,
    functions: Optional[str] = Query(None, description="Function filter, e.g., parcel_collect"),
    payment_available: Optional[bool] = None,
    province: Optional[str] = None,
    location_247: Optional[bool] = Query(None, description="Filter 24/7 points for Weekend Parcels"),
    # Location-based search (for Geowidget)
    relative_point: Optional[str] = Query(None, description="Search near coordinates: 'lat,lng' (e.g., '52.123,19.321')"),
    relative_post_code: Optional[str] = Query(None, description="Search near postal code"),
    max_distance: Optional[int] = Query(None, ge=1, le=50000, description="Max distance in meters (max 50000)"),
    limit: Optional[int] = Query(None, ge=1, description="Limit results for relative searches"),
    # Sorting
    sort_by: Optional[str] = Query(None, description="Sort by: name, distance_to_relative_point, status"),
    sort_order: Optional[str] = Query(None, description="Sort order: asc, desc"),
    # Paging
    page: int = Query(1, ge=1),
    per_page: int = Query(100, ge=1, le=500, description="Items per page (max 500)"),
    # Field selection
    fields: Optional[str] = Query(None, description="Comma-separated field names to return")
):
    """
    Get list of InPost points (Paczkomats) with advanced filtering.
    
    This endpoint supports Geowidget integration for point selection.
    Geowidget is a JavaScript widget for selecting Pick Up Drop Off (PUDO) locations.
    
    Features:
    - Basic filtering by city, postcode, name
    - Point type filtering (lockers, POPs, etc.)
    - Location-based search (near coordinates or postal code)
    - Distance-based filtering
    - Sorting and paging
    
    For Geowidget integration:
    - Use relative_point or relative_post_code for location-based search
    - Use max_distance to limit search radius
    - Use sort_by='distance_to_relative_point' to sort by distance
    
    Returns collection with items, count, page info.
    """
    try:
        inpost = InPostService(sandbox=getattr(settings, "INPOST_SANDBOX", True))
        response = inpost.get_points(
            name=name,
            city=city,
            post_code=postcode,
            type=type,
            partner_id=partner_id,
            functions=functions,
            payment_available=payment_available,
            province=province,
            location_247=location_247,
            relative_point=relative_point,
            relative_post_code=relative_post_code,
            max_distance=max_distance,
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            per_page=per_page,
            fields=fields
        )

        return response

    except (InPostAPIError, InPostValidationError, InPostResourceNotFoundError) as e:
        raise HTTPException(
            status_code=e.status_code or status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"InPost API error: {e.message}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch paczkomats: {str(e)}"
        )


@router.get("/paczkomats/{point_id}")
def get_paczkomat(point_id: str):
    """
    Get specific InPost Paczkomat details (public endpoint).
    
    Args:
        point_id: Point ID (e.g., "KRA010")
    """
    try:
        inpost = InPostService(sandbox=getattr(settings, "INPOST_SANDBOX", True))
        point = inpost.get_point(point_id)

        return point

    except InPostResourceNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Paczkomat not found: {e.message}"
        )
    except (InPostAPIError, InPostValidationError) as e:
        raise HTTPException(
            status_code=e.status_code or status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"InPost API error: {e.message}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch paczkomat: {str(e)}"
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


# ==================== InPost Webhooks ====================

def _get_client_ip(request: Request) -> str:
    """Get client IP address from request."""
    # Check X-Forwarded-For header (for proxies)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the first IP in the chain
        return forwarded_for.split(",")[0].strip()
    
    # Check X-Real-IP header
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to client host
    return request.client.host if request.client else ""


def _validate_inpost_ip(ip_address: str) -> bool:
    """
    Validate that IP address is from InPost webhook range.
    
    InPost webhooks come from IP range: 91.216.25.0/24
    """
    try:
        ip = ipaddress.ip_address(ip_address)
        return ip in INPOST_WEBHOOK_IP_RANGE
    except ValueError:
        return False


def _map_inpost_status_to_shipping_status(inpost_status: str) -> ShippingStatus:
    """
    Map InPost status to our ShippingStatus enum.
    
    InPost statuses:
    - created, confirmed -> LABEL_CREATED
    - picked_up -> PICKED_UP
    - in_transit, dispatched -> IN_TRANSIT
    - out_for_delivery -> OUT_FOR_DELIVERY
    - delivered -> DELIVERED
    - returned_to_sender -> RETURNED
    - exception, failed -> EXCEPTION
    """
    status_mapping = {
        "created": ShippingStatus.LABEL_CREATED,
        "confirmed": ShippingStatus.LABEL_CREATED,
        "picked_up": ShippingStatus.PICKED_UP,
        "in_transit": ShippingStatus.IN_TRANSIT,
        "dispatched": ShippingStatus.IN_TRANSIT,
        "out_for_delivery": ShippingStatus.OUT_FOR_DELIVERY,
        "delivered": ShippingStatus.DELIVERED,
        "returned_to_sender": ShippingStatus.RETURNED,
        "exception": ShippingStatus.EXCEPTION,
        "failed": ShippingStatus.EXCEPTION,
    }
    
    return status_mapping.get(inpost_status.lower(), ShippingStatus.LABEL_CREATED)


def _map_shipping_status_to_order_status(shipping_status: ShippingStatus) -> Optional[OrderStatus]:
    """
    Map ShippingStatus to OrderStatus for order updates.
    """
    mapping = {
        ShippingStatus.PICKED_UP: OrderStatus.SHIPPED,
        ShippingStatus.IN_TRANSIT: OrderStatus.SHIPPED,
        ShippingStatus.OUT_FOR_DELIVERY: OrderStatus.SHIPPED,
        ShippingStatus.DELIVERED: OrderStatus.DELIVERED,
        ShippingStatus.RETURNED: OrderStatus.CANCELLED,
        ShippingStatus.EXCEPTION: OrderStatus.PROCESSING,
    }
    return mapping.get(shipping_status)


class InPostWebhookPayload(BaseModel):
    """InPost webhook payload structure."""
    shipment_id: int
    tracking_number: Optional[str] = None
    status: Optional[str] = None
    return_tracking_number: Optional[str] = None
    offers: Optional[List[Dict[str, Any]]] = None


class InPostWebhookEvent(BaseModel):
    """InPost webhook event structure."""
    event_ts: str
    event: str  # shipment_confirmed, shipment_status_changed, offers_prepared
    organization_id: int
    payload: InPostWebhookPayload


@router.get("/inpost/webhook")
def verify_inpost_webhook(request: Request):
    """
    Verify webhook endpoint (GET request).
    
    InPost requires webhook URL to respond with HTTP 200 on GET request.
    This endpoint is used for webhook URL verification.
    """
    # Log webhook verification attempt
    client_ip = _get_client_ip(request)
    logger.info(f"InPost webhook verification request from IP: {client_ip}")
    
    return {"status": "ok", "message": "Webhook endpoint is ready"}


@router.post("/inpost/webhook")
async def handle_inpost_webhook(
    event: InPostWebhookEvent,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Handle InPost webhook events.
    
    Webhook events:
    - shipment_confirmed: Shipment created and confirmed
    - shipment_status_changed: Shipment status changed
    - offers_prepared: Offers prepared for shipment (offer mode)
    
    IP validation: Webhooks come from 91.216.25.0/24
    """
    client_ip = _get_client_ip(request)
    
    # Validate IP address (optional but recommended)
    # In production, you might want to enable this
    # if not _validate_inpost_ip(client_ip):
    #     logger.warning(f"Webhook request from unauthorized IP: {client_ip}")
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Unauthorized IP address"
    #     )
    
    logger.info(f"InPost webhook event received: {event.event} from IP: {client_ip}")
    
    try:
        shipment_id = event.payload.shipment_id
        tracking_number = event.payload.tracking_number
        
        # Find shipment by tracking number or shipment_id
        shipment = None
        
        if tracking_number:
            shipment = db.query(Shipment).filter(
                Shipment.tracking_number == tracking_number,
                Shipment.provider == ShippingProvider.INPOST
            ).first()
        
        # If not found by tracking number, try to find by provider_data
        if not shipment:
            # Try to find by InPost shipment_id stored in provider_data
            shipments = db.query(Shipment).filter(
                Shipment.provider == ShippingProvider.INPOST
            ).all()
            
            for s in shipments:
                if s.provider_data and s.provider_data.get("inpost_shipment_id") == shipment_id:
                    shipment = s
                    break
        
        if not shipment:
            logger.warning(f"Shipment not found for InPost shipment_id: {shipment_id}, tracking_number: {tracking_number}")
            # Return 200 to acknowledge webhook even if shipment not found
            return {"status": "received", "message": "Webhook received but shipment not found"}
        
        # Handle different event types
        if event.event == "shipment_confirmed":
            # Shipment created and confirmed
            if tracking_number:
                shipment.tracking_number = tracking_number
                shipment.tracking_url = f"https://inpost.pl/sledzenie-przesylek?number={tracking_number}"
            
            # Update provider_data with InPost shipment_id
            provider_data = shipment.provider_data or {}
            provider_data["inpost_shipment_id"] = shipment_id
            provider_data["confirmed_at"] = event.event_ts
            shipment.provider_data = provider_data
            
            # Update status
            shipment.status = ShippingStatus.LABEL_CREATED
            
            # Update order tracking
            if shipment.order:
                shipment.order.tracking_number = tracking_number
                shipment.order.tracking_url = shipment.tracking_url
                shipment.order.status = OrderStatus.PROCESSING
                
                # Send email notification with tracking number
                background_tasks.add_task(
                    send_order_status_email,
                    order=shipment.order,
                    status=OrderStatus.PROCESSING,
                    db=db
                )
            
            logger.info(f"Shipment confirmed: {tracking_number} for order {shipment.order_id}")
        
        elif event.event == "shipment_status_changed":
            # Shipment status changed
            if event.payload.status:
                new_status = _map_inpost_status_to_shipping_status(event.payload.status)
                shipment.status = new_status
                
                # Update tracking events history
                tracking_events = shipment.tracking_events or []
                tracking_events.append({
                    "timestamp": event.event_ts,
                    "status": event.payload.status,
                    "mapped_status": new_status.value
                })
                shipment.tracking_events = tracking_events
                
                # Update order status
                if shipment.order:
                    order_status = _map_shipping_status_to_order_status(new_status)
                    if order_status:
                        old_order_status = shipment.order.status
                        shipment.order.status = order_status
                        
                        # Send email notification if status changed
                        if old_order_status != order_status:
                            background_tasks.add_task(
                                send_order_status_email,
                                order=shipment.order,
                                status=order_status,
                                db=db
                            )
                    
                    # Set delivered_at if delivered
                    if new_status == ShippingStatus.DELIVERED:
                        shipment.delivered_at = datetime.now()
                        shipment.order.delivered_at = datetime.now()
                        if shipment.order.status != OrderStatus.DELIVERED:
                            shipment.order.status = OrderStatus.DELIVERED
                            # Send email notification
                            background_tasks.add_task(
                                send_order_status_email,
                                order=shipment.order,
                                status=OrderStatus.DELIVERED,
                                db=db
                            )
                    
                    # Set shipped_at if picked up
                    if new_status == ShippingStatus.PICKED_UP and not shipment.order.shipped_at:
                        shipment.order.shipped_at = datetime.now()
                        if shipment.order.status != OrderStatus.SHIPPED:
                            shipment.order.status = OrderStatus.SHIPPED
                            # Send email notification
                            background_tasks.add_task(
                                send_order_status_email,
                                order=shipment.order,
                                status=OrderStatus.SHIPPED,
                                db=db
                            )
                
                # Handle return tracking number
                if event.payload.return_tracking_number:
                    provider_data = shipment.provider_data or {}
                    provider_data["return_tracking_number"] = event.payload.return_tracking_number
                    shipment.provider_data = provider_data
                
                logger.info(f"Shipment status changed: {event.payload.status} -> {new_status.value} for {tracking_number}")
        
        elif event.event == "offers_prepared":
            # Offers prepared (offer mode)
            if event.payload.offers:
                provider_data = shipment.provider_data or {}
                provider_data["offers"] = event.payload.offers
                provider_data["offers_prepared_at"] = event.event_ts
                shipment.provider_data = provider_data
                
                logger.info(f"Offers prepared for shipment {shipment_id}: {len(event.payload.offers)} offers")
        
        # Update shipment updated_at
        shipment.updated_at = datetime.now()
        
        db.commit()
        db.refresh(shipment)
        
        return {
            "status": "success",
            "event": event.event,
            "shipment_id": shipment_id,
            "processed": True
        }
    
    except Exception as e:
        logger.error(f"Error processing InPost webhook: {str(e)}", exc_info=True)
        db.rollback()
        
        # Return 200 to acknowledge webhook even on error
        # InPost will retry if we return error status
        return {
            "status": "error",
            "message": str(e),
            "event": event.event
        }

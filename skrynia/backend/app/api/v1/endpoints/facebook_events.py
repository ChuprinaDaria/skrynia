"""
Facebook Conversions API endpoint.

Receives events from frontend and forwards them to Facebook Conversions API.
This allows server-side event tracking for better accuracy and ad blocker bypass.
"""

from fastapi import APIRouter, Request, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import time
import uuid

from app.services.facebook_conversions import get_facebook_api, get_dataset_quality_api, get_dataset_quality_api

router = APIRouter()


class UserDataRequest(BaseModel):
    """User data for Facebook Conversions API."""
    email: Optional[str] = None
    phone: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    external_id: Optional[str] = None
    gender: Optional[str] = None  # 'm' or 'f'
    fbc: Optional[str] = None  # Facebook Click ID from _fbc cookie
    fbp: Optional[str] = None  # Facebook Browser ID from _fbp cookie


class ContentItem(BaseModel):
    """Content item for custom data."""
    id: Optional[str] = None
    quantity: Optional[int] = None
    item_price: Optional[float] = None


class CustomDataRequest(BaseModel):
    """Custom data for Facebook Conversions API."""
    value: Optional[float] = None
    currency: str = "PLN"
    content_ids: Optional[List[str]] = None
    contents: Optional[List[ContentItem]] = None
    content_name: Optional[str] = None
    content_category: Optional[str] = None
    content_type: Optional[str] = None  # e.g., "product" (required for AddToCart, ViewContent)
    num_items: Optional[int] = None


class FacebookEventRequest(BaseModel):
    """Request model for Facebook Conversions API event."""
    event_name: str = Field(..., description="Event name (e.g., AddToCart, Purchase, InitiateCheckout)")
    event_time: Optional[int] = Field(None, description="Unix timestamp in seconds (defaults to current time)")
    event_id: Optional[str] = Field(None, description="Unique event ID for deduplication")
    event_source_url: Optional[str] = Field(None, description="URL where the event occurred")
    action_source: str = Field("website", description="Source of the event")
    user_data: Optional[UserDataRequest] = None
    custom_data: Optional[CustomDataRequest] = None
    test_event_code: Optional[str] = Field(None, description="Test event code for testing")


@router.post("/track", status_code=status.HTTP_200_OK)
async def track_facebook_event(
    event: FacebookEventRequest,
    request: Request
):
    """
    Track a Facebook Conversions API event.
    
    Receives event data from frontend and forwards it to Facebook Conversions API.
    This endpoint is public (no authentication required) as it's called from client-side.
    """
    # Get Facebook API instance
    fb_api = get_facebook_api()
    
    if not fb_api:
        # Facebook API not configured, return success to not break user flow
        return {
            "success": False,
            "message": "Facebook Conversions API not configured",
            "event_id": event.event_id or str(uuid.uuid4())
        }
    
    # Get client IP and user agent from request
    client_ip = request.client.host if request.client else None
    client_user_agent = request.headers.get("user-agent")
    
    # For website events, client_user_agent is REQUIRED
    if event.action_source == "website" and not client_user_agent:
        client_user_agent = "Mozilla/5.0 (compatible; FacebookBot/1.0)"  # Fallback
    
    # For website events, event_source_url is REQUIRED
    # If not provided, try to get from Referer header or construct from request
    if event.action_source == "website" and not event.event_source_url:
        event_source_url = request.headers.get("referer")
        if not event_source_url:
            # Try to construct from request
            scheme = request.url.scheme if hasattr(request, 'url') else 'https'
            host = request.headers.get("host", "runebox.eu")
            path = request.headers.get("x-forwarded-uri", "/")
            event_source_url = f"{scheme}://{host}{path}"
        event.event_source_url = event_source_url
    
    # Build user_data
    # For website events, user_data with client_user_agent is REQUIRED
    user_data = None
    if event.user_data or event.action_source == "website":
        user_data = fb_api._get_user_data(
            email=event.user_data.email if event.user_data else None,
            phone=event.user_data.phone if event.user_data else None,
            first_name=event.user_data.first_name if event.user_data else None,
            last_name=event.user_data.last_name if event.user_data else None,
            city=event.user_data.city if event.user_data else None,
            state=event.user_data.state if event.user_data else None,
            zip_code=event.user_data.zip_code if event.user_data else None,
            country=event.user_data.country if event.user_data else None,
            external_id=event.user_data.external_id if event.user_data else None,
            gender=event.user_data.gender if event.user_data else None,
            client_ip_address=client_ip,
            client_user_agent=client_user_agent,  # REQUIRED for website events
            fbc=event.user_data.fbc if event.user_data else None,
            fbp=event.user_data.fbp if event.user_data else None,
        )
    
    # Build custom_data
    custom_data = None
    if event.custom_data:
        contents = None
        if event.custom_data.contents:
            contents = [
                {
                    "id": item.id,
                    "quantity": item.quantity,
                    "item_price": item.item_price,
                }
                for item in event.custom_data.contents
            ]
        
        custom_data = fb_api._get_custom_data(
            value=event.custom_data.value,
            currency=event.custom_data.currency,
            content_ids=event.custom_data.content_ids,
            contents=contents,
            content_name=event.custom_data.content_name,
            content_category=event.custom_data.content_category,
            num_items=event.custom_data.num_items,
        )
    
    # Generate event_id if not provided
    event_id = event.event_id or str(uuid.uuid4())
    
    # Send event to Facebook
    response = fb_api.send_event(
        event_name=event.event_name,
        event_time=event.event_time,
        event_id=event_id,
        event_source_url=event.event_source_url,
        action_source=event.action_source,
        user_data=user_data,
        custom_data=custom_data,
        test_event_code=event.test_event_code,
    )
    
    # Return response
    return {
        "success": "error" not in response,
        "event_id": event_id,
        "response": response,
    }


@router.post("/track-batch", status_code=status.HTTP_200_OK)
async def track_facebook_events_batch(
    events: List[FacebookEventRequest],
    request: Request
):
    """
    Track multiple Facebook Conversions API events in a single batch.
    
    More efficient for sending multiple events at once.
    """
    # Get Facebook API instance
    fb_api = get_facebook_api()
    
    if not fb_api:
        # Facebook API not configured, return success to not break user flow
        return {
            "success": False,
            "message": "Facebook Conversions API not configured",
            "events_processed": 0
        }
    
    # Get client IP and user agent from request
    client_ip = request.client.host if request.client else None
    client_user_agent = request.headers.get("user-agent")
    
    # For website events, client_user_agent is REQUIRED
    if not client_user_agent:
        client_user_agent = "Mozilla/5.0 (compatible; FacebookBot/1.0)"  # Fallback
    
    # Build events for batch request
    fb_events = []
    for event in events:
        # For website events, event_source_url is REQUIRED
        if event.action_source == "website" and not event.event_source_url:
            event_source_url = request.headers.get("referer")
            if not event_source_url:
                scheme = request.url.scheme if hasattr(request, 'url') else 'https'
                host = request.headers.get("host", "runebox.eu")
                path = request.headers.get("x-forwarded-uri", "/")
                event_source_url = f"{scheme}://{host}{path}"
            event.event_source_url = event_source_url
        # Build user_data
        # For website events, user_data with client_user_agent is REQUIRED
        user_data = None
        if event.user_data or event.action_source == "website":
            user_data = fb_api._get_user_data(
                email=event.user_data.email if event.user_data else None,
                phone=event.user_data.phone if event.user_data else None,
                first_name=event.user_data.first_name if event.user_data else None,
                last_name=event.user_data.last_name if event.user_data else None,
                city=event.user_data.city if event.user_data else None,
                state=event.user_data.state if event.user_data else None,
                zip_code=event.user_data.zip_code if event.user_data else None,
                country=event.user_data.country if event.user_data else None,
                external_id=event.user_data.external_id if event.user_data else None,
                gender=event.user_data.gender if event.user_data else None,
                client_ip_address=client_ip,
                client_user_agent=client_user_agent,  # REQUIRED for website events
                fbc=event.user_data.fbc if event.user_data else None,
                fbp=event.user_data.fbp if event.user_data else None,
            )
        
        # Build custom_data
        custom_data = None
        if event.custom_data:
            contents = None
            if event.custom_data.contents:
                contents = [
                    {
                        "id": item.id,
                        "quantity": item.quantity,
                        "item_price": item.item_price,
                    }
                    for item in event.custom_data.contents
                ]
            
            custom_data = fb_api._get_custom_data(
                value=event.custom_data.value,
                currency=event.custom_data.currency,
                content_ids=event.custom_data.content_ids,
                contents=contents,
                content_name=event.custom_data.content_name,
                content_category=event.custom_data.content_category,
                content_type=event.custom_data.content_type,
                num_items=event.custom_data.num_items,
            )
        
        # Generate event_id if not provided
        event_id = event.event_id or str(uuid.uuid4())
        
        # Build event data
        event_data = {
            "event_name": event.event_name,
            "event_time": event.event_time or int(time.time()),
            "event_id": event_id,
            "action_source": event.action_source,
        }
        
        if event.event_source_url:
            event_data["event_source_url"] = event.event_source_url
        
        if user_data:
            event_data["user_data"] = user_data
        
        if custom_data:
            event_data["custom_data"] = custom_data
        
        fb_events.append(event_data)
    
    # Send batch to Facebook
    test_event_code = events[0].test_event_code if events else None
    response = fb_api.send_batch_events(fb_events, test_event_code=test_event_code)
    
    # Return response
    return {
        "success": "error" not in response,
        "events_processed": len(fb_events),
        "response": response,
    }


@router.get("/metrics/emq", status_code=status.HTTP_200_OK)
async def get_event_match_quality(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
):
    """
    Get Event Match Quality (EMQ) metrics.
    
    EMQ measures the percentage of events that match between Pixel and Conversions API.
    Higher EMQ indicates better data quality and matching.
    
    Query parameters:
    - start_date: Start date in YYYY-MM-DD format (defaults to 7 days ago)
    - end_date: End date in YYYY-MM-DD format (defaults to today)
    """
    dataset_quality_api = get_dataset_quality_api()
    
    if not dataset_quality_api:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Facebook Dataset Quality API not configured"
        )
    
    metrics = dataset_quality_api.get_event_match_quality(
        start_date=start_date,
        end_date=end_date,
    )
    
    return metrics


@router.get("/metrics/aem", status_code=status.HTTP_200_OK)
async def get_aggregated_event_measurement(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    event_type: Optional[str] = None,
):
    """
    Get Aggregated Event Measurement (AEM) metrics.
    
    Provides aggregated metrics about events sent through Conversions API.
    
    Query parameters:
    - start_date: Start date in YYYY-MM-DD format (defaults to 7 days ago)
    - end_date: End date in YYYY-MM-DD format (defaults to today)
    - event_type: Event type filter (e.g., "Purchase", "AddToCart") - optional
    """
    dataset_quality_api = get_dataset_quality_api()
    
    if not dataset_quality_api:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Facebook Dataset Quality API not configured"
        )
    
    metrics = dataset_quality_api.get_aggregated_event_measurement(
        start_date=start_date,
        end_date=end_date,
        event_type=event_type,
    )
    
    return metrics


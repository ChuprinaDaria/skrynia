"""
Facebook Conversions API integration.

Sends server-side events to Facebook for better tracking accuracy,
especially important for ad blockers and privacy-focused browsers.

Documentation: https://developers.facebook.com/docs/marketing-api/conversions-api
"""

import requests
import hashlib
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.config import settings


class FacebookConversionsAPI:
    """
    Facebook Conversions API service for server-side event tracking.
    
    This allows sending events directly from the server to Facebook,
    bypassing ad blockers and providing more accurate conversion data.
    """
    
    API_BASE_URL = "https://graph.facebook.com"
    
    def __init__(
        self,
        pixel_id: Optional[str] = None,
        access_token: Optional[str] = None,
        api_version: str = "v18.0"
    ):
        """
        Initialize Facebook Conversions API client.
        
        Args:
            pixel_id: Facebook Pixel ID (defaults to FACEBOOK_PIXEL_ID from settings)
            access_token: Facebook Access Token (defaults to FACEBOOK_ACCESS_TOKEN from settings)
            api_version: Facebook Graph API version (defaults to v18.0)
        """
        self.pixel_id = pixel_id or settings.FACEBOOK_PIXEL_ID
        self.access_token = access_token or settings.FACEBOOK_ACCESS_TOKEN
        self.api_version = api_version or settings.FACEBOOK_API_VERSION
        
        if not self.pixel_id:
            raise ValueError("Facebook Pixel ID is required")
        if not self.access_token:
            raise ValueError("Facebook Access Token is required")
    
    def _normalize_email(self, email: str) -> str:
        """Normalize email for hashing (lowercase, trim whitespace)."""
        return email.lower().strip()
    
    def _normalize_phone(self, phone: str) -> str:
        """Normalize phone number (remove spaces, dashes, parentheses)."""
        return ''.join(filter(str.isdigit, phone))
    
    def _hash_data(self, data: str) -> str:
        """Hash data using SHA256 (required by Facebook for PII)."""
        return hashlib.sha256(data.encode('utf-8')).hexdigest()
    
    def _get_user_data(
        self,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        city: Optional[str] = None,
        state: Optional[str] = None,
        zip_code: Optional[str] = None,
        country: Optional[str] = None,
        external_id: Optional[str] = None,
        client_ip_address: Optional[str] = None,
        client_user_agent: Optional[str] = None,
        fbc: Optional[str] = None,  # Facebook Click ID
        fbp: Optional[str] = None,   # Facebook Browser ID
        gender: Optional[str] = None,  # Gender parameter
    ) -> Dict[str, Any]:
        """
        Build user_data object for Conversions API.
        
        Facebook requires hashing of PII (email, phone, name, etc.)
        before sending to their API.
        
        Note: email and phone must be arrays according to Facebook API spec.
        """
        user_data = {}
        
        # Hash email if provided (must be array)
        if email:
            normalized_email = self._normalize_email(email)
            if normalized_email:
                user_data['em'] = [self._hash_data(normalized_email)]
        
        # Hash phone if provided (must be array, can contain null)
        if phone:
            normalized_phone = self._normalize_phone(phone)
            if normalized_phone:
                user_data['ph'] = [self._hash_data(normalized_phone)]
            else:
                user_data['ph'] = [None]
        
        # Hash first name if provided
        if first_name:
            user_data['fn'] = self._hash_data(first_name.lower().strip())
        
        # Hash last name if provided
        if last_name:
            user_data['ln'] = self._hash_data(last_name.lower().strip())
        
        # Hash city if provided
        if city:
            user_data['ct'] = self._hash_data(city.lower().strip())
        
        # Hash state if provided
        if state:
            user_data['st'] = self._hash_data(state.lower().strip())
        
        # Hash zip code if provided
        if zip_code:
            user_data['zp'] = self._hash_data(zip_code.strip())
        
        # Hash country if provided
        if country:
            user_data['country'] = self._hash_data(country.lower().strip())
        
        # Gender (not hashed, but normalized)
        if gender:
            # Normalize gender: m, f, or empty string
            gender_normalized = gender.lower().strip()
            if gender_normalized in ['m', 'f', 'male', 'female']:
                user_data['ge'] = gender_normalized[0]  # 'm' or 'f'
        
        # External ID (not hashed, but should be unique identifier)
        if external_id:
            user_data['external_id'] = str(external_id)
        
        # Client IP address (not hashed, used for matching)
        if client_ip_address:
            user_data['client_ip_address'] = client_ip_address
        
        # Client user agent (not hashed, used for matching)
        # REQUIRED for website events according to Facebook spec
        if client_user_agent:
            user_data['client_user_agent'] = client_user_agent
        # Note: If action_source is "website", this should always be set by the caller
        
        # Facebook Click ID (from _fbc cookie)
        if fbc:
            user_data['fbc'] = fbc
        
        # Facebook Browser ID (from _fbp cookie)
        if fbp:
            user_data['fbp'] = fbp
        
        return user_data
    
    def _get_custom_data(
        self,
        value: Optional[float] = None,
        currency: str = "PLN",
        content_ids: Optional[List[str]] = None,
        contents: Optional[List[Dict[str, Any]]] = None,
        content_name: Optional[str] = None,
        content_category: Optional[str] = None,
        content_type: Optional[str] = None,  # e.g., "product"
        num_items: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Build custom_data object for Conversions API.
        
        According to Facebook spec:
        - value should be string for some events
        - content_type is required for AddToCart and ViewContent
        """
        custom_data = {}
        
        if value is not None:
            # Facebook accepts both number and string, but string is more reliable
            custom_data['value'] = str(value) if isinstance(value, (int, float)) else value
            custom_data['currency'] = currency
        
        if content_ids:
            custom_data['content_ids'] = content_ids
        
        if contents:
            custom_data['contents'] = contents
        
        if content_name:
            custom_data['content_name'] = content_name
        
        if content_category:
            custom_data['content_category'] = content_category
        
        if content_type:
            custom_data['content_type'] = content_type
        
        if num_items is not None:
            custom_data['num_items'] = num_items
        
        return custom_data
    
    def send_event(
        self,
        event_name: str,
        event_time: Optional[int] = None,
        event_id: Optional[str] = None,
        event_source_url: Optional[str] = None,
        action_source: str = "website",
        user_data: Optional[Dict[str, Any]] = None,
        custom_data: Optional[Dict[str, Any]] = None,
        test_event_code: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Send a single event to Facebook Conversions API.
        
        Args:
            event_name: Event name (e.g., "AddToCart", "Purchase", "InitiateCheckout")
            event_time: Unix timestamp in seconds (defaults to current time)
            event_id: Unique event ID for deduplication (optional)
            event_source_url: URL where the event occurred (optional)
            action_source: Source of the event (default: "website")
            user_data: User data dictionary (will be built if not provided)
            custom_data: Custom data dictionary (product info, value, etc.)
            test_event_code: Test event code for testing (optional)
        
        Returns:
            Response from Facebook API
        """
        if event_time is None:
            event_time = int(time.time())
        
        # Validate event_time: cannot be more than 7 days ago
        current_time = int(time.time())
        seven_days_ago = current_time - (7 * 24 * 60 * 60)
        if event_time < seven_days_ago:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Event time {event_time} is more than 7 days ago, using current time")
            event_time = current_time
        
        # Build event data
        event_data = {
            "event_name": event_name,
            "event_time": event_time,
            "action_source": action_source,
        }
        
        if event_id:
            event_data["event_id"] = event_id
        
        # For website events, event_source_url is REQUIRED according to Facebook spec
        if action_source == "website":
            if not event_source_url:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"event_source_url is REQUIRED for website events but not provided")
                # Use a default URL as fallback (should be set by caller)
                event_source_url = "https://runebox.eu"
            event_data["event_source_url"] = event_source_url
        elif event_source_url:
            # For non-website events, event_source_url is optional
            event_data["event_source_url"] = event_source_url
        
        # For website events, client_user_agent is REQUIRED in user_data according to Facebook spec
        if action_source == "website":
            if not user_data:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"user_data with client_user_agent is REQUIRED for website events")
                # Create minimal user_data with client_user_agent
                user_data = {"client_user_agent": "Mozilla/5.0"}
            elif "client_user_agent" not in user_data or not user_data.get("client_user_agent"):
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"client_user_agent is REQUIRED in user_data for website events")
                # Add default if missing
                user_data["client_user_agent"] = "Mozilla/5.0"
        
        if user_data:
            event_data["user_data"] = user_data
        
        if custom_data:
            event_data["custom_data"] = custom_data
        
        # Build request payload
        payload = {
            "data": [event_data],
            "access_token": self.access_token,
        }
        
        if test_event_code:
            payload["test_event_code"] = test_event_code
        
        # Send request to Facebook
        url = f"{self.API_BASE_URL}/{self.api_version}/{self.pixel_id}/events"
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            # Log error but don't raise (fail silently to not break user flow)
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Facebook Conversions API error: {str(e)}")
            return {"error": str(e)}
    
    def send_batch_events(
        self,
        events: List[Dict[str, Any]],
        test_event_code: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Send multiple events in a single batch request.
        
        Args:
            events: List of event dictionaries
            test_event_code: Test event code for testing (optional)
        
        Returns:
            Response from Facebook API
        """
        # Build request payload
        payload = {
            "data": events,
            "access_token": self.access_token,
        }
        
        if test_event_code:
            payload["test_event_code"] = test_event_code
        
        # Send request to Facebook
        url = f"{self.API_BASE_URL}/{self.api_version}/{self.pixel_id}/events"
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            # Log error but don't raise (fail silently to not break user flow)
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Facebook Conversions API batch error: {str(e)}")
            return {"error": str(e)}


# Global instance (will be initialized if credentials are available)
_facebook_api: Optional[FacebookConversionsAPI] = None


def get_facebook_api() -> Optional[FacebookConversionsAPI]:
    """Get or create Facebook Conversions API instance."""
    global _facebook_api
    
    if _facebook_api is None:
        try:
            _facebook_api = FacebookConversionsAPI()
        except (ValueError, AttributeError):
            # Credentials not configured, return None
            _facebook_api = None
    
    return _facebook_api


class FacebookDatasetQualityAPI:
    """
    Facebook Dataset Quality API service for retrieving data quality metrics.
    
    Provides metrics such as Event Match Quality (EMQ) to track and optimize
    the performance of Conversions API integration.
    
    Documentation: https://developers.facebook.com/docs/marketing-api/dataset-quality-api
    """
    
    API_BASE_URL = "https://graph.facebook.com"
    
    def __init__(
        self,
        pixel_id: Optional[str] = None,
        dataset_quality_token: Optional[str] = None,
        api_version: str = "v18.0"
    ):
        """
        Initialize Facebook Dataset Quality API client.
        
        Args:
            pixel_id: Facebook Pixel ID (defaults to FACEBOOK_PIXEL_ID from settings)
            dataset_quality_token: Dataset Quality API Token (defaults to FACEBOOK_DATASET_QUALITY_TOKEN from settings)
            api_version: Facebook Graph API version (defaults to v18.0)
        """
        self.pixel_id = pixel_id or settings.FACEBOOK_PIXEL_ID
        self.dataset_quality_token = dataset_quality_token or settings.FACEBOOK_DATASET_QUALITY_TOKEN
        self.api_version = api_version or settings.FACEBOOK_API_VERSION
        
        if not self.pixel_id:
            raise ValueError("Facebook Pixel ID is required")
        if not self.dataset_quality_token:
            raise ValueError("Facebook Dataset Quality API Token is required")
    
    def get_event_match_quality(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Get Event Match Quality (EMQ) metrics.
        
        EMQ measures the percentage of events that match between Pixel and Conversions API.
        Higher EMQ indicates better data quality and matching.
        
        Args:
            start_date: Start date in YYYY-MM-DD format (defaults to 7 days ago)
            end_date: End date in YYYY-MM-DD format (defaults to today)
        
        Returns:
            Dictionary with EMQ metrics
        """
        from datetime import datetime, timedelta
        
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        if not start_date:
            start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        
        url = f"{self.API_BASE_URL}/{self.api_version}/{self.pixel_id}/event_match_quality"
        
        params = {
            "access_token": self.dataset_quality_token,
            "start_date": start_date,
            "end_date": end_date,
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Facebook Dataset Quality API error: {str(e)}")
            return {"error": str(e)}
    
    def get_aggregated_event_measurement(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        event_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Get Aggregated Event Measurement (AEM) metrics.
        
        Provides aggregated metrics about events sent through Conversions API.
        
        Args:
            start_date: Start date in YYYY-MM-DD format (defaults to 7 days ago)
            end_date: End date in YYYY-MM-DD format (defaults to today)
            event_type: Event type filter (e.g., "Purchase", "AddToCart") - optional
        
        Returns:
            Dictionary with AEM metrics
        """
        from datetime import datetime, timedelta
        
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        if not start_date:
            start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        
        url = f"{self.API_BASE_URL}/{self.api_version}/{self.pixel_id}/aggregated_event_measurement"
        
        params = {
            "access_token": self.dataset_quality_token,
            "start_date": start_date,
            "end_date": end_date,
        }
        
        if event_type:
            params["event_type"] = event_type
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Facebook Dataset Quality API error: {str(e)}")
            return {"error": str(e)}


# Global instance for Dataset Quality API
_dataset_quality_api: Optional[FacebookDatasetQualityAPI] = None


def get_dataset_quality_api() -> Optional[FacebookDatasetQualityAPI]:
    """Get or create Facebook Dataset Quality API instance."""
    global _dataset_quality_api
    
    if _dataset_quality_api is None:
        try:
            _dataset_quality_api = FacebookDatasetQualityAPI()
        except (ValueError, AttributeError):
            # Credentials not configured, return None
            _dataset_quality_api = None
    
    return _dataset_quality_api


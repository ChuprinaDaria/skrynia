import requests
import uuid
from typing import Dict, Any, List, Optional
from app.core.config import settings


class InPostAPIError(Exception):
    """Base exception for InPost API errors."""
    def __init__(self, message: str, status_code: int = None, error_code: str = None, details: Dict = None):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class InPostValidationError(InPostAPIError):
    """Validation error from InPost API."""
    pass


class InPostResourceNotFoundError(InPostAPIError):
    """Resource not found error."""
    pass


class InPostAccessForbiddenError(InPostAPIError):
    """Access forbidden error."""
    pass


class InPostService:
    """
    InPost ShipX API integration for Poland.
    
    Modular postal service implementation following InPost API documentation:
    https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/overview
    
    Features:
    - Proper request headers (Authorization, X-User-Agent, X-User-Agent-Version, X-Request-ID, Accept-Language)
    - Error handling according to API specification
    - Collection handling with paging support
    - Organization management
    - Full shipment creation with sender/receiver addresses, insurance, COD
    - Offer mode support
    - Batch operations
    - Dispatch Orders
    """
    
    API_URL = "https://api-shipx-pl.easypack24.net/v1"
    SANDBOX_URL = "https://sandbox-api-shipx-pl.easypack24.net/v1"
    
    GLOBAL_API_URL = "https://api.inpost-group.com"
    GLOBAL_API_SANDBOX_URL = "https://stage-api.inpost-group.com"
    GLOBAL_API_OAUTH_URL = "https://api.inpost-group.com/oauth2/token"
    GLOBAL_API_OAUTH_SANDBOX_URL = "https://stage-api.inpost-group.com/oauth2/token"
    
    CLIENT_NAME = "Skrynia"
    CLIENT_VERSION = "1.0.0"
    
    def __init__(
        self,
        api_token: str = None,
        organization_id: str = None,
        sandbox: bool = True,
        user_agent: str = None,
        user_agent_version: str = None,
        accept_language: str = "pl_PL",
        use_global_api: bool = None,
        client_id: str = None,
        client_secret: str = None
    ):
        """
        Initialize InPost service.
        
        Args:
            api_token: InPost API token (Bearer token)
            organization_id: Organization ID (can be fetched from API if not provided)
            sandbox: Use sandbox environment
            user_agent: Custom X-User-Agent header value
            user_agent_version: Custom X-User-Agent-Version header value
            accept_language: Accept-Language header (keys, en_GB, pl_PL)
        """
        self.api_token = api_token or getattr(settings, "INPOST_API_TOKEN", "")
        self.organization_id = organization_id or getattr(settings, "INPOST_ORGANIZATION_ID", "")
        self.sandbox = sandbox
        self.accept_language = accept_language
        
        self.use_global_api = use_global_api if use_global_api is not None else getattr(settings, "INPOST_USE_GLOBAL_API", False)
        self.client_id = client_id or getattr(settings, "INPOST_CLIENT_ID", "")
        self.client_secret = client_secret or getattr(settings, "INPOST_CLIENT_SECRET", "")
        
        if self.use_global_api:
            self.base_url = self.GLOBAL_API_SANDBOX_URL if sandbox else self.GLOBAL_API_URL
            self.oauth_url = self.GLOBAL_API_OAUTH_SANDBOX_URL if sandbox else self.GLOBAL_API_OAUTH_URL
        else:
            self.base_url = self.SANDBOX_URL if sandbox else self.API_URL
            self.oauth_url = None
        
        self.user_agent = user_agent or self.CLIENT_NAME
        self.user_agent_version = user_agent_version or self.CLIENT_VERSION
        
        if self.use_global_api:
            self.base_headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            self._access_token = None
            self._token_expires_at = None
        else:
            self.base_headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json",
                "X-User-Agent": self.user_agent,
                "X-User-Agent-Version": self.user_agent_version,
                "Accept-Language": self.accept_language
            }
        
        self._organization_cache = None
    
    def _get_oauth_token(self) -> str:
        """Get OAuth 2.0 access token for Global API."""
        import time
        from base64 import b64encode
        
        if self._access_token and self._token_expires_at and time.time() < self._token_expires_at:
            return self._access_token
        
        if not self.client_id or not self.client_secret:
            raise InPostAPIError("OAuth credentials (client_id, client_secret) are required for Global API")
        
        auth_header = b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
        
        response = requests.post(
            self.oauth_url,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {auth_header}"
            },
            data={
                "grant_type": "client_credentials",
                "scope": "openid api:points:read api:shipments:read api:shipments:write"
            },
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
        
        data = response.json()
        self._access_token = data["access_token"]
        expires_in = data.get("expires_in", 599)
        self._token_expires_at = time.time() + expires_in - 60
        
        return self._access_token
    
    def _get_headers(self, request_id: str = None) -> Dict[str, str]:
        """
        Get request headers with optional X-Request-ID.
        
        Args:
            request_id: Optional request ID for debugging
            
        Returns:
            Headers dictionary
        """
        headers = self.base_headers.copy()
        
        if self.use_global_api:
            token = self._get_oauth_token()
            headers["Authorization"] = f"Bearer {token}"
        
        if request_id:
            headers["X-Request-ID"] = request_id
        else:
            headers["X-Request-ID"] = str(uuid.uuid4())
        
        return headers
    
    def _handle_error(self, response: requests.Response) -> None:
        """
        Handle API error responses according to InPost API specification.
        
        Args:
            response: HTTP response object
            
        Raises:
            InPostAPIError: Appropriate exception based on error type
        """
        try:
            error_data = response.json()
        except ValueError:
            # Response is not JSON
            raise InPostAPIError(
                message=f"InPost API error: {response.status_code} {response.reason}",
                status_code=response.status_code
            )
        
        status_code = error_data.get("status", response.status_code)
        error_code = error_data.get("error")
        description = error_data.get("description", "Unknown error")
        details = error_data.get("details")
        
        # Map error codes to specific exceptions
        if error_code == "resource_not_found":
            raise InPostResourceNotFoundError(
                message=description,
                status_code=status_code,
                error_code=error_code,
                details=details
            )
        elif error_code == "access_forbidden":
            raise InPostAccessForbiddenError(
                message=description,
                status_code=status_code,
                error_code=error_code,
                details=details
            )
        elif error_code == "validation_failed":
            raise InPostValidationError(
                message=description,
                status_code=status_code,
                error_code=error_code,
                details=details
            )
        elif error_code == "invalid_parameter":
            raise InPostAPIError(
                message=description,
                status_code=status_code,
                error_code=error_code,
                details=details
            )
        elif error_code == "offer_expired":
            raise InPostAPIError(
                message=description,
                status_code=status_code,
                error_code=error_code,
                details=details
            )
        else:
            # Generic error
            raise InPostAPIError(
                message=description,
                status_code=status_code,
                error_code=error_code,
                details=details
            )
    
    def _make_request(
        self,
        method: str,
        endpoint: str,
        params: Dict = None,
        json_data: Dict = None,
        request_id: str = None,
        binary_response: bool = False
    ) -> Any:
        """
        Make HTTP request to InPost API with proper error handling.
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint (relative to base URL)
            params: Query parameters
            json_data: JSON payload for POST/PUT requests
            request_id: Optional request ID for debugging
            binary_response: If True, return binary content instead of JSON
            
        Returns:
            Response JSON data or binary content
            
        Raises:
            InPostAPIError: On API errors
            requests.exceptions.RequestException: On network errors
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = self._get_headers(request_id)
        
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                params=params,
                json=json_data,
                timeout=30
            )
            
            # Handle error responses
            if not response.ok:
                self._handle_error(response)
            
            # Return binary content or JSON
            if binary_response:
                return response.content
            
            # Return JSON response
            return response.json()
            
        except requests.exceptions.RequestException as e:
            raise InPostAPIError(
                message=f"Network error: {str(e)}",
                status_code=None
            )
    
    # ==================== Organizations ====================
    
    def get_organization(self, organization_id: str = None, request_id: str = None) -> Dict[str, Any]:
        """
        Get organization details.
        
        Args:
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Organization data
        """
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        data = self._make_request("GET", f"/organizations/{org_id}", request_id=request_id)
        
        # Cache organization data
        self._organization_cache = data
        
        return data
    
    def get_organizations(self, request_id: str = None) -> Dict[str, Any]:
        """
        Get list of organizations.
        
        Args:
            request_id: Optional request ID for debugging
            
        Returns:
            Collection response with organizations
        """
        return self._make_request("GET", "/organizations", request_id=request_id)
    
    def get_organization_id(self) -> str:
        """
        Get organization ID (from cache or settings).
        
        Returns:
            Organization ID as string
        """
        if self.organization_id:
            return self.organization_id
        
        # Try to fetch from API if we have a token
        if self.api_token:
            try:
                orgs = self.get_organizations()
                items = orgs.get("items", [])
                if items:
                    self.organization_id = str(items[0].get("id"))
                    return self.organization_id
            except Exception:
                pass
        
        return ""
    
    def get_organization_statistics(
        self,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get organization statistics.
        
        Args:
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Organization statistics
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "GET",
            f"/organizations/{org_id}/statistics",
            request_id=request_id
        )
    
    # ==================== Points ====================
    
    def get_points(
        self,
        name: str = None,
        city: str = None,
        post_code: str = None,
        type: str = None,  # parcel_locker, parcel_locker_only, parcel_locker_superpop, pop
        partner_id: str = None,
        functions: str = None,  # parcel_collect
        payment_available: bool = None,
        province: str = None,
        location_247: bool = None,  # 24/7 points for Weekend Parcels
        relative_point: str = None,  # "52.123,19.321" (lat,lng)
        relative_post_code: str = None,
        max_distance: int = None,  # meters, max 50000
        limit: int = None,  # for relative searches
        sort_by: str = None,  # name, distance_to_relative_point, status
        sort_order: str = None,  # asc, desc
        page: int = 1,
        per_page: int = 100,
        fields: str = None,  # comma-separated field names
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get list of InPost points (Paczkomaty lockers) with advanced filtering.
        
        Args:
            name: Point name (e.g., "KRA012")
            city: Filter by city name
            post_code: Filter by postal code
            type: Point type filter
            partner_id: Partner ID filter
            functions: Function filter (e.g., "parcel_collect")
            payment_available: Filter points that support COD
            province: Filter by province
            location_247: Filter 24/7 points for Weekend Parcels
            relative_point: Search near coordinates "lat,lng"
            relative_post_code: Search near postal code
            max_distance: Max distance in meters (for relative searches, max 50000)
            limit: Limit results (for relative searches)
            sort_by: Sort field
            sort_order: Sort order (asc/desc)
            page: Page number
            per_page: Items per page (max 500)
            fields: Comma-separated field names to return
            request_id: Optional request ID for debugging
            
        Returns:
            Collection response with items, count, page info
        """
        params = {
            "page": page,
            "per_page": per_page
        }
        
        if name:
            params["name"] = name
        if city:
            params["city"] = city
        if post_code:
            params["post_code"] = post_code
        if type:
            params["type"] = type
        if partner_id:
            params["partner_id"] = partner_id
        if functions:
            params["functions"] = functions
        if payment_available is not None:
            params["payment_available"] = str(payment_available).lower()
        if province:
            params["province"] = province
        if location_247 is not None:
            params["location_247"] = str(location_247).lower()
        if relative_point:
            params["relative_point"] = relative_point
        if relative_post_code:
            params["relative_post_code"] = relative_post_code
        if max_distance:
            params["max_distance"] = max_distance
        if limit:
            params["limit"] = limit
        if sort_by:
            params["sort_by"] = sort_by
        if sort_order:
            params["sort_order"] = sort_order
        if fields:
            params["fields"] = fields
        
        return self._make_request("GET", "/points", params=params, request_id=request_id)
    
    def get_paczkomats(
        self,
        city: str = None,
        postcode: str = None,
        page: int = 1,
        per_page: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Get list of InPost Paczkomat lockers (convenience method).
        
        Args:
            city: City name
            postcode: Postal code
            page: Page number
            per_page: Items per page
            
        Returns:
            List of available paczkomats
        """
        response = self.get_points(
            city=city,
            post_code=postcode,
            page=page,
            per_page=per_page
        )
        return response.get("items", [])
    
    def get_point(self, point_id: str, request_id: str = None) -> Dict[str, Any]:
        """
        Get specific point details.
        
        Args:
            point_id: Point ID (e.g., "KRA010")
            request_id: Optional request ID for debugging
            
        Returns:
            Point details
        """
        return self._make_request("GET", f"/points/{point_id}", request_id=request_id)
    
    # ==================== Shipments ====================
    
    def create_shipment(
        self,
        # Receiver (simplified)
        receiver_email: str = None,
        receiver_phone: str = None,
        receiver_name: str = None,
        # Full receiver structure
        receiver: Dict[str, Any] = None,
        # Sender (full structure) - optional, uses organization data if not provided
        sender: Dict[str, Any] = None,
        # Parcels - can be dict (single parcel) or list (multiple parcels)
        parcels: Any = None,  # Dict[str, Any] or List[Dict[str, Any]]
        parcel_template: str = "small",  # small, medium, large, letter_a
        # Service
        service: str = "inpost_locker_standard",
        target_point: str = None,
        # Additional options
        insurance: Dict[str, Any] = None,  # {"amount": 25, "currency": "PLN"}
        cod: Dict[str, Any] = None,  # {"amount": 12.50, "currency": "PLN"}
        additional_services: List[str] = None,  # ["email", "sms", "saturday"]
        custom_attributes: Dict[str, Any] = None,
        sending_method: str = None,  # dispatch_order, parcel_locker
        dropoff_point: str = None,
        end_of_week_collection: bool = False,
        # Metadata
        reference: str = None,  # Min 3, max 100 chars, can be empty
        comments: str = None,  # Min 3, max 100 chars, can be empty
        external_customer_id: str = None,
        # Return shipment
        is_return: bool = False,  # If true, swaps sender/receiver automatically
        # Offer mode
        only_choice_of_offer: bool = False,  # Create offer without payment
        # Cost center
        mpk: str = None,  # Cost center name (max 255 chars)
        # Organization
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create InPost shipment in simplified mode.
        
        According to InPost API documentation:
        - For courier services: receiver must have phone, (company_name or first_name+last_name), and address
        - For locker services: receiver must have phone and email (address optional)
        - Sender is optional (uses organization data if not provided)
        - Parcels can be a single dict or list of dicts
        - Insurance is required for certain services when COD is provided
        
        Args:
            receiver_email: Customer email (if using simplified receiver)
            receiver_phone: Customer phone (if using simplified receiver)
            receiver_name: Customer name (if using simplified receiver)
            receiver: Full receiver structure with address (overrides simplified fields)
            sender: Full sender structure with address (optional, uses org data if not provided)
            parcels: Parcel definition(s) - can be dict (single) or list (multiple, max 1000)
            parcel_template: Template if parcels not provided (small, medium, large, letter_a)
            service: Service type (inpost_locker_standard, inpost_courier_standard, etc.)
            target_point: Target paczkomat code (e.g., "KRA010") - required for locker services
            insurance: Insurance details {"amount": 25, "currency": "PLN"}
            cod: Cash on delivery {"amount": 12.50, "currency": "PLN"}
            additional_services: List of services ["email", "sms", "saturday"]
            custom_attributes: Custom attributes dict
            sending_method: Sending method (dispatch_order, parcel_locker)
            dropoff_point: Dropoff point for C2C services
            end_of_week_collection: Weekend collection flag
            reference: Your internal order reference (min 3, max 100 chars, can be empty)
            comments: Comments (min 3, max 100 chars, can be empty)
            external_customer_id: External customer ID
            is_return: If true, marks as return shipment (swaps sender/receiver)
            only_choice_of_offer: If true, creates offer without payment
            mpk: Cost center name (max 255 chars, must exist in organization)
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Shipment data with tracking number, status, offers, etc.
            
        Raises:
            InPostAPIError: On validation errors or API errors
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        payload = {}
        
        # Sender (optional - uses organization data if not provided)
        if sender:
            payload["sender"] = sender
        
        # Receiver (required)
        if receiver:
            payload["receiver"] = receiver
        elif receiver_email or receiver_phone or receiver_name:
            payload["receiver"] = {}
            if receiver_email:
                payload["receiver"]["email"] = receiver_email
            if receiver_phone:
                payload["receiver"]["phone"] = receiver_phone
            if receiver_name:
                # Try to split name into first_name and last_name
                name_parts = receiver_name.split(maxsplit=1)
                if len(name_parts) == 2:
                    payload["receiver"]["first_name"] = name_parts[0]
                    payload["receiver"]["last_name"] = name_parts[1]
                else:
                    payload["receiver"]["name"] = receiver_name
        elif not is_return:
            # Receiver is required unless it's a return shipment
            raise InPostAPIError("Receiver information is required")
        
        # Parcels (required)
        if parcels:
            # Parcels can be a dict (single parcel) or list (multiple parcels)
            if isinstance(parcels, dict):
                payload["parcels"] = parcels
            elif isinstance(parcels, list):
                if len(parcels) > 1000:
                    raise InPostAPIError("Maximum 1000 parcels allowed")
                payload["parcels"] = parcels
            else:
                raise InPostAPIError("Parcels must be a dict or list")
        else:
            # Default parcel with template
            payload["parcels"] = {"template": parcel_template}
        
        # Service (required)
        payload["service"] = service
        
        # Custom attributes
        if not custom_attributes:
            custom_attributes = {}
        
        if target_point:
            custom_attributes["target_point"] = target_point
        
        if sending_method:
            custom_attributes["sending_method"] = sending_method
        
        if dropoff_point:
            custom_attributes["dropoff_point"] = dropoff_point
        
        if custom_attributes:
            payload["custom_attributes"] = custom_attributes
        
        # Insurance (optional, but required for certain services with COD)
        if insurance:
            payload["insurance"] = insurance
        
        # COD (optional)
        if cod:
            payload["cod"] = cod
        
        # Additional services (optional)
        if additional_services:
            payload["additional_services"] = additional_services
        
        # End of week collection
        if end_of_week_collection:
            payload["end_of_week_collection"] = True
        
        # Metadata
        if reference is not None:
            # Reference can be empty string, but if provided must be 3-100 chars
            if reference and (len(reference) < 3 or len(reference) > 100):
                raise InPostAPIError("Reference must be 3-100 characters or empty")
            payload["reference"] = reference
        
        if comments is not None:
            # Comments can be empty, but if provided must be 3-100 chars
            if comments and (len(comments) < 3 or len(comments) > 100):
                raise InPostAPIError("Comments must be 3-100 characters or empty")
            payload["comments"] = comments
        
        if external_customer_id:
            payload["external_customer_id"] = external_customer_id
        
        # Return shipment flag
        if is_return:
            payload["is_return"] = True
        
        # Offer mode
        if only_choice_of_offer:
            payload["only_choice_of_offer"] = True
        
        # Cost center
        if mpk:
            if len(mpk) > 255:
                raise InPostAPIError("MPK name must be max 255 characters")
            payload["mpk"] = mpk
        
        if self.use_global_api:
            receiver_data = receiver
            if not receiver_data and (receiver_email or receiver_phone or receiver_name):
                receiver_data = {}
                if receiver_email:
                    receiver_data["email"] = receiver_email
                if receiver_phone:
                    receiver_data["phone"] = receiver_phone
                if receiver_name:
                    name_parts = receiver_name.split(maxsplit=1)
                    if len(name_parts) == 2:
                        receiver_data["first_name"] = name_parts[0]
                        receiver_data["last_name"] = name_parts[1]
                    else:
                        receiver_data["name"] = receiver_name
                if receiver and isinstance(receiver, dict) and "address" in receiver:
                    receiver_data["address"] = receiver["address"]
            
            return self.create_shipment_v2(
                receiver=receiver_data,
                sender=sender,
                target_point=target_point,
                reference=reference,
                organization_id=org_id,
                destination_country=receiver_data.get("address", {}).get("country_code") if receiver_data else None,
                request_id=request_id
            )
        
        data = self._make_request(
            "POST",
            f"/organizations/{org_id}/shipments",
            json_data=payload,
            request_id=request_id
        )
        
        return {
            "shipment_id": data.get("id"),
            "tracking_number": data.get("tracking_number"),
            "return_tracking_number": data.get("return_tracking_number"),
            "status": data.get("status"),
            "service": data.get("service"),
            "reference": data.get("reference"),
            "is_return": data.get("is_return", False),
            "target_point": target_point,
            "label_url": data.get("label", {}).get("url") if isinstance(data.get("label"), dict) else None,
            "href": data.get("href"),
            "offers": data.get("offers", []),  # For offer mode
            "selected_offer": data.get("selected_offer"),
            "parcels": data.get("parcels", []),
            "sender": data.get("sender"),
            "receiver": data.get("receiver"),
            "created_at": data.get("created_at"),
            "updated_at": data.get("updated_at")
        }
    
    def create_shipment_v2(
        self,
        receiver: Dict[str, Any],
        sender: Dict[str, Any] = None,
        target_point: str = None,
        reference: str = None,
        organization_id: str = None,
        origin_country: str = "PL",
        destination_country: str = None,
        parcel_weight: float = 0.2,
        parcel_dimensions: Dict[str, Any] = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create shipment using Global API v2.
        
        Args:
            receiver: Receiver information with address
            sender: Sender information (optional, uses organization data)
            target_point: Target point ID (e.g., "KRA108")
            reference: Order reference
            organization_id: Organization ID
            origin_country: Origin country code (default: PL)
            destination_country: Destination country code (from receiver address)
            parcel_weight: Parcel weight in kg
            parcel_dimensions: Parcel dimensions dict with length, width, height, unit
            request_id: Optional request ID
            
        Returns:
            Shipment data with tracking number
        """
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        if not receiver:
            raise InPostAPIError("Receiver information is required")
        
        receiver_address = receiver.get("address", {})
        dest_country = destination_country or receiver_address.get("country_code", "PL")
        
        payload = {
            "sender": sender or {},
            "recipient": {
                "email": receiver.get("email"),
                "phone": receiver.get("phone")
            },
            "origin": {
                "countryCode": origin_country
            },
            "destination": {
                "countryCode": dest_country
            },
            "parcels": [{
                "type": "STANDARD",
                "weight": {
                    "amount": str(int(parcel_weight * 1000)),
                    "unit": "G"
                }
            }]
        }
        
        if "first_name" in receiver and "last_name" in receiver:
            payload["recipient"]["firstName"] = receiver["first_name"]
            payload["recipient"]["lastName"] = receiver["last_name"]
        elif "name" in receiver:
            name_parts = receiver["name"].split(maxsplit=1)
            if len(name_parts) == 2:
                payload["recipient"]["firstName"] = name_parts[0]
                payload["recipient"]["lastName"] = name_parts[1]
            else:
                payload["recipient"]["name"] = receiver["name"]
        
        if target_point:
            payload["destination"]["pointId"] = target_point
        elif receiver_address:
            payload["destination"]["address"] = {
                "countryCode": receiver_address.get("country_code", dest_country),
                "street": receiver_address.get("street", ""),
                "houseNumber": receiver_address.get("building_number", ""),
                "city": receiver_address.get("city", ""),
                "postalCode": receiver_address.get("post_code", "")
            }
        
        if receiver_address and not target_point:
            payload["origin"]["address"] = {
                "countryCode": origin_country,
                "street": receiver_address.get("street", ""),
                "houseNumber": receiver_address.get("building_number", ""),
                "city": receiver_address.get("city", ""),
                "postalCode": receiver_address.get("post_code", "")
            }
        
        if parcel_dimensions:
            payload["parcels"][0]["dimensions"] = parcel_dimensions
        
        if reference:
            payload["references"] = {
                "custom": {
                    "orderNumber": reference
                }
            }
        
        deduplication_id = request_id or str(uuid.uuid4())
        headers = self._get_headers(request_id)
        headers["X-Deduplication-Id"] = deduplication_id
        
        response = requests.post(
            f"{self.base_url}/shipping/v2/organizations/{org_id}/shipments",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code not in [200, 201]:
            self._handle_error(response)
        
        data = response.json()
        
        return {
            "tracking_number": data.get("trackingNumber"),
            "shipment_id": data.get("trackingNumber"),
            "parcels": data.get("parcels", []),
            "routing": data.get("routing", {})
        }
    
    def get_shipment(self, shipment_id: str, organization_id: str = None, request_id: str = None) -> Dict[str, Any]:
        """
        Get shipment details.
        
        Args:
            shipment_id: Shipment ID
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Shipment details (may include offers if in offer mode)
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "GET",
            f"/organizations/{org_id}/shipments/{shipment_id}",
            request_id=request_id
        )
    
    def get_shipments(
        self,
        organization_id: str = None,
        page: int = 1,
        per_page: int = 100,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get list of shipments with paging support.
        
        Args:
            organization_id: Organization ID (uses instance default if not provided)
            page: Page number
            per_page: Items per page
            request_id: Optional request ID for debugging
            
        Returns:
            Collection response with shipments
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        params = {
            "page": page,
            "per_page": per_page
        }
        
        return self._make_request(
            "GET",
            f"/organizations/{org_id}/shipments",
            params=params,
            request_id=request_id
        )
    
    def select_offer(
        self,
        shipment_id: str,
        offer_id: int,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Select an offer for a shipment (offer mode).
        
        Args:
            shipment_id: Shipment ID
            offer_id: Offer ID to select
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Updated shipment data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "POST",
            f"/shipments/{shipment_id}/select_offer",
            json_data={"offer_id": offer_id},
            request_id=request_id
        )
    
    def buy_shipment(
        self,
        shipment_id: str,
        offer_id: int,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Pay for a shipment (offer mode).
        
        Important: This is an asynchronous operation. The response does not contain
        immediate changes (status change, tracking number assignment) as these
        will be available only after some time. Use webhooks (shipment_confirmed event)
        to be notified when the payment is processed.
        
        At the time of offer selection, other offers (not selected) are deleted.
        
        Args:
            shipment_id: Shipment ID
            offer_id: Offer ID (required) - must be in status 'available' or 'selected'
            request_id: Optional request ID for debugging
            
        Returns:
            Shipment data with selected offer (note: tracking_number may be null
            until async processing completes)
            
        Raises:
            InPostAPIError: On API errors
            InPostResourceNotFoundError: If shipment doesn't exist or no access
            InPostValidationError: If offer is unavailable or expired
            
        Possible errors:
            - resource_not_found: Shipment doesn't exist or no access
            - offer_unavailable: Offer is not in 'available' or 'selected' status
            - transaction_failed: Payment processing was not successful
            - offer_expired: Offer expired (offers available 5 minutes after generation)
        """
        if not offer_id:
            raise InPostAPIError("offer_id is required")
        
        payload = {
            "offer_id": offer_id
        }
        
        return self._make_request(
            "POST",
            f"/shipments/{shipment_id}/buy",
            json_data=payload,
            request_id=request_id
        )
    
    def cancel_shipment(
        self,
        shipment_id: str,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Cancel a shipment.
        
        Args:
            shipment_id: Shipment ID to cancel
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Cancellation result
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "DELETE",
            f"/organizations/{org_id}/shipments/{shipment_id}",
            request_id=request_id
        )
    
    # ==================== Batch Operations ====================
    
    def create_batch(
        self,
        shipments: List[Dict[str, Any]],
        only_choice_of_offer: bool = False,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create multiple shipments in batch.
        
        Args:
            shipments: List of shipment definitions (each with id, service, sender, receiver, etc.)
            only_choice_of_offer: If True, only create offers without buying
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Batch creation result
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        payload = {
            "only_choice_of_offer": only_choice_of_offer,
            "shipments": shipments
        }
        
        return self._make_request(
            "POST",
            f"/organizations/{org_id}/batches",
            json_data=payload,
            request_id=request_id
        )
    
    def get_batch(self, batch_id: str, request_id: str = None) -> Dict[str, Any]:
        """
        Get batch details.
        
        Args:
            batch_id: Batch ID
            request_id: Optional request ID for debugging
            
        Returns:
            Batch details
        """
        return self._make_request("GET", f"/batches/{batch_id}", request_id=request_id)
    
    def bulk_buy_shipments(
        self,
        shipments: List[Dict[str, Any]],  # [{"id": 1, "shipment_id": 235, "offer_id": 284}]
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Bulk buy multiple shipments.
        
        Args:
            shipments: List of shipment/offer mappings
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Bulk buy result
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "POST",
            f"/organizations/{org_id}/shipments/bulk_buy",
            json_data={"shipments": shipments},
            request_id=request_id
        )
    
    # ==================== Labels ====================
    
    def get_label(
        self,
        shipment_id: str,
        format: str = "Pdf",  # Pdf, Zpl, Epl
        type: str = "A6",  # A6, normal, dpi300 (dpi300 only for Zpl)
        organization_id: str = None,
        request_id: str = None
    ) -> bytes:
        """
        Download shipping label.
        
        Args:
            shipment_id: InPost shipment ID
            format: Label format (Pdf, Zpl, Epl)
            type: Label type (A6, normal, dpi300)
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Label binary data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        params = {
            "format": format,
            "type": type
        }
        
        url = f"{self.base_url}/organizations/{org_id}/shipments/{shipment_id}/label"
        headers = self._get_headers(request_id)
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            
            if not response.ok:
                self._handle_error(response)
            
            return response.content
            
        except requests.exceptions.RequestException as e:
            raise InPostAPIError(
                message=f"Network error: {str(e)}",
                status_code=None
            )
    
    def get_multiple_labels(
        self,
        shipment_ids: List[int],
        format: str = "pdf",
        type: str = "A6",
        organization_id: str = None,
        request_id: str = None
    ) -> bytes:
        """
        Download multiple shipment labels in one file.
        
        Args:
            shipment_ids: List of shipment IDs
            format: Label format (pdf, zpl, epl)
            type: Label type (A6, normal, dpi300)
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Combined labels binary data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        payload = {
            "type": type,
            "format": format,
            "shipment_ids": shipment_ids
        }
        
        return self._make_request(
            "POST",
            f"/organizations/{org_id}/shipments/labels",
            json_data=payload,
            request_id=request_id,
            binary_response=True
        )
    
    def get_return_labels(
        self,
        shipment_ids: List[int],
        format: str = "Pdf",
        organization_id: str = None,
        request_id: str = None
    ) -> bytes:
        """
        Download return labels for shipments.
        
        Args:
            shipment_ids: List of shipment IDs
            format: Label format (Pdf, Zpl, Epl)
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Return labels binary data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        params = {
            "format": format
        }
        
        # Add shipment_ids as array params
        for sid in shipment_ids:
            params[f"shipment_ids[]"] = sid
        
        url = f"{self.base_url}/organizations/{org_id}/shipments/return_labels"
        headers = self._get_headers(request_id)
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            
            if not response.ok:
                self._handle_error(response)
            
            return response.content
            
        except requests.exceptions.RequestException as e:
            raise InPostAPIError(
                message=f"Network error: {str(e)}",
                status_code=None
            )
    
    # ==================== Tracking ====================
    
    def get_tracking(self, tracking_number: str, request_id: str = None) -> Dict[str, Any]:
        """
        Get shipment tracking information.
        
        Args:
            tracking_number: InPost tracking number
            request_id: Optional request ID for debugging
            
        Returns:
            Tracking data with status and events
        """
        data = self._make_request("GET", f"/tracking/{tracking_number}", request_id=request_id)
        
        return {
            "tracking_number": tracking_number,
            "status": data.get("status"),
            "events": data.get("tracking_details", []),
            "expected_delivery": data.get("expected_delivery_date"),
            "delivered_at": data.get("delivered_at"),
            "href": data.get("href")
        }
    
    # ==================== Dispatch Orders ====================
    
    def create_dispatch_order(
        self,
        shipments: List[str],  # List of shipment IDs
        name: str,
        phone: str,
        email: str,
        address: Dict[str, Any],
        comment: str = None,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create a dispatch order (pickup order).
        
        Args:
            shipments: List of shipment IDs to include
            name: Dispatch point name
            phone: Contact phone
            email: Contact email
            address: Address dict with street, building_number, city, post_code, country_code
            comment: Optional comment
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Dispatch order data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        payload = {
            "shipments": shipments,
            "name": name,
            "phone": phone,
            "email": email,
            "address": address
        }
        
        if comment:
            payload["comment"] = comment
        
        return self._make_request(
            "POST",
            f"/organizations/{org_id}/dispatch_orders",
            json_data=payload,
            request_id=request_id
        )
    
    def get_dispatch_orders(
        self,
        organization_id: str = None,
        id: str = None,
        created_at: str = None,
        created_at_gteq: str = None,
        created_at_lteq: str = None,
        status: str = None,
        address: str = None,
        post_code: str = None,
        country_code: str = None,
        city: str = None,
        shipment_id: str = None,
        tracking_number: str = None,
        shipment_service: str = None,
        page: int = 1,
        per_page: int = 100,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get list of dispatch orders with filtering.
        
        Args:
            organization_id: Organization ID (uses instance default if not provided)
            id: Filter by dispatch order ID
            created_at: Filter by creation date
            created_at_gteq: Filter created >= date
            created_at_lteq: Filter created <= date
            status: Filter by status (new, sent, accepted, done, rejected, canceled)
            address: Filter by address (starts with)
            post_code: Filter by postal code (starts with)
            country_code: Filter by country code
            city: Filter by city
            shipment_id: Filter by shipment ID
            tracking_number: Filter by tracking number
            shipment_service: Filter by service (courier, locker, allegro)
            page: Page number
            per_page: Items per page
            request_id: Optional request ID for debugging
            
        Returns:
            Collection response with dispatch orders
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        params = {
            "page": page,
            "per_page": per_page
        }
        
        if id:
            params["id"] = id
        if created_at:
            params["created_at"] = created_at
        if created_at_gteq:
            params["created_at_gteq"] = created_at_gteq
        if created_at_lteq:
            params["created_at_lteq"] = created_at_lteq
        if status:
            params["status"] = status
        if address:
            params["address"] = address
        if post_code:
            params["post_code"] = post_code
        if country_code:
            params["country_code"] = country_code
        if city:
            params["city"] = city
        if shipment_id:
            params["shipment_id"] = shipment_id
        if tracking_number:
            params["tracking_number"] = tracking_number
        if shipment_service:
            params["shipment_service"] = shipment_service
        
        return self._make_request(
            "GET",
            f"/organizations/{org_id}/dispatch_orders",
            params=params,
            request_id=request_id
        )
    
    def get_dispatch_order(self, dispatch_order_id: str, request_id: str = None) -> Dict[str, Any]:
        """
        Get dispatch order details.
        
        Args:
            dispatch_order_id: Dispatch order ID
            request_id: Optional request ID for debugging
            
        Returns:
            Dispatch order details
        """
        return self._make_request("GET", f"/dispatch_orders/{dispatch_order_id}", request_id=request_id)
    
    def get_dispatch_order_printout(
        self,
        dispatch_order_id: str,
        format: str = "Pdf",
        request_id: str = None
    ) -> bytes:
        """
        Download dispatch order printout.
        
        Args:
            dispatch_order_id: Dispatch order ID
            format: Printout format (Pdf)
            request_id: Optional request ID for debugging
            
        Returns:
            Printout binary data
        """
        params = {"format": format}
        
        url = f"{self.base_url}/dispatch_orders/{dispatch_order_id}/printout"
        headers = self._get_headers(request_id)
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            
            if not response.ok:
                self._handle_error(response)
            
            return response.content
            
        except requests.exceptions.RequestException as e:
            raise InPostAPIError(
                message=f"Network error: {str(e)}",
                status_code=None
            )
    
    def get_dispatch_order_printouts(
        self,
        shipment_ids: List[int],
        format: str = "Pdf",
        organization_id: str = None,
        request_id: str = None
    ) -> bytes:
        """
        Download multiple dispatch order printouts.
        
        Args:
            shipment_ids: List of shipment IDs
            format: Printout format (Pdf)
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Combined printouts binary data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        params = {"format": format}
        
        for sid in shipment_ids:
            params[f"shipment_ids[]"] = sid
        
        url = f"{self.base_url}/organizations/{org_id}/dispatch_orders/printouts"
        headers = self._get_headers(request_id)
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            
            if not response.ok:
                self._handle_error(response)
            
            return response.content
            
        except requests.exceptions.RequestException as e:
            raise InPostAPIError(
                message=f"Network error: {str(e)}",
                status_code=None
            )
    
    def calculate_dispatch_order_price(
        self,
        dispatch_point_id: int,
        shipments: List[int],
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Calculate dispatch order price.
        
        Args:
            dispatch_point_id: Dispatch point ID
            shipments: List of shipment IDs
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Price calculation result
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        payload = {
            "dispatch_point_id": dispatch_point_id,
            "shipments": shipments
        }
        
        return self._make_request(
            "POST",
            f"/organizations/{org_id}/dispatch_orders/calculate",
            json_data=payload,
            request_id=request_id
        )
    
    def delete_dispatch_order(self, dispatch_order_id: str, request_id: str = None) -> Dict[str, Any]:
        """
        Delete a dispatch order.
        
        Args:
            dispatch_order_id: Dispatch order ID
            request_id: Optional request ID for debugging
            
        Returns:
            Deletion result
        """
        return self._make_request("DELETE", f"/dispatch_orders/{dispatch_order_id}", request_id=request_id)
    
    def create_dispatch_order_comment(
        self,
        dispatch_order_id: str,
        comment: str,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create a comment on dispatch order.
        
        Args:
            dispatch_order_id: Dispatch order ID
            comment: Comment text
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Comment creation result
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "POST",
            f"/organizations/{org_id}/dispatch_orders/{dispatch_order_id}/comment",
            json_data={"comment": comment},
            request_id=request_id
        )
    
    def update_dispatch_order_comment(
        self,
        dispatch_order_id: str,
        comment_id: int,
        comment: str,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Update a dispatch order comment.
        
        Args:
            dispatch_order_id: Dispatch order ID
            comment_id: Comment ID
            comment: Updated comment text
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Update result
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "PUT",
            f"/organizations/{org_id}/dispatch_orders/{dispatch_order_id}/comment",
            json_data={"id": comment_id, "comment": comment},
            request_id=request_id
        )
    
    def delete_dispatch_order_comment(
        self,
        dispatch_order_id: str,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Delete a dispatch order comment.
        
        Args:
            dispatch_order_id: Dispatch order ID
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Deletion result
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "DELETE",
            f"/organizations/{org_id}/dispatch_orders/{dispatch_order_id}/comment",
            request_id=request_id
        )
    
    # ==================== Services & Statuses ====================
    
    def get_services(self, request_id: str = None) -> Dict[str, Any]:
        """
        Get list of available services.
        
        Args:
            request_id: Optional request ID for debugging
            
        Returns:
            List of services
        """
        return self._make_request("GET", "/services", request_id=request_id)
    
    def get_statuses(
        self,
        shipment_type: str = None,
        lang: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get list of shipment statuses.
        
        Args:
            shipment_type: Filter by service type (e.g., "inpost_locker_standard")
            lang: Language (en_GB, pl_PL)
            request_id: Optional request ID for debugging
            
        Returns:
            List of statuses
        """
        params = {}
        if shipment_type:
            params["shipment_type"] = shipment_type
        if lang:
            params["lang"] = lang
        
        return self._make_request("GET", "/statuses", params=params, request_id=request_id)
    
    def get_sending_methods(self, request_id: str = None) -> Dict[str, Any]:
        """
        Get list of sending methods.
        
        Args:
            request_id: Optional request ID for debugging
            
        Returns:
            List of sending methods
        """
        return self._make_request("GET", "/sending_methods", request_id=request_id)
    
    # ==================== Reports ====================
    
    def get_cod_report(
        self,
        start_date: str,  # YYYY-MM-DD
        end_date: str,  # YYYY-MM-DD
        format: str = "csv",
        organization_id: str = None,
        request_id: str = None
    ) -> bytes:
        """
        Get COD (Cash on Delivery) report.
        
        Args:
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            format: Report format (csv)
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Report binary data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        params = {
            "format": format,
            "start_date": start_date,
            "end_date": end_date
        }
        
        url = f"{self.base_url}/organizations/{org_id}/reports/cod"
        headers = self._get_headers(request_id)
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            
            if not response.ok:
                self._handle_error(response)
            
            return response.content
            
        except requests.exceptions.RequestException as e:
            raise InPostAPIError(
                message=f"Network error: {str(e)}",
                status_code=None
            )
    
    # ==================== MPK (Place of cost creation) ====================
    
    def get_mpks(
        self,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get list of MPKs (Places of cost creation).
        
        Args:
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            List of MPKs
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        return self._make_request(
            "GET",
            f"/organizations/{org_id}/mpks",
            request_id=request_id
        )
    
    def get_mpk(self, mpk_id: str, request_id: str = None) -> Dict[str, Any]:
        """
        Get MPK details.
        
        Args:
            mpk_id: MPK ID
            request_id: Optional request ID for debugging
            
        Returns:
            MPK details
        """
        return self._make_request("GET", f"/mpks/{mpk_id}", request_id=request_id)
    
    def create_mpk(
        self,
        name: str,
        description: str = None,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create an MPK.
        
        Args:
            name: MPK name
            description: MPK description
            organization_id: Organization ID (uses instance default if not provided)
            request_id: Optional request ID for debugging
            
        Returns:
            Created MPK data
        """
        org_id = organization_id or self.get_organization_id()
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        payload = {"name": name}
        if description:
            payload["description"] = description
        
        return self._make_request(
            "POST",
            f"/organizations/{org_id}/mpks",
            json_data=payload,
            request_id=request_id
        )
    
    def update_mpk(
        self,
        mpk_id: str,
        name: str,
        description: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Update an MPK.
        
        Args:
            mpk_id: MPK ID
            name: MPK name
            description: MPK description
            request_id: Optional request ID for debugging
            
        Returns:
            Updated MPK data
        """
        payload = {"name": name}
        if description:
            payload["description"] = description
        
        return self._make_request(
            "PUT",
            f"/mpks/{mpk_id}",
            json_data=payload,
            request_id=request_id
        )
    
    # ==================== Pickup Orders (Global API v2) ====================
    
    def create_pickup_order(
        self,
        address: Dict[str, Any],
        contact_person: Dict[str, Any],
        pickup_time: Dict[str, Any],
        volume: Dict[str, Any],
        organization_id: str = None,
        references: Dict[str, Any] = None,
        tracking_numbers: List[str] = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create a one-time pickup order.
        
        Args:
            address: Pickup address with countryCode, city, postalCode, street, houseNumber, etc.
            contact_person: Contact person details with firstName, lastName, email, phone
            pickup_time: Pickup time window with 'from' and 'to' ISO datetime strings
            volume: Volume information with itemType (PARCEL or RECYCLABLE_PACKAGING), count, totalWeight/totalVolume
            organization_id: Organization ID
            references: Optional custom references
            tracking_numbers: Optional list of tracking numbers
            request_id: Optional request ID
            
        Returns:
            Pickup order data with id, carrierReference, createdTime, etc.
        """
        if not self.use_global_api:
            raise InPostAPIError("Pickup orders are only available in Global API v2")
        
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        payload = {
            "address": address,
            "contactPerson": contact_person,
            "pickupTime": pickup_time,
            "volume": volume
        }
        
        if references:
            payload["references"] = references
        
        if tracking_numbers:
            payload["trackingNumbers"] = tracking_numbers
        
        headers = self._get_headers(request_id)
        
        response = requests.post(
            f"{self.base_url}/pickups/v1/organizations/{org_id}/one-time-pickups",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code not in [200, 201]:
            self._handle_error(response)
        
        return response.json()
    
    def get_pickup_orders(
        self,
        organization_id: str = None,
        page: int = 0,
        size: int = 20,
        sort: List[str] = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get paginated list of pickup orders.
        
        Args:
            organization_id: Organization ID
            page: Zero-based page index
            size: Page size (default: 20)
            sort: Sorting criteria in format ["property,asc", "property,desc"]
            request_id: Optional request ID
            
        Returns:
            Paginated pickup orders list
        """
        if not self.use_global_api:
            raise InPostAPIError("Pickup orders are only available in Global API v2")
        
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        params = {
            "page": page,
            "size": size
        }
        
        if sort:
            params["sort"] = sort
        
        headers = self._get_headers(request_id)
        
        response = requests.get(
            f"{self.base_url}/pickups/v1/organizations/{org_id}/one-time-pickups",
            headers=headers,
            params=params,
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
        
        return response.json()
    
    def get_pickup_order(
        self,
        order_id: str,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get pickup order details by ID.
        
        Args:
            order_id: Pickup order ID
            organization_id: Organization ID
            request_id: Optional request ID
            
        Returns:
            Pickup order details
        """
        if not self.use_global_api:
            raise InPostAPIError("Pickup orders are only available in Global API v2")
        
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        headers = self._get_headers(request_id)
        
        response = requests.get(
            f"{self.base_url}/pickups/v1/organizations/{org_id}/one-time-pickups/{order_id}",
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
        
        return response.json()
    
    def cancel_pickup_order(
        self,
        order_id: str,
        organization_id: str = None,
        request_id: str = None
    ) -> None:
        """
        Cancel a pickup order.
        
        Args:
            order_id: Pickup order ID
            organization_id: Organization ID
            request_id: Optional request ID
        """
        if not self.use_global_api:
            raise InPostAPIError("Pickup orders are only available in Global API v2")
        
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        headers = self._get_headers(request_id)
        
        response = requests.put(
            f"{self.base_url}/pickups/v1/organizations/{org_id}/one-time-pickups/{order_id}/cancel",
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
    
    def get_pickup_cutoff_time(
        self,
        postal_code: str,
        country_code: str,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get cutoff time for pickup order creation for given postal code.
        
        Args:
            postal_code: Postal code in country specific format
            country_code: ISO 3166-1 alpha-2 country code
            request_id: Optional request ID
            
        Returns:
            Cutoff time information
        """
        if not self.use_global_api:
            raise InPostAPIError("Pickup orders are only available in Global API v2")
        
        params = {
            "postalCode": postal_code,
            "countryCode": country_code
        }
        
        headers = self._get_headers(request_id)
        
        response = requests.get(
            f"{self.base_url}/pickups/v1/cutoff-time",
            headers=headers,
            params=params,
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
        
        return response.json() if response.content else {}
    
    # ==================== Return Shipments (Global API v2) ====================
    
    def create_return_shipment(
        self,
        sender: Dict[str, Any],
        organization_id: str = None,
        recipient: Dict[str, Any] = None,
        origin: Dict[str, Any] = None,
        destination: Dict[str, Any] = None,
        references: Dict[str, Any] = None,
        enable_drop_off_code: bool = True,
        parcels: List[Dict[str, Any]] = None,
        expiration_date: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Create a return shipment.
        
        Args:
            sender: Sender information (required) with firstName, lastName, email, phone, companyName
            organization_id: Organization ID
            recipient: Recipient information (optional)
            origin: Origin information with countryCode (required for GB, optional for others)
            destination: Destination address (optional)
            references: Custom references like clientId, orderNumber (optional)
            enable_drop_off_code: Enable drop-off code (default: True)
            parcels: List of parcel details (optional, defaults to organization settings)
            expiration_date: Expiration date in ISO format (optional, min 24h from now)
            request_id: Optional request ID
            
        Returns:
            Return shipment data with id, expirationDate, parcels with trackingNumber and dropOffCode
        """
        if not self.use_global_api:
            raise InPostAPIError("Return shipments are only available in Global API v2")
        
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        if not sender:
            raise InPostAPIError("Sender information is required")
        
        payload = {
            "sender": sender,
            "enableDropOffCode": enable_drop_off_code
        }
        
        if recipient:
            payload["recipient"] = recipient
        
        if origin:
            payload["origin"] = origin
        
        if destination:
            payload["destination"] = destination
        
        if references:
            payload["references"] = references
        
        if parcels:
            if len(parcels) != 1:
                raise InPostAPIError("Parcels list must contain exactly 1 parcel")
            payload["parcels"] = parcels
        
        if expiration_date:
            payload["expirationDate"] = expiration_date
        
        headers = self._get_headers(request_id)
        
        response = requests.post(
            f"{self.base_url}/returns/v1/organizations/{org_id}/shipments",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code not in [200, 201]:
            self._handle_error(response)
        
        return response.json()
    
    def get_return_shipment(
        self,
        shipment_id: str,
        organization_id: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Get return shipment information by ID.
        
        Args:
            shipment_id: Return shipment ID
            organization_id: Organization ID
            request_id: Optional request ID
            
        Returns:
            Return shipment details with id, expirationDate, parcels, etc.
        """
        if not self.use_global_api:
            raise InPostAPIError("Return shipments are only available in Global API v2")
        
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        headers = self._get_headers(request_id)
        
        response = requests.get(
            f"{self.base_url}/returns/v1/organizations/{org_id}/shipments/{shipment_id}",
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
        
        return response.json()
    
    def get_return_shipment_label(
        self,
        tracking_number: str,
        organization_id: str = None,
        label_format: str = "application/pdf;format=A4",
        request_id: str = None
    ) -> bytes:
        """
        Get label for return shipment parcel.
        
        Args:
            tracking_number: Parcel tracking number
            organization_id: Organization ID
            label_format: Label format (default: application/pdf;format=A4)
            request_id: Optional request ID
            
        Returns:
            Label file content as bytes
        """
        if not self.use_global_api:
            raise InPostAPIError("Return shipments are only available in Global API v2")
        
        org_id = organization_id or self.organization_id
        if not org_id:
            raise InPostAPIError("Organization ID is required")
        
        headers = self._get_headers(request_id)
        headers["Accept"] = label_format
        
        response = requests.get(
            f"{self.base_url}/returns/v1/organizations/{org_id}/shipments/{tracking_number}/label",
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
        
        return response.content
    
    # ==================== Tracking (Global API v2) ====================
    
    def get_tracking_history(
        self,
        tracking_numbers: List[str],
        event_version: str = None,
        request_id: str = None
    ) -> Dict[str, Any]:
        """
        Retrieve parcel tracking event history using tracking numbers.
        
        Args:
            tracking_numbers: List of tracking numbers (max 10 per request)
            event_version: Optional event version (e.g., "V1"). If empty, latest version is used
            request_id: Optional request ID
            
        Returns:
            Tracking history with events, origin, destination, delivery info for each parcel
        """
        if not self.use_global_api:
            raise InPostAPIError("Tracking API is only available in Global API v2")
        
        if not tracking_numbers:
            raise InPostAPIError("At least one tracking number is required")
        
        if len(tracking_numbers) > 10:
            raise InPostAPIError("Maximum 10 tracking numbers per request")
        
        from urllib.parse import urlencode
        
        params_list = [("trackingNumbers", tn) for tn in tracking_numbers]
        query_string = urlencode(params_list)
        
        headers = self._get_headers(request_id)
        
        if event_version:
            headers["x-inpost-event-version"] = event_version
        
        url = f"{self.base_url}/tracking/v1/parcels?{query_string}"
        
        response = requests.get(
            url,
            headers=headers,
            timeout=30
        )
        
        if response.status_code != 200:
            self._handle_error(response)
        
        return response.json()

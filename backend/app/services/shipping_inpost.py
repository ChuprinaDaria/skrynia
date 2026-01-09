import requests
from typing import Dict, Any, List, Optional
from app.core.config import settings


class InPostService:
    """
    InPost Paczkomaty integration for Poland.
    https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/overview
    """

    API_URL = "https://api-shipx-pl.easypack24.net/v1"
    SANDBOX_URL = "https://sandbox-api-shipx-pl.easypack24.net/v1"

    def __init__(self, api_token: str = None, sandbox: bool = True):
        self.api_token = api_token or getattr(settings, "INPOST_API_TOKEN", "")
        self.base_url = self.SANDBOX_URL if sandbox else self.API_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

    def get_paczkomats(self, city: str = None, postcode: str = None) -> List[Dict[str, Any]]:
        """
        Get list of InPost Paczkomat lockers.

        Args:
            city: City name
            postcode: Postal code

        Returns:
            List of available paczkomats
        """
        try:
            params = {}
            if city:
                params["city"] = city
            if postcode:
                params["post_code"] = postcode

            response = requests.get(
                f"{self.base_url}/points",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()

            data = response.json()
            return data.get("items", [])

        except requests.exceptions.RequestException as e:
            raise Exception(f"InPost API error: {str(e)}")

    def create_shipment(
        self,
        receiver_email: str,
        receiver_phone: str,
        receiver_name: str,
        paczkomat_id: str,
        parcel_size: str = "small",  # small, medium, large
        reference: str = None
    ) -> Dict[str, Any]:
        """
        Create InPost shipment to Paczkomat.

        Args:
            receiver_email: Customer email
            receiver_phone: Customer phone
            receiver_name: Customer name
            paczkomat_id: Target paczkomat code (e.g., "KRA010")
            parcel_size: Parcel size
            reference: Your internal order reference

        Returns:
            Shipment data with tracking number
        """
        try:
            payload = {
                "receiver": {
                    "email": receiver_email,
                    "phone": receiver_phone,
                    "name": receiver_name
                },
                "parcels": [
                    {
                        "template": parcel_size,
                        "dimensions": {
                            "length": "380",
                            "width": "380",
                            "height": "640",
                            "unit": "mm"
                        },
                        "weight": {
                            "amount": "5.00",
                            "unit": "kg"
                        }
                    }
                ],
                "custom_attributes": {
                    "target_point": paczkomat_id
                },
                "service": "inpost_locker_standard",
                "reference": reference or ""
            }

            response = requests.post(
                f"{self.base_url}/organizations/{self.get_organization_id()}/shipments",
                headers=self.headers,
                json=payload
            )
            response.raise_for_status()

            data = response.json()

            return {
                "shipment_id": data.get("id"),
                "tracking_number": data.get("tracking_number"),
                "status": data.get("status"),
                "target_point": paczkomat_id,
                "label_url": data.get("label", {}).get("url")
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"InPost shipment creation error: {str(e)}")

    def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """
        Get shipment tracking information.

        Args:
            tracking_number: InPost tracking number

        Returns:
            Tracking data with status and events
        """
        try:
            response = requests.get(
                f"{self.base_url}/tracking/{tracking_number}",
                headers=self.headers
            )
            response.raise_for_status()

            data = response.json()

            return {
                "tracking_number": tracking_number,
                "status": data.get("status"),
                "events": data.get("tracking_details", []),
                "expected_delivery": data.get("expected_delivery_date"),
                "delivered_at": data.get("delivered_at")
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"InPost tracking error: {str(e)}")

    def get_organization_id(self) -> str:
        """Get organization ID from API (cached in production)."""
        # In real implementation, this should be cached or from settings
        return getattr(settings, "INPOST_ORGANIZATION_ID", "")

    def get_label(self, shipment_id: str) -> bytes:
        """
        Download shipping label PDF.

        Args:
            shipment_id: InPost shipment ID

        Returns:
            PDF binary data
        """
        try:
            response = requests.get(
                f"{self.base_url}/shipments/{shipment_id}/label",
                headers=self.headers
            )
            response.raise_for_status()

            return response.content

        except requests.exceptions.RequestException as e:
            raise Exception(f"InPost label download error: {str(e)}")

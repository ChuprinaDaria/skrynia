import requests
from typing import Dict, Any, List
from app.core.config import settings


class NovaPoshtaService:
    """
    Nova Poshta API integration for Ukraine.
    https://developers.novaposhta.ua/documentation
    """

    API_URL = "https://api.novaposhta.ua/v2.0/json/"

    def __init__(self, api_key: str = None):
        self.api_key = api_key or getattr(settings, "NOVA_POSHTA_API_KEY", "")

    def _make_request(self, model_name: str, called_method: str, method_properties: Dict = None) -> Dict[str, Any]:
        """Make API request to Nova Poshta."""
        payload = {
            "apiKey": self.api_key,
            "modelName": model_name,
            "calledMethod": called_method,
            "methodProperties": method_properties or {}
        }

        try:
            response = requests.post(self.API_URL, json=payload)
            response.raise_for_status()

            data = response.json()

            if not data.get("success"):
                errors = data.get("errors", ["Unknown error"])
                raise Exception(f"Nova Poshta API error: {', '.join(errors)}")

            return data.get("data", [])

        except requests.exceptions.RequestException as e:
            raise Exception(f"Nova Poshta request error: {str(e)}")

    def get_cities(self, city_name: str) -> List[Dict[str, Any]]:
        """
        Search for cities in Ukraine.

        Args:
            city_name: City name in Ukrainian or Russian

        Returns:
            List of matching cities
        """
        result = self._make_request(
            model_name="Address",
            called_method="getCities",
            method_properties={"FindByString": city_name}
        )

        return result

    def get_warehouses(self, city_ref: str) -> List[Dict[str, Any]]:
        """
        Get Nova Poshta warehouses (відділення) in a city.

        Args:
            city_ref: City reference (UUID from get_cities)

        Returns:
            List of warehouses
        """
        result = self._make_request(
            model_name="AddressGeneral",
            called_method="getWarehouses",
            method_properties={"CityRef": city_ref}
        )

        return result

    def create_internet_document(
        self,
        recipient_name: str,
        recipient_phone: str,
        city_recipient: str,
        recipient_warehouse: str,
        description: str,
        weight: float,
        cost: float,
        seats_amount: int = 1,
        payer_type: str = "Recipient"  # Who pays: Sender or Recipient
    ) -> Dict[str, Any]:
        """
        Create delivery order (Internet Document).

        Args:
            recipient_name: Full name
            recipient_phone: Phone number (380XXXXXXXXX)
            city_recipient: City reference UUID
            recipient_warehouse: Warehouse reference UUID
            description: Package description
            weight: Weight in kg
            cost: Declared value in UAH
            seats_amount: Number of packages
            payer_type: Who pays for delivery

        Returns:
            Created document with TTN (tracking number)
        """
        result = self._make_request(
            model_name="InternetDocument",
            called_method="save",
            method_properties={
                "PayerType": payer_type,
                "PaymentMethod": "Cash",  # or "NonCash"
                "DateTime": "",  # Today's date (auto)
                "CargoType": "Parcel",
                "VolumeGeneral": "0.0004",  # m³
                "Weight": str(weight),
                "ServiceType": "WarehouseWarehouse",
                "SeatsAmount": str(seats_amount),
                "Description": description,
                "Cost": str(cost),
                "CitySender": getattr(settings, "NOVA_POSHTA_CITY_SENDER", ""),
                "SenderAddress": getattr(settings, "NOVA_POSHTA_WAREHOUSE_SENDER", ""),
                "Sender": getattr(settings, "NOVA_POSHTA_COUNTERPARTY_SENDER", ""),
                "ContactSender": getattr(settings, "NOVA_POSHTA_CONTACT_SENDER", ""),
                "SendersPhone": getattr(settings, "NOVA_POSHTA_PHONE_SENDER", ""),
                "CityRecipient": city_recipient,
                "RecipientAddress": recipient_warehouse,
                "RecipientName": recipient_name,
                "RecipientsPhone": recipient_phone,
            }
        )

        if result:
            return {
                "tracking_number": result[0].get("IntDocNumber"),
                "ref": result[0].get("Ref"),
                "cost_on_site": result[0].get("CostOnSite")
            }

        raise Exception("Failed to create Internet Document")

    def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """
        Track parcel by TTN number.

        Args:
            tracking_number: Tracking number (TTN)

        Returns:
            Tracking information with status
        """
        result = self._make_request(
            model_name="TrackingDocument",
            called_method="getStatusDocuments",
            method_properties={"Documents": [{"DocumentNumber": tracking_number}]}
        )

        if result:
            status_data = result[0]
            return {
                "tracking_number": tracking_number,
                "status": status_data.get("Status"),
                "status_code": status_data.get("StatusCode"),
                "city": status_data.get("CityRecipient"),
                "warehouse": status_data.get("WarehouseRecipient"),
                "scheduled_delivery": status_data.get("ScheduledDeliveryDate"),
                "actual_delivery": status_data.get("ActualDeliveryDate"),
                "recipient_date_time": status_data.get("RecipientDateTime")
            }

        raise Exception(f"Tracking not found for {tracking_number}")

    def calculate_cost(
        self,
        city_sender: str,
        city_recipient: str,
        weight: float,
        service_type: str = "WarehouseWarehouse"
    ) -> float:
        """
        Calculate shipping cost.

        Args:
            city_sender: Sender city reference
            city_recipient: Recipient city reference
            weight: Weight in kg
            service_type: Service type

        Returns:
            Shipping cost in UAH
        """
        result = self._make_request(
            model_name="InternetDocument",
            called_method="getDocumentPrice",
            method_properties={
                "CitySender": city_sender,
                "CityRecipient": city_recipient,
                "Weight": str(weight),
                "ServiceType": service_type,
                "Cost": "1000",  # Declared value
                "CargoType": "Parcel",
                "SeatsAmount": "1"
            }
        )

        if result:
            return float(result[0].get("Cost", 0))

        return 0.0

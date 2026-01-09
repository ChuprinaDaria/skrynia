import requests
from typing import Dict, Any, List
from datetime import datetime
from app.core.config import settings


class DHLService:
    """
    DHL Express API integration.
    https://developer.dhl.com/api-reference/dhl-express-mydhl-api
    """

    API_URL = "https://express.api.dhl.com"
    SANDBOX_URL = "https://express.api.dhl.com/mydhlapi/test"

    def __init__(self, api_key: str = None, api_secret: str = None, sandbox: bool = True):
        self.api_key = api_key or getattr(settings, "DHL_API_KEY", "")
        self.api_secret = api_secret or getattr(settings, "DHL_API_SECRET", "")
        self.base_url = self.SANDBOX_URL if sandbox else self.API_URL
        self.auth = (self.api_key, self.api_secret)

    def create_shipment(
        self,
        # Shipper (your info)
        shipper_name: str,
        shipper_company: str,
        shipper_address: str,
        shipper_city: str,
        shipper_postal_code: str,
        shipper_country: str,
        shipper_phone: str,
        shipper_email: str,
        # Recipient
        recipient_name: str,
        recipient_company: str,
        recipient_address: str,
        recipient_city: str,
        recipient_postal_code: str,
        recipient_country: str,
        recipient_phone: str,
        recipient_email: str,
        # Package
        weight: float,  # kg
        length: float = 30,  # cm
        width: float = 20,
        height: float = 10,
        declared_value: float = 100,
        currency: str = "PLN",
        # Service
        service_type: str = "P",  # P = DHL Express Worldwide
        reference: str = None
    ) -> Dict[str, Any]:
        """
        Create DHL shipment and get waybill.

        Returns:
            Shipment data with tracking number and label
        """
        try:
            payload = {
                "plannedShippingDateAndTime": datetime.now().strftime("%Y-%m-%dT%H:%M:%S GMT+01:00"),
                "pickup": {
                    "isRequested": False
                },
                "productCode": service_type,
                "accounts": [
                    {
                        "typeCode": "shipper",
                        "number": getattr(settings, "DHL_ACCOUNT_NUMBER", "")
                    }
                ],
                "customerDetails": {
                    "shipperDetails": {
                        "postalAddress": {
                            "postalCode": shipper_postal_code,
                            "cityName": shipper_city,
                            "countryCode": shipper_country,
                            "addressLine1": shipper_address
                        },
                        "contactInformation": {
                            "email": shipper_email,
                            "phone": shipper_phone,
                            "companyName": shipper_company,
                            "fullName": shipper_name
                        }
                    },
                    "receiverDetails": {
                        "postalAddress": {
                            "postalCode": recipient_postal_code,
                            "cityName": recipient_city,
                            "countryCode": recipient_country,
                            "addressLine1": recipient_address
                        },
                        "contactInformation": {
                            "email": recipient_email,
                            "phone": recipient_phone,
                            "companyName": recipient_company,
                            "fullName": recipient_name
                        }
                    }
                },
                "content": {
                    "packages": [
                        {
                            "weight": weight,
                            "dimensions": {
                                "length": length,
                                "width": width,
                                "height": height
                            }
                        }
                    ],
                    "isCustomsDeclarable": False,
                    "declaredValue": declared_value,
                    "declaredValueCurrency": currency,
                    "description": "Jewelry",
                    "incoterm": "DAP"
                },
                "documentImages": [
                    {
                        "typeCode": "label",
                        "imageFormat": "PDF"
                    }
                ]
            }

            if reference:
                payload["customerReferences"] = [{"value": reference, "typeCode": "CU"}]

            response = requests.post(
                f"{self.base_url}/shipments",
                json=payload,
                auth=self.auth,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()

            data = response.json()

            return {
                "tracking_number": data["shipmentTrackingNumber"],
                "packages": data.get("packages", []),
                "label_url": data.get("documents", [{}])[0].get("url"),
                "label_base64": data.get("documents", [{}])[0].get("content")
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"DHL API error: {str(e)}")

    def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """
        Track DHL shipment.

        Args:
            tracking_number: DHL tracking/waybill number

        Returns:
            Tracking information
        """
        try:
            response = requests.get(
                f"{self.base_url}/shipments/{tracking_number}/tracking",
                auth=self.auth
            )
            response.raise_for_status()

            data = response.json()
            shipment = data.get("shipments", [{}])[0]

            return {
                "tracking_number": tracking_number,
                "status": shipment.get("status", {}).get("statusCode"),
                "status_description": shipment.get("status", {}).get("description"),
                "origin": shipment.get("origin", {}).get("address", {}).get("addressLocality"),
                "destination": shipment.get("destination", {}).get("address", {}).get("addressLocality"),
                "events": shipment.get("events", []),
                "estimated_delivery": shipment.get("estimatedDeliveryDate")
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"DHL tracking error: {str(e)}")

    def get_rates(
        self,
        origin_country: str,
        origin_postal_code: str,
        destination_country: str,
        destination_postal_code: str,
        weight: float,
        dimensions: Dict[str, float] = None
    ) -> List[Dict[str, Any]]:
        """
        Get shipping rates for different service levels.

        Returns:
            List of available services with prices
        """
        try:
            payload = {
                "customerDetails": {
                    "shipperDetails": {
                        "postalCode": origin_postal_code,
                        "countryCode": origin_country
                    },
                    "receiverDetails": {
                        "postalCode": destination_postal_code,
                        "countryCode": destination_country
                    }
                },
                "accounts": [
                    {
                        "typeCode": "shipper",
                        "number": getattr(settings, "DHL_ACCOUNT_NUMBER", "")
                    }
                ],
                "plannedShippingDateAndTime": datetime.now().strftime("%Y-%m-%dT%H:%M:%S GMT+01:00"),
                "unitOfMeasurement": "metric",
                "packages": [
                    {
                        "weight": weight,
                        "dimensions": dimensions or {"length": 30, "width": 20, "height": 10}
                    }
                ]
            }

            response = requests.post(
                f"{self.base_url}/rates",
                json=payload,
                auth=self.auth
            )
            response.raise_for_status()

            data = response.json()
            products = data.get("products", [])

            return [
                {
                    "service_code": product.get("productCode"),
                    "service_name": product.get("productName"),
                    "total_price": product.get("totalPrice", [{}])[0].get("price"),
                    "currency": product.get("totalPrice", [{}])[0].get("priceCurrency"),
                    "delivery_time": product.get("deliveryCapabilities", {}).get("deliveryTypeCode")
                }
                for product in products
            ]

        except requests.exceptions.RequestException as e:
            raise Exception(f"DHL rates error: {str(e)}")

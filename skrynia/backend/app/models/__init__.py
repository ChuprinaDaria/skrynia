# Import all models here for Alembic
from app.models.user import User
from app.models.user_address import UserAddress
from app.models.product import Product, ProductImage
from app.models.order import Order, OrderItem
from app.models.category import Category
from app.models.analytics import ProductView, DailySalesStats, ProductSalesStats
from app.models.shipping import Shipment
from app.models.made_to_order import MadeToOrderRequest
from app.models.social_link import SocialLink
from app.models.contact_info import ContactInfo
from app.models.about_page import AboutPage
from app.models.bead import Bead
from app.models.necklace import NecklaceConfiguration
from app.models.quote_request import QuoteRequest

__all__ = [
    "User",
    "UserAddress",
    "Product",
    "ProductImage",
    "Order",
    "OrderItem",
    "Category",
    "ProductView",
    "DailySalesStats",
    "ProductSalesStats",
    "Shipment",
    "MadeToOrderRequest",
    "SocialLink",
    "ContactInfo",
    "AboutPage",
    "Bead",
    "NecklaceConfiguration",
    "QuoteRequest",
]


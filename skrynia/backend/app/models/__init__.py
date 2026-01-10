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
from app.models.blog import Blog

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
    "Blog",
]


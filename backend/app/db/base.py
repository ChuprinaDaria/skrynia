from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here for Alembic
from app.models.user import User
from app.models.product import Product, ProductImage
from app.models.order import Order, OrderItem
from app.models.category import Category
from app.models.analytics import ProductView, DailySalesStats, ProductSalesStats
from app.models.shipping import Shipment

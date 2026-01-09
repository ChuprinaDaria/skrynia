from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Date
from sqlalchemy.sql import func
from app.db.base import Base


class ProductView(Base):
    """Track product page views for analytics."""
    __tablename__ = "product_views"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)

    # User info (optional, for tracking)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    referrer = Column(String, nullable=True)

    # Location (if available)
    country = Column(String, nullable=True)
    city = Column(String, nullable=True)

    viewed_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class DailySalesStats(Base):
    """Aggregated daily sales statistics."""
    __tablename__ = "daily_sales_stats"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, unique=True, index=True)

    # Sales metrics
    total_orders = Column(Integer, default=0)
    total_revenue = Column(Float, default=0.0)
    total_items_sold = Column(Integer, default=0)

    # Order status breakdown
    pending_orders = Column(Integer, default=0)
    paid_orders = Column(Integer, default=0)
    shipped_orders = Column(Integer, default=0)
    delivered_orders = Column(Integer, default=0)
    cancelled_orders = Column(Integer, default=0)

    # Payment methods
    stripe_revenue = Column(Float, default=0.0)
    p24_revenue = Column(Float, default=0.0)
    blik_revenue = Column(Float, default=0.0)

    # Average order value
    avg_order_value = Column(Float, default=0.0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ProductSalesStats(Base):
    """Product-specific sales statistics."""
    __tablename__ = "product_sales_stats"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)

    # Lifetime metrics
    total_views = Column(Integer, default=0)
    total_sold = Column(Integer, default=0)
    total_revenue = Column(Float, default=0.0)

    # Conversion
    conversion_rate = Column(Float, default=0.0)  # sold / views

    # Last activity
    last_view_at = Column(DateTime(timezone=True), nullable=True)
    last_sale_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

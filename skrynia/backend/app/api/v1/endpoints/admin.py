from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case
from datetime import datetime, timedelta, date
from typing import List, Dict, Any, Optional

from app.db.session import get_db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod
from app.models.analytics import ProductView, DailySalesStats, ProductSalesStats
from app.models.category import Category
from app.core.security import get_current_admin_user
from pydantic import BaseModel

router = APIRouter()


class DashboardStats(BaseModel):
    """Overall dashboard statistics."""
    total_revenue: float
    total_orders: int
    total_products: int
    total_customers: int
    pending_orders: int
    recent_orders: List[Dict[str, Any]]
    top_products: List[Dict[str, Any]]
    revenue_by_payment_method: Dict[str, float]
    orders_by_status: Dict[str, int]


class SalesChartData(BaseModel):
    """Sales chart data for graphs."""
    labels: List[str]
    revenue: List[float]
    orders: List[int]


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get comprehensive dashboard statistics.

    Args:
        days: Number of days to include in statistics (default 30)
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    # Total revenue
    total_revenue = db.query(func.sum(Order.total)).filter(
        Order.payment_status == PaymentStatus.COMPLETED
    ).scalar() or 0.0

    # Total orders
    total_orders = db.query(func.count(Order.id)).scalar() or 0

    # Total products
    total_products = db.query(func.count(Product.id)).filter(
        Product.is_active == True
    ).scalar() or 0

    # Total customers (unique emails from orders)
    total_customers = db.query(func.count(func.distinct(Order.customer_email))).scalar() or 0

    # Pending orders
    pending_orders = db.query(func.count(Order.id)).filter(
        Order.status == OrderStatus.PENDING
    ).scalar() or 0

    # Recent orders (last 10)
    recent_orders_query = db.query(Order).order_by(
        Order.created_at.desc()
    ).limit(10).all()

    recent_orders = [
        {
            "id": order.id,
            "order_number": order.order_number,
            "customer_name": order.customer_name,
            "total": order.total,
            "status": order.status.value,
            "created_at": order.created_at.isoformat()
        }
        for order in recent_orders_query
    ]

    # Top products by sales
    top_products_query = db.query(
        Product.id,
        Product.title_uk,
        func.sum(OrderItem.quantity).label("total_sold"),
        func.sum(OrderItem.subtotal).label("total_revenue")
    ).join(OrderItem).join(Order).filter(
        Order.payment_status == PaymentStatus.COMPLETED,
        Order.created_at >= cutoff_date
    ).group_by(Product.id, Product.title_uk).order_by(
        func.sum(OrderItem.subtotal).desc()
    ).limit(5).all()

    top_products = [
        {
            "product_id": p.id,
            "title": p.title_uk,
            "sold": p.total_sold,
            "revenue": p.total_revenue
        }
        for p in top_products_query
    ]

    # Revenue by payment method
    revenue_by_payment = db.query(
        Order.payment_method,
        func.sum(Order.total).label("revenue")
    ).filter(
        Order.payment_status == PaymentStatus.COMPLETED,
        Order.created_at >= cutoff_date
    ).group_by(Order.payment_method).all()

    revenue_by_payment_method = {
        pm.value: float(rev) for pm, rev in revenue_by_payment
    }

    # Orders by status
    orders_by_status_query = db.query(
        Order.status,
        func.count(Order.id).label("count")
    ).group_by(Order.status).all()

    orders_by_status = {
        status.value: count for status, count in orders_by_status_query
    }

    return DashboardStats(
        total_revenue=total_revenue,
        total_orders=total_orders,
        total_products=total_products,
        total_customers=total_customers,
        pending_orders=pending_orders,
        recent_orders=recent_orders,
        top_products=top_products,
        revenue_by_payment_method=revenue_by_payment_method,
        orders_by_status=orders_by_status
    )


@router.get("/sales-chart", response_model=SalesChartData)
def get_sales_chart(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Get sales chart data for the last N days.

    Returns daily revenue and order counts.
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    # Query daily stats
    daily_stats = db.query(
        func.date(Order.created_at).label("date"),
        func.sum(Order.total).label("revenue"),
        func.count(Order.id).label("orders")
    ).filter(
        Order.created_at >= cutoff_date,
        Order.payment_status == PaymentStatus.COMPLETED
    ).group_by(
        func.date(Order.created_at)
    ).order_by(
        func.date(Order.created_at)
    ).all()

    # Fill missing dates with zeros
    all_dates = []
    revenues = []
    order_counts = []

    current_date = cutoff_date.date()
    end_date = datetime.utcnow().date()

    stats_dict = {stat.date: stat for stat in daily_stats}

    while current_date <= end_date:
        all_dates.append(current_date.strftime("%Y-%m-%d"))

        if current_date in stats_dict:
            stat = stats_dict[current_date]
            revenues.append(float(stat.revenue or 0))
            order_counts.append(stat.orders or 0)
        else:
            revenues.append(0.0)
            order_counts.append(0)

        current_date += timedelta(days=1)

    return SalesChartData(
        labels=all_dates,
        revenue=revenues,
        orders=order_counts
    )


@router.get("/product-analytics/{product_id}")
def get_product_analytics(
    product_id: int,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get detailed analytics for a specific product."""
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    cutoff_date = datetime.utcnow() - timedelta(days=days)

    # Views
    total_views = db.query(func.count(ProductView.id)).filter(
        ProductView.product_id == product_id,
        ProductView.viewed_at >= cutoff_date
    ).scalar() or 0

    # Sales
    sales_data = db.query(
        func.sum(OrderItem.quantity).label("total_sold"),
        func.sum(OrderItem.subtotal).label("total_revenue")
    ).join(Order).filter(
        OrderItem.product_id == product_id,
        Order.payment_status == PaymentStatus.COMPLETED,
        Order.created_at >= cutoff_date
    ).first()

    total_sold = sales_data.total_sold or 0
    total_revenue = sales_data.total_revenue or 0.0

    # Conversion rate
    conversion_rate = (total_sold / total_views * 100) if total_views > 0 else 0

    # Views by date
    views_by_date = db.query(
        func.date(ProductView.viewed_at).label("date"),
        func.count(ProductView.id).label("views")
    ).filter(
        ProductView.product_id == product_id,
        ProductView.viewed_at >= cutoff_date
    ).group_by(
        func.date(ProductView.viewed_at)
    ).all()

    return {
        "product_id": product_id,
        "title": product.title_uk,
        "total_views": total_views,
        "total_sold": total_sold,
        "total_revenue": total_revenue,
        "conversion_rate": round(conversion_rate, 2),
        "current_stock": product.stock_quantity,
        "price": product.price,
        "views_chart": [
            {"date": v.date.strftime("%Y-%m-%d"), "views": v.views}
            for v in views_by_date
        ]
    }


@router.post("/track-view/{product_id}")
def track_product_view(
    product_id: int,
    user_agent: Optional[str] = None,
    ip_address: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Track a product view (public endpoint - no auth required).

    Call this from frontend when product page loads.
    """
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Create view record
    view = ProductView(
        product_id=product_id,
        user_agent=user_agent,
        ip_address=ip_address
    )
    db.add(view)

    # Update product stats
    stats = db.query(ProductSalesStats).filter(
        ProductSalesStats.product_id == product_id
    ).first()

    if not stats:
        stats = ProductSalesStats(product_id=product_id, total_views=1)
        db.add(stats)
    else:
        stats.total_views += 1
        stats.last_view_at = datetime.utcnow()

    db.commit()

    return {"status": "view tracked"}


@router.get("/export/sales")
def export_sales(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Export sales data (for CSV/Excel download).

    Returns all orders with details for the specified date range.
    """
    query = db.query(Order).filter(Order.payment_status == PaymentStatus.COMPLETED)

    if start_date:
        query = query.filter(Order.created_at >= start_date)
    if end_date:
        query = query.filter(Order.created_at <= end_date)

    orders = query.order_by(Order.created_at.desc()).all()

    export_data = []
    for order in orders:
        export_data.append({
            "order_number": order.order_number,
            "date": order.created_at.strftime("%Y-%m-%d"),
            "customer": order.customer_name,
            "email": order.customer_email,
            "total": order.total,
            "payment_method": order.payment_method.value,
            "status": order.status.value,
            "items": len(order.items)
        })

    return export_data

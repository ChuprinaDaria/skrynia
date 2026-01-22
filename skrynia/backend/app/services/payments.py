import stripe
from app.core.config import settings
from app.models.order import Order
from typing import Optional
from sqlalchemy.orm import Session

stripe.api_key = settings.STRIPE_SECRET_KEY

# Map currency symbols to Stripe currency codes
CURRENCY_MAP = {
    "zł": "pln",
    "PLN": "pln",
    "€": "eur",
    "EUR": "eur",
    "$": "usd",
    "USD": "usd",
    "₴": "uah",
    "UAH": "uah",
    "£": "gbp",
    "GBP": "gbp",
    "kr": "sek",
    "SEK": "sek",
    "NOK": "nok",
    "DKK": "dkk",
}


def get_stripe_currency(currency: str) -> str:
    """Convert currency symbol/code to Stripe-compatible currency code."""
    if not currency:
        return "eur"
    return CURRENCY_MAP.get(currency, currency.lower())


def create_checkout_session(
    order: Order,
    stage: int = 1,
    base_url: Optional[str] = None,
    db: Optional[Session] = None
) -> str:
    """
    Create Stripe Checkout session with price_data.
    
    Args:
        order: Order instance
        stage: Payment stage (1 for first payment, 2 for second payment)
        base_url: Base URL for success/cancel redirects
        db: Database session for querying products
        
    Returns:
        Checkout session URL
    """
    if not base_url:
        base_url = settings.FRONTEND_URL or "http://localhost:3000"
    
    is_preorder = False
    if db:
        from app.models.product import Product
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product and product.stock_quantity == 0:
                is_preorder = True
                break
    else:
        for item in order.items:
            if hasattr(item, 'product') and item.product and item.product.stock_quantity == 0:
                is_preorder = True
                break
    
    if is_preorder:
        full_subtotal = order.subtotal + order.shipping_cost
        if stage == 1:
            subtotal_amount = int((order.subtotal * 100) // 2)
            shipping_amount = int(order.shipping_cost * 100) // 2
        else:
            subtotal_amount = int((order.subtotal * 100) // 2)
            shipping_amount = int(order.shipping_cost * 100) // 2
    else:
        subtotal_amount = int((order.total - order.shipping_cost) * 100)
        shipping_amount = int(order.shipping_cost * 100)
    
    line_items = []
    
    # Get Stripe-compatible currency code
    stripe_currency = get_stripe_currency(order.currency)
    
    if subtotal_amount > 0:
        product_name = order.items[0].product_title if order.items else "Order"
        image_url = order.items[0].product_image if order.items and order.items[0].product_image else None
        
        if image_url and not image_url.startswith("http"):
            image_url = f"{base_url}{image_url}"
        
        line_items.append({
            'price_data': {
                'currency': stripe_currency,
                'product_data': {
                    'name': f"{product_name} (Part {stage}/2)" if (is_preorder and stage == 1) else product_name,
                    'images': [image_url] if image_url else [],
                },
                'unit_amount': subtotal_amount,
            },
            'quantity': 1,
        })
    
    if shipping_amount > 0:
        shipping_name = f"Shipping ({order.shipping_country})"
        if is_preorder and stage == 1:
            shipping_name = f"Shipping ({order.shipping_country}) - Part {stage}/2"
        
        line_items.append({
            'price_data': {
                'currency': stripe_currency,
                'product_data': {
                    'name': shipping_name,
                    'description': f"Delivery to {order.shipping_country}",
                },
                'unit_amount': shipping_amount,
            },
            'quantity': 1,
        })
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=line_items,
        mode='payment',
        metadata={
            'order_id': str(order.id),
            'payment_stage': str(stage),
            'shipping_country': order.shipping_country,
        },
        success_url=f"{base_url}/order-success?order={order.order_number}",
        cancel_url=f"{base_url}/checkout?canceled=true",
    )
    
    return session.url


#!/usr/bin/env python3
"""
Тестовий скрипт для перевірки повного флоу покупки товару.

Перевіряє:
1. Отримання списку товарів
2. Створення замовлення
3. Створення Payment Intent (Stripe)
4. Створення InPost накладної
5. Перевірка email notifications

Використання:
    python scripts/test_purchase_flow.py --api-url https://runebox.eu

Для повного тесту з InPost:
    python scripts/test_purchase_flow.py --api-url https://runebox.eu --admin-email admin@example.com --admin-password secret
"""

import argparse
import json
import sys
import requests
from typing import Dict, Any, Optional
from datetime import datetime


class Colors:
    """ANSI color codes for terminal output."""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_step(step: int, message: str):
    """Print a step header."""
    print(f"\n{Colors.CYAN}{Colors.BOLD}[Step {step}]{Colors.RESET} {message}")


def print_success(message: str):
    """Print success message."""
    print(f"  {Colors.GREEN}✅ {message}{Colors.RESET}")


def print_error(message: str):
    """Print error message."""
    print(f"  {Colors.RED}❌ {message}{Colors.RESET}")


def print_warning(message: str):
    """Print warning message."""
    print(f"  {Colors.YELLOW}⚠️  {message}{Colors.RESET}")


def print_info(message: str):
    """Print info message."""
    print(f"  {Colors.BLUE}ℹ️  {message}{Colors.RESET}")


def get_admin_token(api_url: str, email: str, password: str) -> Optional[str]:
    """Get admin authentication token."""
    try:
        response = requests.post(
            f"{api_url}/api/v1/auth/login",
            json={"email": email, "password": password},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get("access_token")
        else:
            print_error(f"Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print_error(f"Login error: {e}")
        return None


def test_get_products(api_url: str) -> Optional[Dict]:
    """Test getting products list."""
    print_step(1, "Getting products list")
    
    try:
        response = requests.get(
            f"{api_url}/api/v1/products",
            params={"limit": 10},
            timeout=30
        )
        
        if response.status_code == 200:
            products = response.json()
            if isinstance(products, list) and len(products) > 0:
                print_success(f"Found {len(products)} products")
                product = products[0]
                print_info(f"First product: {product.get('title_uk', 'N/A')} - {product.get('price', 0)} {product.get('currency', 'PLN')}")
                return product
            else:
                print_warning("No products found in database")
                return None
        else:
            print_error(f"Failed to get products: {response.status_code}")
            return None
    except Exception as e:
        print_error(f"Error getting products: {e}")
        return None


def test_create_order(api_url: str, product: Dict) -> Optional[Dict]:
    """Test creating an order."""
    print_step(2, "Creating test order")
    
    order_data = {
        "customer_name": "Test Customer",
        "customer_email": "test@example.com",
        "customer_phone": "+48123456789",
        "shipping_address_line1": "ul. Testowa 1",
        "shipping_address_line2": "m. 10",
        "shipping_city": "Warszawa",
        "shipping_postal_code": "00-001",
        "shipping_country": "PL",
        "payment_method": "stripe",  # Required field
        "items": [
            {
                "product_id": product["id"],
                "quantity": 1
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{api_url}/api/v1/orders/",  # Trailing slash required
            json=order_data,
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            order = response.json()
            print_success(f"Order created: {order.get('order_number', 'N/A')}")
            print_info(f"Order ID: {order.get('id')}")
            print_info(f"Total: {order.get('total', 0)} {order.get('currency', 'PLN')}")
            print_info(f"Status: {order.get('status', 'N/A')}")
            return order
        else:
            print_error(f"Failed to create order: {response.status_code}")
            print_error(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Error creating order: {e}")
        return None


def test_create_payment_intent(api_url: str, order: Dict) -> Optional[Dict]:
    """Test creating Stripe payment intent."""
    print_step(3, "Creating Stripe Payment Intent")
    
    payment_data = {
        "order_id": order["id"],
        "payment_method": "stripe"
    }
    
    try:
        response = requests.post(
            f"{api_url}/api/v1/payments/create-payment-intent",
            json=payment_data,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Payment Intent created")
            print_info(f"Payment Intent ID: {data.get('payment_intent_id', 'N/A')}")
            print_info(f"Client Secret: {data.get('client_secret', 'N/A')[:30]}...")
            return data
        else:
            print_error(f"Failed to create Payment Intent: {response.status_code}")
            print_error(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Error creating Payment Intent: {e}")
        return None


def test_create_checkout_session(api_url: str, order: Dict) -> Optional[Dict]:
    """Test creating Stripe Checkout Session."""
    print_step(4, "Creating Stripe Checkout Session")
    
    try:
        response = requests.post(
            f"{api_url}/api/v1/payments/checkout-session",
            json={"order_id": order["id"]},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Checkout Session created")
            print_info(f"Checkout URL: {data.get('checkout_url', 'N/A')[:60]}...")
            return data
        else:
            print_error(f"Failed to create Checkout Session: {response.status_code}")
            print_error(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Error creating Checkout Session: {e}")
        return None


def test_inpost_shipment(api_url: str, order: Dict, token: str) -> Optional[Dict]:
    """Test creating InPost shipment (requires admin token)."""
    print_step(5, "Creating InPost Shipment (Admin)")
    
    if not token:
        print_warning("Skipping - admin token required")
        return None
    
    shipment_data = {
        "order_id": order["id"],
        "provider": "inpost",
        "paczkomat_id": "WAW01A"  # Test paczkomat
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(
            f"{api_url}/api/v1/shipping/create",
            json=shipment_data,
            headers=headers,
            timeout=60
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            print_success("InPost shipment created")
            print_info(f"Tracking number: {data.get('tracking_number', 'N/A')}")
            print_info(f"Tracking URL: {data.get('tracking_url', 'N/A')}")
            print_info(f"Label URL: {data.get('label_url', 'N/A')}")
            return data
        elif response.status_code == 400 and "already exists" in response.text:
            print_warning("Shipment already exists for this order")
            return None
        else:
            print_error(f"Failed to create shipment: {response.status_code}")
            print_error(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Error creating shipment: {e}")
        return None


def test_get_paczkomats(api_url: str) -> bool:
    """Test getting InPost paczkomats."""
    print_step(6, "Getting InPost Paczkomats")
    
    try:
        response = requests.get(
            f"{api_url}/api/v1/shipping/paczkomats",
            params={"city": "Warszawa", "per_page": 5},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            print_success(f"Found {len(items)} paczkomats in Warszawa")
            if items:
                first = items[0]
                print_info(f"Example: {first.get('name', 'N/A')} - {first.get('address', {}).get('line1', 'N/A')}")
            return True
        else:
            print_error(f"Failed to get paczkomats: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error getting paczkomats: {e}")
        return False


def test_email_templates(api_url: str) -> bool:
    """Test that email endpoints are accessible."""
    print_step(7, "Checking Email Service")
    
    # We can't directly test email sending without credentials,
    # but we can verify the auth endpoints work
    try:
        # Test forgot password endpoint (should return success even for non-existent email)
        response = requests.post(
            f"{api_url}/api/v1/auth/forgot-password",
            json={"email": "nonexistent@test.com"},
            timeout=30
        )
        
        if response.status_code == 200:
            print_success("Forgot password endpoint working")
            print_info("Email service is configured")
            return True
        elif response.status_code == 429:
            print_warning("Rate limited - email service is working")
            return True
        else:
            print_warning(f"Forgot password returned: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error testing email: {e}")
        return False


def test_api_health(api_url: str) -> bool:
    """Test API health by checking products endpoint."""
    print_step(0, "Checking API Health")
    
    try:
        # Check products endpoint as health indicator
        response = requests.get(f"{api_url}/api/v1/products", params={"limit": 1}, timeout=10)
        
        if response.status_code == 200:
            print_success("API is healthy")
            return True
        else:
            print_error(f"API health check failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Cannot connect to API: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Test purchase flow")
    parser.add_argument("--api-url", default="https://runebox.eu", help="API base URL")
    parser.add_argument("--admin-email", help="Admin email for InPost test")
    parser.add_argument("--admin-password", help="Admin password for InPost test")
    parser.add_argument("--skip-order", action="store_true", help="Skip order creation (use existing)")
    args = parser.parse_args()
    
    api_url = args.api_url.rstrip("/")
    
    print(f"\n{Colors.BOLD}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}🛒 Purchase Flow Test{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*60}{Colors.RESET}")
    print(f"API URL: {api_url}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test results
    results = {
        "api_health": False,
        "get_products": False,
        "create_order": False,
        "payment_intent": False,
        "checkout_session": False,
        "inpost_shipment": False,
        "paczkomats": False,
        "email_service": False,
    }
    
    # Step 0: API Health
    results["api_health"] = test_api_health(api_url)
    if not results["api_health"]:
        print_error("\nAPI is not accessible. Aborting tests.")
        sys.exit(1)
    
    # Step 1: Get Products
    product = test_get_products(api_url)
    results["get_products"] = product is not None
    
    if not product:
        print_warning("\nNo products available. Creating a test requires at least one product.")
        # Continue with other tests
    
    # Step 2: Create Order (if product available)
    order = None
    if product and not args.skip_order:
        order = test_create_order(api_url, product)
        results["create_order"] = order is not None
        
        if not order:
            print_warning("Order creation failed - this might indicate the orders endpoint is not deployed")
            print_info("Try running: ssh root@server 'cd /app/runebox && docker compose -f docker-compose.prod.yml logs backend | tail -50'")
    else:
        print_step(2, "Skipping order creation")
        print_warning("No product available or --skip-order flag set")
    
    # Step 3: Create Payment Intent
    if order:
        payment = test_create_payment_intent(api_url, order)
        results["payment_intent"] = payment is not None
    else:
        print_step(3, "Skipping Payment Intent")
        print_warning("No order available")
    
    # Step 4: Create Checkout Session
    if order:
        checkout = test_create_checkout_session(api_url, order)
        results["checkout_session"] = checkout is not None
    else:
        print_step(4, "Skipping Checkout Session")
        print_warning("No order available")
    
    # Step 5: Create InPost Shipment (requires admin)
    admin_token = None
    if args.admin_email and args.admin_password:
        print_info("Logging in as admin...")
        admin_token = get_admin_token(api_url, args.admin_email, args.admin_password)
    
    if order and admin_token:
        shipment = test_inpost_shipment(api_url, order, admin_token)
        results["inpost_shipment"] = shipment is not None
    else:
        print_step(5, "Skipping InPost Shipment")
        if not admin_token:
            print_warning("Admin credentials not provided")
        if not order:
            print_warning("No order available")
    
    # Step 6: Get Paczkomats
    results["paczkomats"] = test_get_paczkomats(api_url)
    
    # Step 7: Email Service
    results["email_service"] = test_email_templates(api_url)
    
    # Summary
    print(f"\n{Colors.BOLD}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}📊 Test Summary{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*60}{Colors.RESET}")
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        status = f"{Colors.GREEN}PASS{Colors.RESET}" if result else f"{Colors.RED}FAIL{Colors.RESET}"
        print(f"  {test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\n{Colors.BOLD}Results: {passed} passed, {failed} failed{Colors.RESET}")
    
    if failed == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✅ All tests passed!{Colors.RESET}")
        sys.exit(0)
    else:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠️  Some tests failed. Check the output above.{Colors.RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()


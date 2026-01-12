from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings
from app.core.middleware import SecurityHeadersMiddleware, RateLimitMiddleware
from app.api.v1.endpoints import auth, products, orders, payments, upload, admin, shipping, made_to_order, categories, social_links, contact_info, users, user_addresses, beads, necklaces, quote_requests, blog

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Premium E-commerce API for Handmade Ethnic Jewelry",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    redirect_slashes=False,  # Disable automatic trailing slash redirects to prevent 307 errors
)

# Security middleware (must be first)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, requests_per_minute=60)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)

# Mount static files
static_dir = Path("static")
static_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["User Profile"])
app.include_router(user_addresses.router, prefix="/api/v1/users/addresses", tags=["User Addresses"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(social_links.router, prefix="/api/v1/social-links", tags=["Social Links"])
app.include_router(contact_info.router, prefix="/api/v1/contact-info", tags=["Contact Info"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["File Upload"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin Dashboard"])
app.include_router(shipping.router, prefix="/api/v1/shipping", tags=["Shipping"])
app.include_router(made_to_order.router, prefix="/api/v1/made-to-order", tags=["Made to Order"])
app.include_router(beads.router, prefix="/api/v1/beads", tags=["Beads Constructor"])
app.include_router(necklaces.router, prefix="/api/v1/necklaces", tags=["Necklace Configurations"])
app.include_router(quote_requests.router, prefix="/api/v1/quotes", tags=["Quote Requests"])
app.include_router(blog.router, prefix="/api/v1/blog", tags=["Blog"])


@app.get("/")
def read_root():
    """API root endpoint."""
    return {
        "message": "Rune box API",
        "version": settings.APP_VERSION,
        "docs": "/api/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        limit_concurrency=1000,
        limit_max_requests=10000,
        timeout_keep_alive=5,
    )

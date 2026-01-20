from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Info
    title_uk = Column(String, nullable=False, index=True)
    title_en = Column(String, nullable=True)
    title_de = Column(String, nullable=True)
    title_pl = Column(String, nullable=True)
    title_se = Column(String, nullable=True)  # Swedish
    title_no = Column(String, nullable=True)  # Norwegian
    title_dk = Column(String, nullable=True)  # Danish
    title_fr = Column(String, nullable=True)  # French
    slug = Column(String, unique=True, index=True, nullable=False)

    # Description (supports Markdown)
    description_uk = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    description_de = Column(Text, nullable=True)
    description_pl = Column(Text, nullable=True)
    description_se = Column(Text, nullable=True)  # Swedish
    description_no = Column(Text, nullable=True)  # Norwegian
    description_dk = Column(Text, nullable=True)  # Danish
    description_fr = Column(Text, nullable=True)  # French

    # Legend Section
    legend_title_uk = Column(String, nullable=True)
    legend_title_en = Column(String, nullable=True)
    legend_title_se = Column(String, nullable=True)  # Swedish
    legend_title_no = Column(String, nullable=True)  # Norwegian
    legend_title_dk = Column(String, nullable=True)  # Danish
    legend_title_fr = Column(String, nullable=True)  # French
    legend_content_uk = Column(Text, nullable=True)
    legend_content_en = Column(Text, nullable=True)
    legend_content_se = Column(Text, nullable=True)  # Swedish
    legend_content_no = Column(Text, nullable=True)  # Norwegian
    legend_content_dk = Column(Text, nullable=True)  # Danish
    legend_content_fr = Column(Text, nullable=True)  # French

    # Pricing
    price = Column(Float, nullable=False)
    currency = Column(String, default="zł")
    compare_at_price = Column(Float, nullable=True)  # Original price for discounts

    # Inventory
    stock_quantity = Column(Integer, default=0)
    sku = Column(String, unique=True, nullable=True)

    # Product Details
    materials_uk = Column(JSON, nullable=True)  # List of materials in Ukrainian
    materials_en = Column(JSON, nullable=True)  # List of materials in English
    materials_de = Column(JSON, nullable=True)  # List of materials in German
    materials_pl = Column(JSON, nullable=True)  # List of materials in Polish
    materials_se = Column(JSON, nullable=True)  # List of materials in Swedish
    materials_no = Column(JSON, nullable=True)  # List of materials in Norwegian
    materials_dk = Column(JSON, nullable=True)  # List of materials in Danish
    materials_fr = Column(JSON, nullable=True)  # List of materials in French
    specifications = Column(JSON, nullable=True)  # Dict of specs
    is_handmade = Column(Boolean, default=True)

    # Category & Tags
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    tags_uk = Column(JSON, nullable=True)  # List of tags in Ukrainian
    tags_en = Column(JSON, nullable=True)  # List of tags in English
    tags_de = Column(JSON, nullable=True)  # List of tags in German
    tags_pl = Column(JSON, nullable=True)  # List of tags in Polish
    tags_se = Column(JSON, nullable=True)  # List of tags in Swedish
    tags_no = Column(JSON, nullable=True)  # List of tags in Norwegian
    tags_dk = Column(JSON, nullable=True)  # List of tags in Danish
    tags_fr = Column(JSON, nullable=True)  # List of tags in French
    symbols = Column(JSON, nullable=True)  # love, protection, wealth, wisdom

    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Made to Order
    is_made_to_order = Column(Boolean, default=False)
    made_to_order_duration = Column(String, nullable=True)  # e.g., "2-3 тижні", "1 місяць"

    # SEO
    meta_description_uk = Column(Text, nullable=True)
    meta_description_en = Column(Text, nullable=True)
    meta_description_de = Column(Text, nullable=True)
    meta_description_pl = Column(Text, nullable=True)
    meta_description_se = Column(Text, nullable=True)
    meta_description_no = Column(Text, nullable=True)
    meta_description_dk = Column(Text, nullable=True)
    meta_description_fr = Column(Text, nullable=True)
    meta_keywords_uk = Column(JSON, nullable=True)
    meta_keywords_en = Column(JSON, nullable=True)
    meta_keywords_de = Column(JSON, nullable=True)
    meta_keywords_pl = Column(JSON, nullable=True)
    meta_keywords_se = Column(JSON, nullable=True)
    meta_keywords_no = Column(JSON, nullable=True)
    meta_keywords_dk = Column(JSON, nullable=True)
    meta_keywords_fr = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    made_to_order_requests = relationship("MadeToOrderRequest", back_populates="product", cascade="all, delete-orphan")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    position = Column(Integer, default=0)  # Order of images
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    product = relationship("Product", back_populates="images")

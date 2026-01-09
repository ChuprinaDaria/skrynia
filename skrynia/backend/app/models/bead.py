from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from app.db.base import Base
import enum


class BeadCategory(str, enum.Enum):
    """Категорії бусин"""
    STONE = "stone"  # Каміння
    HARDWARE = "hardware"  # Фурнітура (застібки, роздільники)
    EXTRA = "extra"  # Додатково (шарми, підвіски)


class Bead(Base):
    """
    Модель бусіни для конструктора намист.
    Зберігає PNG зображення та розмір в мм для автомасштабування.
    """
    __tablename__ = "beads"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Info
    name = Column(String, nullable=False, index=True)  # "Корал червоний 8мм"
    image_url = Column(String, nullable=False)  # URL до PNG зображення

    # Category
    category = Column(SQLEnum(BeadCategory), nullable=False, index=True)
    subcategory = Column(String, nullable=True, index=True)  # "coral", "amethyst", "clasp"

    # Physical Properties
    size_mm = Column(Integer, nullable=False)  # Розмір в мм (для автомасштабування)
    material = Column(String, nullable=True)  # "coral", "glass", "metal", "wood"

    # Pricing
    price_netto = Column(Float, nullable=False)  # Закупівельна ціна
    price_brutto = Column(Float, nullable=False)  # Продажна ціна
    currency = Column(String, default="PLN")

    # Supplier Info
    supplier_link = Column(Text, nullable=True)  # Де купити
    supplier_name = Column(String, nullable=True)  # Назва постачальника

    # Inventory
    stock_quantity = Column(Integer, default=0)  # Залишок на складі

    # Status
    is_active = Column(Boolean, default=True)  # Доступна в конструкторі

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

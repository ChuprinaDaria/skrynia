from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum


class QuoteStatus(str, enum.Enum):
    """Статус запиту на прорахунок"""
    PENDING = "pending"  # Очікує обробки
    QUOTED = "quoted"  # Адмін надав ціну
    APPROVED = "approved"  # Клієнт підтвердив
    REJECTED = "rejected"  # Клієнт відхилив


class QuoteRequest(Base):
    """
    Запит на прорахунок вартості намиста.
    Зберігає копію конфігурації та контактні дані.
    """
    __tablename__ = "quote_requests"

    id = Column(Integer, primary_key=True, index=True)

    # User (nullable для незалогінених)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Link to NecklaceConfiguration (опціонально)
    necklace_configuration_id = Column(
        Integer,
        ForeignKey("necklace_configurations.id"),
        nullable=True
    )

    # Contact Info (обов'язково для незалогінених)
    email = Column(String, nullable=False, index=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)

    # Necklace Data (копія на момент запиту)
    necklace_data = Column(JSON, nullable=False)

    # Customer Comment
    comment = Column(Text, nullable=True)

    # Status
    status = Column(SQLEnum(QuoteStatus), default=QuoteStatus.PENDING)
    is_read = Column(Boolean, default=False)  # Чи прочитав адмін

    # Admin Response
    admin_notes = Column(Text, nullable=True)
    admin_quote_price = Column(Float, nullable=True)  # Ціна від адміна
    admin_quote_currency = Column(String, default="PLN")

    # Auto-calculated Prices (для довідки адміна)
    calculated_netto = Column(Float, nullable=True)  # Автосума нетто
    calculated_brutto = Column(Float, nullable=True)  # Автосума брутто

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    quoted_at = Column(DateTime(timezone=True), nullable=True)  # Коли адмін відповів

    # Relationships
    user = relationship("User", backref="quote_requests")
    necklace_configuration = relationship("NecklaceConfiguration", back_populates="quote_requests")

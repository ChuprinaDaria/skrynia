from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum


class NecklaceStatus(str, enum.Enum):
    """Статус конфігурації намиста"""
    DRAFT = "draft"  # Чернетка (збережена, але не відправлена)
    SENT_FOR_QUOTE = "sent_for_quote"  # Відправлена на прорахунок


class NecklaceConfiguration(Base):
    """
    Конфігурація намиста користувача.
    Зберігає JSON з нитками та бусінами для візуального конструктора.
    """
    __tablename__ = "necklace_configurations"

    id = Column(Integer, primary_key=True, index=True)

    # User (nullable для незалогінених)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Configuration Data (JSONB)
    # Структура: {"threads": [{"thread_number": 1, "length_cm": 40, "beads": [...]}], "clasp": {...}}
    necklace_data = Column(JSON, nullable=False)

    # Visual Representation
    thumbnail_url = Column(String, nullable=True)  # Згенерована мініатюра

    # Status
    status = Column(SQLEnum(NecklaceStatus), default=NecklaceStatus.DRAFT)

    # Metadata
    name = Column(String, nullable=True)  # Опціональна назва від юзера

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="necklace_configurations")
    quote_requests = relationship("QuoteRequest", back_populates="necklace_configuration")

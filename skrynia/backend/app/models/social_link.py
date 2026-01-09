from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(Integer, primary_key=True, index=True)
    
    # Social Media Info
    platform = Column(String, nullable=False, unique=True)  # instagram, facebook, pinterest, etc.
    url = Column(String, nullable=False)
    icon_name = Column(String, nullable=True)  # Назва іконки з lucide-react або кастомна
    
    # Display
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)  # Порядок відображення
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.necklace import NecklaceStatus


class ThreadBead(BaseModel):
    """Бусіна на нитці"""
    bead_id: int = Field(..., description="ID бусіни")
    position: int = Field(..., ge=0, description="Позиція на нитці (0-based)")


class NecklaceThread(BaseModel):
    """Нитка намиста"""
    thread_number: int = Field(..., ge=1, le=5, description="Номер нитки (1-5)")
    length_cm: int = Field(..., ge=20, le=80, description="Довжина нитки в см")
    beads: List[ThreadBead] = Field(default_factory=list, description="Бусіни на нитці")


class NecklaceData(BaseModel):
    """Структура даних намиста"""
    threads: List[NecklaceThread] = Field(..., min_length=1, max_length=5, description="Нитки намиста")
    clasp: Optional[Dict[str, Any]] = Field(None, description="Застібка (обов'язкова)")

    class Config:
        json_schema_extra = {
            "example": {
                "threads": [
                    {
                        "thread_number": 1,
                        "length_cm": 40,
                        "beads": [
                            {"bead_id": 1, "position": 0},
                            {"bead_id": 2, "position": 1}
                        ]
                    }
                ],
                "clasp": {"bead_id": 10}
            }
        }


class NecklaceConfigurationBase(BaseModel):
    """Base schema for NecklaceConfiguration"""
    name: Optional[str] = Field(None, max_length=255, description="Назва намиста")
    necklace_data: NecklaceData = Field(..., description="Конфігурація намиста в JSON")
    thumbnail_url: Optional[str] = Field(None, description="URL мініатюри")


class NecklaceConfigurationCreate(NecklaceConfigurationBase):
    """Schema for creating a new necklace configuration"""
    pass


class NecklaceConfigurationUpdate(BaseModel):
    """Schema for updating a necklace configuration"""
    name: Optional[str] = Field(None, max_length=255)
    necklace_data: Optional[NecklaceData] = None
    thumbnail_url: Optional[str] = None
    status: Optional[NecklaceStatus] = None


class NecklaceConfiguration(NecklaceConfigurationBase):
    """Complete NecklaceConfiguration schema with database fields"""
    id: int
    user_id: Optional[int] = None
    status: NecklaceStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NecklaceConfigurationList(BaseModel):
    """Simplified schema for listing necklace configurations"""
    id: int
    name: Optional[str]
    thumbnail_url: Optional[str]
    status: NecklaceStatus
    created_at: datetime

    class Config:
        from_attributes = True

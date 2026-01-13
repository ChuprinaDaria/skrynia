from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AboutPageBase(BaseModel):
    title_ua: Optional[str] = None
    title_en: Optional[str] = None
    title_de: Optional[str] = None
    title_pl: Optional[str] = None
    title_se: Optional[str] = None
    title_no: Optional[str] = None
    title_dk: Optional[str] = None
    title_fr: Optional[str] = None
    
    subtitle_ua: Optional[str] = None
    subtitle_en: Optional[str] = None
    subtitle_de: Optional[str] = None
    subtitle_pl: Optional[str] = None
    subtitle_se: Optional[str] = None
    subtitle_no: Optional[str] = None
    subtitle_dk: Optional[str] = None
    subtitle_fr: Optional[str] = None
    
    history_title_ua: Optional[str] = None
    history_title_en: Optional[str] = None
    history_title_de: Optional[str] = None
    history_title_pl: Optional[str] = None
    history_title_se: Optional[str] = None
    history_title_no: Optional[str] = None
    history_title_dk: Optional[str] = None
    history_title_fr: Optional[str] = None
    
    history_content_ua: Optional[str] = None
    history_content_en: Optional[str] = None
    history_content_de: Optional[str] = None
    history_content_pl: Optional[str] = None
    history_content_se: Optional[str] = None
    history_content_no: Optional[str] = None
    history_content_dk: Optional[str] = None
    history_content_fr: Optional[str] = None
    
    mission_title_ua: Optional[str] = None
    mission_title_en: Optional[str] = None
    mission_title_de: Optional[str] = None
    mission_title_pl: Optional[str] = None
    mission_title_se: Optional[str] = None
    mission_title_no: Optional[str] = None
    mission_title_dk: Optional[str] = None
    mission_title_fr: Optional[str] = None
    
    mission_content_ua: Optional[str] = None
    mission_content_en: Optional[str] = None
    mission_content_de: Optional[str] = None
    mission_content_pl: Optional[str] = None
    mission_content_se: Optional[str] = None
    mission_content_no: Optional[str] = None
    mission_content_dk: Optional[str] = None
    mission_content_fr: Optional[str] = None
    
    quality_title_ua: Optional[str] = None
    quality_title_en: Optional[str] = None
    quality_title_de: Optional[str] = None
    quality_title_pl: Optional[str] = None
    quality_title_se: Optional[str] = None
    quality_title_no: Optional[str] = None
    quality_title_dk: Optional[str] = None
    quality_title_fr: Optional[str] = None
    
    quality_intro_ua: Optional[str] = None
    quality_intro_en: Optional[str] = None
    quality_intro_de: Optional[str] = None
    quality_intro_pl: Optional[str] = None
    quality_intro_se: Optional[str] = None
    quality_intro_no: Optional[str] = None
    quality_intro_dk: Optional[str] = None
    quality_intro_fr: Optional[str] = None
    
    quality_coral_ua: Optional[str] = None
    quality_coral_en: Optional[str] = None
    quality_coral_de: Optional[str] = None
    quality_coral_pl: Optional[str] = None
    quality_coral_se: Optional[str] = None
    quality_coral_no: Optional[str] = None
    quality_coral_dk: Optional[str] = None
    quality_coral_fr: Optional[str] = None
    
    quality_silver_ua: Optional[str] = None
    quality_silver_en: Optional[str] = None
    quality_silver_de: Optional[str] = None
    quality_silver_pl: Optional[str] = None
    quality_silver_se: Optional[str] = None
    quality_silver_no: Optional[str] = None
    quality_silver_dk: Optional[str] = None
    quality_silver_fr: Optional[str] = None
    
    quality_amber_ua: Optional[str] = None
    quality_amber_en: Optional[str] = None
    quality_amber_de: Optional[str] = None
    quality_amber_pl: Optional[str] = None
    quality_amber_se: Optional[str] = None
    quality_amber_no: Optional[str] = None
    quality_amber_dk: Optional[str] = None
    quality_amber_fr: Optional[str] = None
    
    quality_gemstone_ua: Optional[str] = None
    quality_gemstone_en: Optional[str] = None
    quality_gemstone_de: Optional[str] = None
    quality_gemstone_pl: Optional[str] = None
    quality_gemstone_se: Optional[str] = None
    quality_gemstone_no: Optional[str] = None
    quality_gemstone_dk: Optional[str] = None
    quality_gemstone_fr: Optional[str] = None
    
    quality_conclusion_ua: Optional[str] = None
    quality_conclusion_en: Optional[str] = None
    quality_conclusion_de: Optional[str] = None
    quality_conclusion_pl: Optional[str] = None
    quality_conclusion_se: Optional[str] = None
    quality_conclusion_no: Optional[str] = None
    quality_conclusion_dk: Optional[str] = None
    quality_conclusion_fr: Optional[str] = None


class AboutPageUpdate(AboutPageBase):
    pass


class AboutPage(AboutPageBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


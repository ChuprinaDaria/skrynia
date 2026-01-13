from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class AboutPage(Base):
    __tablename__ = "about_page"

    id = Column(Integer, primary_key=True, index=True)
    
    # Title for all languages
    title_ua = Column(Text, nullable=True)
    title_en = Column(Text, nullable=True)
    title_de = Column(Text, nullable=True)
    title_pl = Column(Text, nullable=True)
    title_se = Column(Text, nullable=True)
    title_no = Column(Text, nullable=True)
    title_dk = Column(Text, nullable=True)
    title_fr = Column(Text, nullable=True)
    
    # Subtitle for all languages
    subtitle_ua = Column(Text, nullable=True)
    subtitle_en = Column(Text, nullable=True)
    subtitle_de = Column(Text, nullable=True)
    subtitle_pl = Column(Text, nullable=True)
    subtitle_se = Column(Text, nullable=True)
    subtitle_no = Column(Text, nullable=True)
    subtitle_dk = Column(Text, nullable=True)
    subtitle_fr = Column(Text, nullable=True)
    
    # History section
    history_title_ua = Column(Text, nullable=True)
    history_title_en = Column(Text, nullable=True)
    history_title_de = Column(Text, nullable=True)
    history_title_pl = Column(Text, nullable=True)
    history_title_se = Column(Text, nullable=True)
    history_title_no = Column(Text, nullable=True)
    history_title_dk = Column(Text, nullable=True)
    history_title_fr = Column(Text, nullable=True)
    
    history_content_ua = Column(Text, nullable=True)
    history_content_en = Column(Text, nullable=True)
    history_content_de = Column(Text, nullable=True)
    history_content_pl = Column(Text, nullable=True)
    history_content_se = Column(Text, nullable=True)
    history_content_no = Column(Text, nullable=True)
    history_content_dk = Column(Text, nullable=True)
    history_content_fr = Column(Text, nullable=True)
    
    # Mission section
    mission_title_ua = Column(Text, nullable=True)
    mission_title_en = Column(Text, nullable=True)
    mission_title_de = Column(Text, nullable=True)
    mission_title_pl = Column(Text, nullable=True)
    mission_title_se = Column(Text, nullable=True)
    mission_title_no = Column(Text, nullable=True)
    mission_title_dk = Column(Text, nullable=True)
    mission_title_fr = Column(Text, nullable=True)
    
    mission_content_ua = Column(Text, nullable=True)
    mission_content_en = Column(Text, nullable=True)
    mission_content_de = Column(Text, nullable=True)
    mission_content_pl = Column(Text, nullable=True)
    mission_content_se = Column(Text, nullable=True)
    mission_content_no = Column(Text, nullable=True)
    mission_content_dk = Column(Text, nullable=True)
    mission_content_fr = Column(Text, nullable=True)
    
    # Quality section
    quality_title_ua = Column(Text, nullable=True)
    quality_title_en = Column(Text, nullable=True)
    quality_title_de = Column(Text, nullable=True)
    quality_title_pl = Column(Text, nullable=True)
    quality_title_se = Column(Text, nullable=True)
    quality_title_no = Column(Text, nullable=True)
    quality_title_dk = Column(Text, nullable=True)
    quality_title_fr = Column(Text, nullable=True)
    
    quality_intro_ua = Column(Text, nullable=True)
    quality_intro_en = Column(Text, nullable=True)
    quality_intro_de = Column(Text, nullable=True)
    quality_intro_pl = Column(Text, nullable=True)
    quality_intro_se = Column(Text, nullable=True)
    quality_intro_no = Column(Text, nullable=True)
    quality_intro_dk = Column(Text, nullable=True)
    quality_intro_fr = Column(Text, nullable=True)
    
    quality_coral_ua = Column(Text, nullable=True)
    quality_coral_en = Column(Text, nullable=True)
    quality_coral_de = Column(Text, nullable=True)
    quality_coral_pl = Column(Text, nullable=True)
    quality_coral_se = Column(Text, nullable=True)
    quality_coral_no = Column(Text, nullable=True)
    quality_coral_dk = Column(Text, nullable=True)
    quality_coral_fr = Column(Text, nullable=True)
    
    quality_silver_ua = Column(Text, nullable=True)
    quality_silver_en = Column(Text, nullable=True)
    quality_silver_de = Column(Text, nullable=True)
    quality_silver_pl = Column(Text, nullable=True)
    quality_silver_se = Column(Text, nullable=True)
    quality_silver_no = Column(Text, nullable=True)
    quality_silver_dk = Column(Text, nullable=True)
    quality_silver_fr = Column(Text, nullable=True)
    
    quality_amber_ua = Column(Text, nullable=True)
    quality_amber_en = Column(Text, nullable=True)
    quality_amber_de = Column(Text, nullable=True)
    quality_amber_pl = Column(Text, nullable=True)
    quality_amber_se = Column(Text, nullable=True)
    quality_amber_no = Column(Text, nullable=True)
    quality_amber_dk = Column(Text, nullable=True)
    quality_amber_fr = Column(Text, nullable=True)
    
    quality_gemstone_ua = Column(Text, nullable=True)
    quality_gemstone_en = Column(Text, nullable=True)
    quality_gemstone_de = Column(Text, nullable=True)
    quality_gemstone_pl = Column(Text, nullable=True)
    quality_gemstone_se = Column(Text, nullable=True)
    quality_gemstone_no = Column(Text, nullable=True)
    quality_gemstone_dk = Column(Text, nullable=True)
    quality_gemstone_fr = Column(Text, nullable=True)
    
    quality_conclusion_ua = Column(Text, nullable=True)
    quality_conclusion_en = Column(Text, nullable=True)
    quality_conclusion_de = Column(Text, nullable=True)
    quality_conclusion_pl = Column(Text, nullable=True)
    quality_conclusion_se = Column(Text, nullable=True)
    quality_conclusion_no = Column(Text, nullable=True)
    quality_conclusion_dk = Column(Text, nullable=True)
    quality_conclusion_fr = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


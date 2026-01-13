#!/usr/bin/env python3
"""
Скрипт для генерації маркера версії збірки.
Цей файл створюється під час збірки Docker образу і містить унікальний ідентифікатор збірки.
"""
import json
import os
from datetime import datetime
import uuid

def generate_build_marker():
    """Генерує маркер збірки з timestamp та унікальним ID."""
    build_id = str(uuid.uuid4())
    build_timestamp = datetime.utcnow().isoformat() + "Z"
    
    marker = {
        "build_id": build_id,
        "build_timestamp": build_timestamp,
        "build_date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "marker": f"SKRYNIA_BUILD_{build_id[:8].upper()}"
    }
    
    # Зберігаємо маркер у файл
    marker_file = os.path.join(os.path.dirname(__file__), "BUILD_MARKER.json")
    with open(marker_file, "w", encoding="utf-8") as f:
        json.dump(marker, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Build marker created: {marker['marker']}")
    print(f"   Build ID: {build_id}")
    print(f"   Timestamp: {build_timestamp}")
    
    return marker

if __name__ == "__main__":
    generate_build_marker()


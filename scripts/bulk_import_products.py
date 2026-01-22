#!/usr/bin/env python3
"""
Скрипт для bulk завантаження товарів з папки 'товари/' на сервер.

Використання:
    python scripts/bulk_import_products.py

Або з вказанням папки:
    python scripts/bulk_import_products.py --path товари/
"""

import json
import os
import sys
import argparse
import time
from pathlib import Path
from typing import Dict, List, Optional
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Додаємо корінь проекту до шляху
sys.path.insert(0, str(Path(__file__).parent.parent))

# Налаштування
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")

# Підтримувані формати зображень
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm"}


def create_session_with_retry():
    """Створює requests session з retry логікою."""
    session = requests.Session()
    retry_strategy = Retry(
        total=5,  # Increased from 3 to 5
        backoff_factor=2,  # Increased from 1 to 2 (exponential backoff)
        status_forcelist=[429, 500, 502, 503, 504],
        respect_retry_after_header=True,  # Respect Retry-After header from server
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def read_markdown_file(file_path: Path) -> str:
    """Читає вміст .md файлу."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except Exception as e:
        print(f"  ⚠️  Помилка читання {file_path.name}: {e}")
        return ""


def upload_image(session: requests.Session, image_path: Path, token: str) -> Optional[str]:
    """Завантажує зображення на сервер і повертає URL."""
    try:
        with open(image_path, "rb") as f:
            files = {"file": (image_path.name, f, "image/jpeg")}
            headers = {"Authorization": f"Bearer {token}"}
            response = session.post(
                f"{API_BASE_URL}/api/v1/upload/image",
                files=files,
                headers=headers,
                timeout=60
            )
            
        if response.status_code == 200:
            data = response.json()
            return data.get("url")
        else:
            print(f"  ⚠️  Помилка завантаження {image_path.name}: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"  ⚠️  Помилка завантаження {image_path.name}: {e}")
        return None


def upload_video(session: requests.Session, video_path: Path, token: str) -> Optional[str]:
    """Завантажує відео на сервер і повертає URL."""
    try:
        with open(video_path, "rb") as f:
            files = {"file": (video_path.name, f, "video/mp4")}
            headers = {"Authorization": f"Bearer {token}"}
            response = session.post(
                f"{API_BASE_URL}/api/v1/upload/video",
                files=files,
                headers=headers,
                timeout=300  # Більше часу для відео
            )
            
        if response.status_code == 200:
            data = response.json()
            return data.get("url")
        else:
            print(f"  ⚠️  Помилка завантаження {video_path.name}: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"  ⚠️  Помилка завантаження {video_path.name}: {e}")
        return None


def process_product(product_dir: Path, session: requests.Session, token: str) -> Dict:
    """Обробляє один товар з папки."""
    product_json_path = product_dir / "product.json"
    
    if not product_json_path.exists():
        return {
            "success": False,
            "slug": product_dir.name,
            "error": "product.json не знайдено"
        }
    
    # Читаємо product.json
    try:
        with open(product_json_path, "r", encoding="utf-8") as f:
            product_data = json.load(f)
    except Exception as e:
        return {
            "success": False,
            "slug": product_dir.name,
            "error": f"Помилка читання product.json: {e}"
        }
    
    # Перевіряємо обов'язкові поля
    if not product_data.get("title_uk"):
        return {
            "success": False,
            "slug": product_data.get("slug", product_dir.name),
            "error": "Відсутнє поле title_uk"
        }
    
    if not product_data.get("slug"):
        return {
            "success": False,
            "slug": product_dir.name,
            "error": "Відсутнє поле slug"
        }
    
    if not product_data.get("price"):
        return {
            "success": False,
            "slug": product_data.get("slug"),
            "error": "Відсутнє поле price"
        }
    
    # Читаємо .md файли якщо вказано
    md_fields = [
        "description_uk", "description_en", "description_de", "description_pl",
        "description_se", "description_no", "description_dk", "description_fr",
        "legend_content_uk", "legend_content_en", "legend_content_de", "legend_content_pl",
        "legend_content_se", "legend_content_no", "legend_content_dk", "legend_content_fr"
    ]
    
    for field in md_fields:
        file_field = f"{field}_file"
        if file_field in product_data:
            md_file = product_dir / product_data[file_field]
            if md_file.exists():
                product_data[field] = read_markdown_file(md_file)
                # Видаляємо _file поле
                del product_data[file_field]
    
    # Завантажуємо зображення
    images = []
    
    # Якщо в product.json вказані зображення, використовуємо їх (пріоритет)
    if "images" in product_data and isinstance(product_data["images"], list) and len(product_data["images"]) > 0:
        print(f"    📷 Використовуємо зображення з product.json...")
        for idx, img in enumerate(product_data["images"]):
            if "filename" in img:
                img_path = product_dir / img["filename"]
                if img_path.exists():
                    print(f"    📷 Завантаження зображення {img['filename']}...")
                    image_url = upload_image(session, img_path, token)
                    if image_url:
                        images.append({
                            "image_url": image_url,
                            "alt_text": img.get("alt_text", product_data.get("title_uk", img["filename"])),
                            "position": img.get("position", idx),
                            "is_primary": img.get("is_primary", idx == 0)  # Перше = primary якщо не вказано
                        })
                else:
                    print(f"    ⚠️  Файл {img['filename']} не знайдено, пропускаємо")
    else:
        # Якщо в product.json немає зображень, знаходимо всі .jpg/.png файли
        image_files = sorted([
            f for f in product_dir.iterdir()
            if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
        ])
        
        if not image_files:
            print(f"    ⚠️  Не знайдено зображень в папці")
        else:
            print(f"    📷 Знайдено {len(image_files)} зображень, завантажуємо...")
        
        for idx, image_path in enumerate(image_files):
            print(f"    📷 Завантаження зображення {image_path.name}...")
            image_url = upload_image(session, image_path, token)
            if image_url:
                # Використовуємо назву файлу для alt_text
                alt_text = product_data.get("title_uk", "") or image_path.stem
                images.append({
                    "image_url": image_url,
                    "alt_text": alt_text,
                    "position": idx,
                    "is_primary": idx == 0  # Перше зображення = головне
                })
    
    # Переконаємося, що є хоча б одне primary зображення
    if images:
        has_primary = any(img.get("is_primary", False) for img in images)
        if not has_primary:
            images[0]["is_primary"] = True
            print(f"    ✅ Встановлено перше зображення як primary")
    
    product_data["images"] = images
    
    # Завантажуємо відео
    videos = []
    video_files = [
        f for f in product_dir.iterdir()
        if f.is_file() and f.suffix.lower() in VIDEO_EXTENSIONS
    ]
    
    for video_path in video_files:
        print(f"    🎥 Завантаження відео {video_path.name}...")
        video_url = upload_video(session, video_path, token)
        if video_url:
            videos.append({
                "video_url": video_url,
                "alt_text": product_data.get("title_uk", ""),
                "position": len(videos)
            })
    
    if "videos" in product_data and isinstance(product_data["videos"], list):
        for vid in product_data["videos"]:
            if "filename" in vid:
                vid_path = product_dir / vid["filename"]
                if vid_path.exists():
                    print(f"    🎥 Завантаження відео {vid['filename']}...")
                    video_url = upload_video(session, vid_path, token)
                    if video_url:
                        vid["video_url"] = video_url
                        videos.append(vid)
    
    # Видаляємо videos з product_data, якщо вони там є (не підтримується в API)
    if "videos" in product_data:
        del product_data["videos"]
    
    # Створюємо або оновлюємо товар через API
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        # Перевіряємо, чи товар вже існує
        slug = product_data["slug"]
        check_response = session.get(
            f"{API_BASE_URL}/api/v1/products/{slug}",
            headers=headers
        )
        
        if check_response.status_code == 200:
            # Товар існує - оновлюємо
            existing_product = check_response.json()
            product_id = existing_product.get("id")
            existing_images = existing_product.get("images", [])
            existing_image_urls = {img.get("image_url") for img in existing_images}
            
            if product_id:
                # Фільтруємо тільки нові зображення (які ще не існують)
                new_images = [
                    img for img in product_data.get("images", [])
                    if img.get("image_url") not in existing_image_urls
                ]
                
                if new_images:
                    print(f"    📷 Додаємо {len(new_images)} нових зображень до існуючого товару")
                    product_data["images"] = new_images
                else:
                    # Немає нових зображень - видаляємо поле images
                    if "images" in product_data:
                        del product_data["images"]
                    print(f"    ℹ️  Всі зображення вже існують, оновлюємо тільки описи")
                
                response = session.patch(
                    f"{API_BASE_URL}/api/v1/products/{product_id}",
                    json=product_data,
                    headers=headers,
                    timeout=60
                )
                action = "оновлено"
                images_added = len(new_images) if new_images else 0
            else:
                response = session.post(
                    f"{API_BASE_URL}/api/v1/products",
                    json=product_data,
                    headers=headers,
                    timeout=60
                )
                action = "створено"
                images_added = len(images)
        else:
            # Товар не існує - створюємо
            response = session.post(
                f"{API_BASE_URL}/api/v1/products",
                json=product_data,
                headers=headers,
                timeout=60
            )
            action = "створено"
            images_added = len(images)
        
        if response.status_code in [200, 201]:
            return {
                "success": True,
                "slug": slug,
                "action": action,
                "images_count": images_added if 'images_added' in dir() else len(images),
                "videos_count": len(videos)
            }
        else:
            return {
                "success": False,
                "slug": slug,
                "error": f"Помилка API ({response.status_code}): {response.text}"
            }
            
    except Exception as e:
        return {
            "success": False,
            "slug": product_data.get("slug", product_dir.name),
            "error": f"Помилка API: {e}"
        }


def main():
    parser = argparse.ArgumentParser(description="Bulk import products from folder")
    parser.add_argument(
        "--path",
        type=str,
        default="товари",
        help="Шлях до папки з товарами (за замовчуванням: товари)"
    )
    parser.add_argument(
        "--api-url",
        type=str,
        default=os.getenv("API_BASE_URL", "http://localhost:8000"),
        help="URL API сервера"
    )
    parser.add_argument(
        "--token",
        type=str,
        default=os.getenv("ADMIN_TOKEN", ""),
        help="Admin токен для авторизації"
    )
    
    args = parser.parse_args()
    
    global API_BASE_URL, ADMIN_TOKEN
    API_BASE_URL = args.api_url
    ADMIN_TOKEN = args.token
    
    if not ADMIN_TOKEN:
        print("❌ Помилка: Не вказано ADMIN_TOKEN")
        print("   Встановіть змінну середовища ADMIN_TOKEN або використайте --token")
        sys.exit(1)
    
    products_dir = Path(args.path)
    if not products_dir.exists():
        print(f"❌ Помилка: Папка '{products_dir}' не існує")
        sys.exit(1)
    
    # Знаходимо всі підпапки з product.json
    product_dirs = [
        d for d in products_dir.iterdir()
        if d.is_dir() and (d / "product.json").exists()
    ]
    
    if not product_dirs:
        print(f"❌ Не знайдено товарів у папці '{products_dir}'")
        sys.exit(1)
    
    print(f"📦 Знайдено {len(product_dirs)} товарів для завантаження\n")
    
    session = create_session_with_retry()
    results = []
    
    for idx, product_dir in enumerate(product_dirs, 1):
        print(f"[{idx}/{len(product_dirs)}] Обробка: {product_dir.name}")
        result = process_product(product_dir, session, ADMIN_TOKEN)
        results.append(result)
        
        if result["success"]:
            print(f"  ✅ {result['action'].upper()}: {result['slug']}")
            print(f"     Зображень: {result['images_count']}, Відео: {result['videos_count']}")
        else:
            print(f"  ❌ Помилка: {result['error']}")
        print()
        
        # Delay between products to avoid rate limiting (429)
        if idx < len(product_dirs):
            time.sleep(2)  # 2 second delay between products
    
    # Підсумок
    successful = sum(1 for r in results if r["success"])
    failed = len(results) - successful
    
    print("=" * 60)
    print(f"📊 Підсумок:")
    print(f"   ✅ Успішно: {successful}")
    print(f"   ❌ Помилок: {failed}")
    print("=" * 60)
    
    if failed > 0:
        print("\n❌ Товари з помилками:")
        for result in results:
            if not result["success"]:
                print(f"   - {result['slug']}: {result['error']}")
    
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()


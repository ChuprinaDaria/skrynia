from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from pathlib import Path
from PIL import Image

from app.core.config import settings
from app.core.security import get_current_admin_user
from app.models.user import User
from app.db.session import get_db

router = APIRouter()

UPLOAD_DIR = Path(settings.UPLOAD_DIR)


def ensure_upload_dir():
    """Ensure upload directory exists, create if it doesn't."""
    try:
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    except PermissionError:
        # If we can't create the directory, try to use it anyway
        # It might already exist or be mounted as a volume
        if not UPLOAD_DIR.exists():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Cannot create upload directory: {UPLOAD_DIR}. Check permissions."
            )


def validate_image(file: UploadFile) -> bool:
    """Validate uploaded image file."""
    # Check file extension
    extension = file.filename.split(".")[-1].lower()
    if extension not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    return True


def optimize_image(file_path: Path, max_width: int = 1920) -> None:
    """Optimize uploaded image (resize and compress)."""
    try:
        img = Image.open(file_path)

        # Convert RGBA to RGB if needed
        if img.mode == "RGBA":
            img = img.convert("RGB")

        # Resize if too large
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)

        # Save with optimization
        img.save(file_path, optimize=True, quality=85)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image optimization failed: {str(e)}"
        )


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Upload a product image (admin only).
    Automatically optimizes and resizes images.
    """
    # Ensure upload directory exists
    ensure_upload_dir()
    
    # Validate file
    validate_image(file)

    # Check file size
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE / 1024 / 1024}MB"
        )

    # Generate unique filename
    extension = file.filename.split(".")[-1].lower()
    filename = f"{uuid.uuid4().hex}.{extension}"
    file_path = UPLOAD_DIR / filename

    # Save file
    try:
        with open(file_path, "wb") as f:
            f.write(contents)

        # Optimize image
        optimize_image(file_path)

        # Return URL
        file_url = f"/static/uploads/{filename}"

        return {
            "filename": filename,
            "url": file_url,
            "size": os.path.getsize(file_path)
        }

    except Exception as e:
        # Clean up file if error occurs
        if file_path.exists():
            os.remove(file_path)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}"
        )


@router.post("/images/bulk")
async def upload_multiple_images(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Upload multiple product images at once (admin only)."""
    # Ensure upload directory exists
    ensure_upload_dir()
    
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 files allowed per upload"
        )

    results = []
    errors = []

    for file in files:
        try:
            # Validate file
            validate_image(file)

            # Check file size
            contents = await file.read()
            if len(contents) > settings.MAX_FILE_SIZE:
                errors.append({
                    "filename": file.filename,
                    "error": "File too large"
                })
                continue

            # Generate unique filename
            extension = file.filename.split(".")[-1].lower()
            filename = f"{uuid.uuid4().hex}.{extension}"
            file_path = UPLOAD_DIR / filename

            # Save and optimize
            with open(file_path, "wb") as f:
                f.write(contents)

            optimize_image(file_path)

            results.append({
                "original_filename": file.filename,
                "filename": filename,
                "url": f"/static/uploads/{filename}",
                "size": os.path.getsize(file_path)
            })

        except Exception as e:
            errors.append({
                "filename": file.filename,
                "error": str(e)
            })

    return {
        "uploaded": results,
        "errors": errors,
        "total": len(files),
        "success": len(results),
        "failed": len(errors)
    }


@router.delete("/image/{filename}")
async def delete_image(
    filename: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Delete an uploaded image (admin only)."""
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    try:
        os.remove(file_path)
        return {"message": "File deleted successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File deletion failed: {str(e)}"
        )

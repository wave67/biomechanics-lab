import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
import aiofiles

from ..core.dependencies import get_db
from ..core.config import STORAGE_DIR, ALLOWED_EXTENSIONS, MAX_UPLOAD_SIZE
from ..schemas.file import FileCreate, FileResponse as FileRespSchema
from ..services import file_service

router = APIRouter()

TYPE_MAP = {
    "图片": "Sample_Image", "视频": "Video", "压力图": "Pressure_Data",
    "运动捕捉视频": "Motion_Capture_Data", "Excel": "Pressure_Data",
    "CSV": "Pressure_Data", "MAT文件": "Force_Plate_Data",
    "PPT": "Report", "PDF": "Report",
}


@router.get("/", response_model=dict)
async def list_files(
    skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    project_id: Optional[int] = None, file_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    items, total = await file_service.get_files(db, skip, limit, project_id, file_type)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}


@router.get("/recent", response_model=list[FileRespSchema])
async def recent_files(db: AsyncSession = Depends(get_db)):
    return await file_service.get_recent_files(db)


@router.get("/{file_id}", response_model=FileRespSchema)
async def get_file(file_id: int, db: AsyncSession = Depends(get_db)):
    f = await file_service.get_file(db, file_id)
    if not f:
        raise HTTPException(404, "File not found")
    return f


@router.get("/{file_id}/download")
async def download_file(file_id: int, db: AsyncSession = Depends(get_db)):
    f = await file_service.get_file(db, file_id)
    if not f:
        raise HTTPException(404, "File not found")
    file_path = os.path.join(STORAGE_DIR, f.storage_path)
    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found on disk")
    return FileResponse(
        path=file_path,
        filename=f.file_name,
        media_type="application/octet-stream",
        headers={"Content-Disposition": 'attachment; filename="' + f.file_name + '"'}
    )


@router.post("/upload", response_model=FileRespSchema, status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    project_no: str = Form("temp"),
    file_type: str = Form("其他"),
    uploader: str = Form(""),
    description: str = Form(""),
    db: AsyncSession = Depends(get_db),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext and ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"File type {ext} not allowed")
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > MAX_UPLOAD_SIZE:
        raise HTTPException(400, "File too large")
    import hashlib, time
    file_no = f"F-{int(time.time())}"
    md5 = hashlib.md5(file.filename.encode()).hexdigest()[:8]
    safe_name = f"{md5}_{file.filename}"
    sub_dir = TYPE_MAP.get(file_type, "Other")
    rel_path = f"{project_no}/{sub_dir}/{safe_name}"
    abs_path = os.path.join(STORAGE_DIR, rel_path)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    content = await file.read()
    async with aiofiles.open(abs_path, "wb") as f:
        await f.write(content)
    file_create = FileCreate(
        file_no=file_no, file_name=file.filename, file_type=file_type,
        storage_path=rel_path, file_size_bytes=size, uploader=uploader, description=description,
    )
    return await file_service.create_file(db, file_create)


@router.delete("/{file_id}")
async def delete_file(file_id: int, db: AsyncSession = Depends(get_db)):
    ok = await file_service.delete_file(db, file_id)
    if not ok:
        raise HTTPException(404, "File not found")
    return {"message": "Deleted"}

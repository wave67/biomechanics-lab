from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.dependencies import get_db
from ..schemas.report import ReportCreate
from ..services import report_service

router = APIRouter()

@router.get("/", response_model=list)
async def list_reports(project_id: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    return await report_service.get_reports_list(db, project_id)

@router.post("/", status_code=201)
async def create_report(data: ReportCreate, db: AsyncSession = Depends(get_db)):
    return await report_service.create_report(db, data)

@router.post("/{rid}/generate")
async def generate_report(rid: int, db: AsyncSession = Depends(get_db)):
    r = await report_service.generate_report_file(db, rid)
    if not r: raise HTTPException(404)
    return {"id": r.id, "status": r.status, "file_id": r.file_id}

@router.delete("/{rid}")
async def delete_report(rid: int, db: AsyncSession = Depends(get_db)):
    ok = await report_service.delete_report(db, rid)
    if not ok: raise HTTPException(404)
    return {"message": "Deleted"}
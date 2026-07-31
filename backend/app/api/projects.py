from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.dependencies import get_db
from ..schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from ..services import project_service

router = APIRouter()


@router.get("/", response_model=dict)
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: Optional[str] = None,
    brand_name: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    items, total = await project_service.get_projects(db, skip, limit, status, brand_name)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}


@router.get("/current", response_model=list[ProjectResponse])
async def current_projects(db: AsyncSession = Depends(get_db)):
    return await project_service.get_current_projects(db)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    p = await project_service.get_project(db, project_id)
    if not p:
        raise HTTPException(404, "Project not found")
    return p


@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_project(data: ProjectCreate, db: AsyncSession = Depends(get_db)):
    return await project_service.create_project(db, data)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, data: ProjectUpdate, db: AsyncSession = Depends(get_db)):
    p = await project_service.update_project(db, project_id, data)
    if not p:
        raise HTTPException(404, "Project not found")
    return p


@router.patch("/{project_id}/status", response_model=ProjectResponse)
async def update_project_status(project_id: int, status: str, db: AsyncSession = Depends(get_db)):
    p = await project_service.get_project(db, project_id)
    if not p:
        raise HTTPException(404, "Project not found")
    p.status = status
    await db.flush()
    await db.refresh(p)
    return p


@router.delete("/{project_id}")
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    ok = await project_service.delete_project(db, project_id)
    if not ok:
        raise HTTPException(404, "Project not found")
    return {"message": "Deleted"}

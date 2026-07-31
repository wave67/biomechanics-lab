from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.dependencies import get_db
from ..schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentResponse
from ..services import equipment_service

router = APIRouter()

@router.get("/", response_model=dict)
async def list_equipment(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    status: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    items, total = await equipment_service.get_equipment_list(db, skip, limit, status)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}

@router.get("/{eid}", response_model=EquipmentResponse)
async def get_equipment(eid: int, db: AsyncSession = Depends(get_db)):
    e = await equipment_service.get_equipment(db, eid)
    if not e: raise HTTPException(404, "Equipment not found")
    return e

@router.post("/", response_model=EquipmentResponse, status_code=201)
async def create_equipment(data: EquipmentCreate, db: AsyncSession = Depends(get_db)):
    return await equipment_service.create_equipment(db, data)

@router.put("/{eid}", response_model=EquipmentResponse)
async def update_equipment(eid: int, data: EquipmentUpdate, db: AsyncSession = Depends(get_db)):
    e = await equipment_service.update_equipment(db, eid, data)
    if not e: raise HTTPException(404, "Equipment not found")
    return e

@router.delete("/{eid}")
async def delete_equipment(eid: int, db: AsyncSession = Depends(get_db)):
    ok = await equipment_service.delete_equipment(db, eid)
    if not ok: raise HTTPException(404, "Equipment not found")
    return {"message": "Deleted"}

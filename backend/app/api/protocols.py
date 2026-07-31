from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.dependencies import get_db
from ..schemas.protocol import ProtocolCreate, ProtocolUpdate, ProtocolResponse
from ..services import protocol_service

router = APIRouter()

@router.get("/", response_model=dict)
async def list_protocols(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    is_active: Optional[bool] = None, db: AsyncSession = Depends(get_db)):
    items, total = await protocol_service.get_protocols(db, skip, limit, is_active)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}

@router.get("/{pid}", response_model=ProtocolResponse)
async def get_protocol(pid: int, db: AsyncSession = Depends(get_db)):
    p = await protocol_service.get_protocol(db, pid)
    if not p: raise HTTPException(404, "Protocol not found")
    return p

@router.post("/", response_model=ProtocolResponse, status_code=201)
async def create_protocol(data: ProtocolCreate, db: AsyncSession = Depends(get_db)):
    return await protocol_service.create_protocol(db, data)

@router.put("/{pid}", response_model=ProtocolResponse)
async def update_protocol(pid: int, data: ProtocolUpdate, db: AsyncSession = Depends(get_db)):
    p = await protocol_service.update_protocol(db, pid, data)
    if not p: raise HTTPException(404, "Protocol not found")
    return p

@router.delete("/{pid}")
async def delete_protocol(pid: int, db: AsyncSession = Depends(get_db)):
    ok = await protocol_service.delete_protocol(db, pid)
    if not ok: raise HTTPException(404, "Protocol not found")
    return {"message": "Deleted"}

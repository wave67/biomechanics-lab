from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.dependencies import get_db
from ..schemas.session import SessionCreate, SessionUpdate, SessionResponse
from ..services import session_service

router = APIRouter()

@router.get("/", response_model=dict)
async def list_sessions(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    project_id: Optional[int] = None, status: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    items, total = await session_service.get_sessions(db, skip, limit, project_id, status)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}

@router.get("/{sid}", response_model=SessionResponse)
async def get_session(sid: int, db: AsyncSession = Depends(get_db)):
    s = await session_service.get_session(db, sid)
    if not s: raise HTTPException(404, "Session not found")
    return s

@router.post("/", response_model=SessionResponse, status_code=201)
async def create_session(data: SessionCreate, db: AsyncSession = Depends(get_db)):
    return await session_service.create_session(db, data)

@router.put("/{sid}", response_model=SessionResponse)
async def update_session(sid: int, data: SessionUpdate, db: AsyncSession = Depends(get_db)):
    s = await session_service.update_session(db, sid, data)
    if not s: raise HTTPException(404, "Session not found")
    return s

@router.patch("/{sid}/status", response_model=SessionResponse)
async def update_session_status(sid: int, status: str, db: AsyncSession = Depends(get_db)):
    s = await session_service.get_session(db, sid)
    if not s: raise HTTPException(404, "Session not found")
    s.status = status; await db.flush(); await db.refresh(s); return s

@router.delete("/{sid}")
async def delete_session(sid: int, db: AsyncSession = Depends(get_db)):
    ok = await session_service.delete_session(db, sid)
    if not ok: raise HTTPException(404, "Session not found")
    return {"message": "Deleted"}

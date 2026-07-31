from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.dependencies import get_db
from ..schemas.trial import TrialCreate, TrialUpdate, TrialResponse
from ..services import trial_service

router = APIRouter()

@router.get("/", response_model=dict)
async def list_trials(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    session_id: Optional[int] = None, is_valid: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    items, total = await trial_service.get_trials(db, skip, limit, session_id, is_valid)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}

@router.get("/{tid}", response_model=TrialResponse)
async def get_trial(tid: int, db: AsyncSession = Depends(get_db)):
    t = await trial_service.get_trial(db, tid)
    if not t: raise HTTPException(404, "Trial not found")
    return t

@router.post("/", response_model=TrialResponse, status_code=201)
async def create_trial(data: TrialCreate, db: AsyncSession = Depends(get_db)):
    return await trial_service.create_trial(db, data)

@router.put("/{tid}", response_model=TrialResponse)
async def update_trial(tid: int, data: TrialUpdate, db: AsyncSession = Depends(get_db)):
    t = await trial_service.update_trial(db, tid, data)
    if not t: raise HTTPException(404, "Trial not found")
    return t

@router.delete("/{tid}")
async def delete_trial(tid: int, db: AsyncSession = Depends(get_db)):
    ok = await trial_service.delete_trial(db, tid)
    if not ok: raise HTTPException(404, "Trial not found")
    return {"message": "Deleted"}

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.dependencies import get_db
from ..schemas.participant import ParticipantCreate, ParticipantUpdate, ParticipantResponse
from ..services import participant_service

router = APIRouter()


@router.get("/", response_model=dict)
async def list_participants(
    skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    gender: Optional[str] = None, db: AsyncSession = Depends(get_db),
):
    items, total = await participant_service.get_participants(db, skip, limit, gender)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}


@router.get("/{pid}", response_model=ParticipantResponse)
async def get_participant(pid: int, db: AsyncSession = Depends(get_db)):
    p = await participant_service.get_participant(db, pid)
    if not p:
        raise HTTPException(404, "Participant not found")
    return p


@router.post("/", response_model=ParticipantResponse, status_code=201)
async def create_participant(data: ParticipantCreate, db: AsyncSession = Depends(get_db)):
    return await participant_service.create_participant(db, data)


@router.put("/{pid}", response_model=ParticipantResponse)
async def update_participant(pid: int, data: ParticipantUpdate, db: AsyncSession = Depends(get_db)):
    p = await participant_service.update_participant(db, pid, data)
    if not p:
        raise HTTPException(404, "Participant not found")
    return p


@router.delete("/{pid}")
async def delete_participant(pid: int, db: AsyncSession = Depends(get_db)):
    ok = await participant_service.delete_participant(db, pid)
    if not ok:
        raise HTTPException(404, "Participant not found")
    return {"message": "Deleted"}

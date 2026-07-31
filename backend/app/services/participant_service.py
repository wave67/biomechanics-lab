from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from ..models import Participant
from ..schemas.participant import ParticipantCreate, ParticipantUpdate, ParticipantResponse

async def get_participants(db: AsyncSession, skip: int = 0, limit: int = 50, gender: Optional[str] = None) -> tuple[List[dict], int]:
    query = select(Participant); cq = select(func.count(Participant.id))
    if gender: query = query.where(Participant.gender == gender); cq = cq.where(Participant.gender == gender)
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(Participant.created_at.desc()).offset(skip).limit(limit))
    items = jsonable_encoder([ParticipantResponse.model_validate(p).model_dump() for p in result.scalars().all()])
    return items, total

async def get_participant(db: AsyncSession, pid: int) -> Optional[Participant]:
    r = await db.execute(select(Participant).where(Participant.id == pid)); return r.scalar_one_or_none()

async def create_participant(db: AsyncSession, data: ParticipantCreate) -> Participant:
    p = Participant(**data.model_dump()); db.add(p); await db.flush(); await db.refresh(p); return p

async def update_participant(db: AsyncSession, pid: int, data: ParticipantUpdate) -> Optional[Participant]:
    p = await get_participant(db, pid)
    if not p: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(p, k, v)
    await db.flush(); await db.refresh(p); return p

async def delete_participant(db: AsyncSession, pid: int) -> bool:
    p = await get_participant(db, pid)
    if not p: return False
    await db.delete(p); await db.flush(); return True

from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from ..models.test_trial import TestTrial
from ..schemas.trial import TrialCreate, TrialUpdate, TrialResponse

async def get_trials(db: AsyncSession, skip: int = 0, limit: int = 50,
    session_id: Optional[int] = None, is_valid: Optional[str] = None) -> tuple[List[dict], int]:
    query = select(TestTrial); cq = select(func.count(TestTrial.id))
    if session_id: query = query.where(TestTrial.session_id == session_id); cq = cq.where(TestTrial.session_id == session_id)
    if is_valid: query = query.where(TestTrial.is_valid == is_valid); cq = cq.where(TestTrial.is_valid == is_valid)
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(TestTrial.trial_number).offset(skip).limit(limit))
    items = jsonable_encoder([TrialResponse.model_validate(t).model_dump() for t in result.scalars().all()])
    return items, total

async def get_trial(db: AsyncSession, tid: int) -> Optional[TestTrial]:
    r = await db.execute(select(TestTrial).where(TestTrial.id == tid)); return r.scalar_one_or_none()

async def create_trial(db: AsyncSession, data: TrialCreate) -> TestTrial:
    t = TestTrial(**data.model_dump()); db.add(t); await db.flush(); await db.refresh(t); return t

async def update_trial(db: AsyncSession, tid: int, data: TrialUpdate) -> Optional[TestTrial]:
    t = await get_trial(db, tid)
    if not t: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(t, k, v)
    await db.flush(); await db.refresh(t); return t

async def delete_trial(db: AsyncSession, tid: int) -> bool:
    t = await get_trial(db, tid)
    if not t: return False
    await db.delete(t); await db.flush(); return True

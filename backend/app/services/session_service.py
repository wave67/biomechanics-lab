from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from ..models.test_session import TestSession
from ..schemas.session import SessionCreate, SessionUpdate, SessionResponse

async def get_sessions(db: AsyncSession, skip: int = 0, limit: int = 50,
    project_id: Optional[int] = None, status: Optional[str] = None) -> tuple[List[dict], int]:
    query = select(TestSession); cq = select(func.count(TestSession.id))
    if project_id: query = query.where(TestSession.project_id == project_id); cq = cq.where(TestSession.project_id == project_id)
    if status: query = query.where(TestSession.status == status); cq = cq.where(TestSession.status == status)
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(TestSession.created_at.desc()).offset(skip).limit(limit))
    items = jsonable_encoder([SessionResponse.model_validate(s).model_dump() for s in result.scalars().all()])
    return items, total

async def get_session(db: AsyncSession, sid: int) -> Optional[TestSession]:
    r = await db.execute(select(TestSession).where(TestSession.id == sid)); return r.scalar_one_or_none()

async def create_session(db: AsyncSession, data: SessionCreate) -> TestSession:
    s = TestSession(**data.model_dump()); db.add(s); await db.flush(); await db.refresh(s); return s

async def update_session(db: AsyncSession, sid: int, data: SessionUpdate) -> Optional[TestSession]:
    s = await get_session(db, sid)
    if not s: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(s, k, v)
    await db.flush(); await db.refresh(s); return s

async def delete_session(db: AsyncSession, sid: int) -> bool:
    s = await get_session(db, sid)
    if not s: return False
    await db.delete(s); await db.flush(); return True

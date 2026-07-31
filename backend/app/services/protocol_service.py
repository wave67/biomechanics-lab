from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from ..models.test_protocol import TestProtocol
from ..schemas.protocol import ProtocolCreate, ProtocolUpdate, ProtocolResponse

async def get_protocols(db: AsyncSession, skip: int = 0, limit: int = 50, is_active: Optional[bool] = None) -> tuple[List[dict], int]:
    query = select(TestProtocol); cq = select(func.count(TestProtocol.id))
    if is_active is not None: query = query.where(TestProtocol.is_active == is_active); cq = cq.where(TestProtocol.is_active == is_active)
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(TestProtocol.updated_at.desc()).offset(skip).limit(limit))
    items = jsonable_encoder([ProtocolResponse.model_validate(p).model_dump() for p in result.scalars().all()])
    return items, total

async def get_protocol(db: AsyncSession, pid: int) -> Optional[TestProtocol]:
    r = await db.execute(select(TestProtocol).where(TestProtocol.id == pid)); return r.scalar_one_or_none()

async def create_protocol(db: AsyncSession, data: ProtocolCreate) -> TestProtocol:
    p = TestProtocol(**data.model_dump()); db.add(p); await db.flush(); await db.refresh(p); return p

async def update_protocol(db: AsyncSession, pid: int, data: ProtocolUpdate) -> Optional[TestProtocol]:
    p = await get_protocol(db, pid)
    if not p: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(p, k, v)
    await db.flush(); await db.refresh(p); return p

async def delete_protocol(db: AsyncSession, pid: int) -> bool:
    p = await get_protocol(db, pid)
    if not p: return False
    await db.delete(p); await db.flush(); return True

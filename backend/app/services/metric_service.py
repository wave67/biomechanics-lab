from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from ..models.metric_dictionary import MetricDictionary
from ..schemas.metric import MetricCreate, MetricUpdate, MetricResponse

async def get_metrics(db: AsyncSession, skip=0, limit=50, test_type=None) -> tuple[List[dict], int]:
    q = select(MetricDictionary); cq = select(func.count(MetricDictionary.id))
    if test_type: q = q.where(MetricDictionary.test_type == test_type); cq = cq.where(MetricDictionary.test_type == test_type)
    total = (await db.execute(cq)).scalar() or 0
    r = await db.execute(q.order_by(MetricDictionary.metric_no).offset(skip).limit(limit))
    items = jsonable_encoder([MetricResponse.model_validate(m).model_dump() for m in r.scalars().all()])
    return items, total

async def get_metric(db: AsyncSession, mid: int) -> Optional[MetricDictionary]:
    r = await db.execute(select(MetricDictionary).where(MetricDictionary.id == mid)); return r.scalar_one_or_none()

async def create_metric(db: AsyncSession, data: MetricCreate) -> MetricDictionary:
    m = MetricDictionary(**data.model_dump()); db.add(m); await db.flush(); await db.refresh(m); return m

async def update_metric(db: AsyncSession, mid: int, data: MetricUpdate) -> Optional[MetricDictionary]:
    m = await get_metric(db, mid)
    if not m: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(m, k, v)
    await db.flush(); await db.refresh(m); return m

async def delete_metric(db: AsyncSession, mid: int) -> bool:
    m = await get_metric(db, mid)
    if not m: return False
    await db.delete(m); await db.flush(); return True

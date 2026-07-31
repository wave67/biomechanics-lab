from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from ..models import BiomechanicalTestData
from ..schemas.test_data import TestDataCreate, TestDataUpdate, TestDataResponse

async def get_test_data_list(db: AsyncSession, skip: int = 0, limit: int = 50,
    project_id: Optional[int] = None, test_type: Optional[str] = None, participant_id: Optional[int] = None,
) -> tuple[List[dict], int]:
    query = select(BiomechanicalTestData); cq = select(func.count(BiomechanicalTestData.id))
    if project_id: query = query.where(BiomechanicalTestData.project_id == project_id); cq = cq.where(BiomechanicalTestData.project_id == project_id)
    if test_type: query = query.where(BiomechanicalTestData.test_type == test_type); cq = cq.where(BiomechanicalTestData.test_type == test_type)
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(BiomechanicalTestData.created_at.desc()).offset(skip).limit(limit))
    items = jsonable_encoder([TestDataResponse.model_validate(d).model_dump() for d in result.scalars().all()])
    return items, total

async def get_recent_test_data(db: AsyncSession, days: int = 7, limit: int = 10) -> List[BiomechanicalTestData]:
    from datetime import datetime, timedelta
    since = datetime.now() - timedelta(days=days)
    result = await db.execute(select(BiomechanicalTestData).where(BiomechanicalTestData.created_at >= since).order_by(BiomechanicalTestData.created_at.desc()).limit(limit))
    return list(result.scalars().all())

async def get_test_data(db: AsyncSession, data_id: int) -> Optional[BiomechanicalTestData]:
    r = await db.execute(select(BiomechanicalTestData).where(BiomechanicalTestData.id == data_id)); return r.scalar_one_or_none()

async def create_test_data(db: AsyncSession, data: TestDataCreate) -> BiomechanicalTestData:
    td = BiomechanicalTestData(**data.model_dump()); db.add(td); await db.flush(); await db.refresh(td); return td

async def update_test_data(db: AsyncSession, data_id: int, data: TestDataUpdate) -> Optional[BiomechanicalTestData]:
    td = await get_test_data(db, data_id)
    if not td: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(td, k, v)
    await db.flush(); await db.refresh(td); return td

async def delete_test_data(db: AsyncSession, data_id: int) -> bool:
    td = await get_test_data(db, data_id)
    if not td: return False
    await db.delete(td); await db.flush(); return True

from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from ..models import ShoeSample, SampleTransaction
from ..schemas.sample import SampleCreate, SampleUpdate, TransactionCreate, SampleResponse


async def get_samples(db: AsyncSession, skip: int = 0, limit: int = 50,
    status: Optional[str] = None, brand: Optional[str] = None, shoe_type: Optional[str] = None,
) -> tuple[List[dict], int]:
    query = select(ShoeSample); cq = select(func.count(ShoeSample.id))
    if status: query = query.where(ShoeSample.status == status); cq = cq.where(ShoeSample.status == status)
    if brand: query = query.where(ShoeSample.brand.ilike(f"%{brand}%")); cq = cq.where(ShoeSample.brand.ilike(f"%{brand}%"))
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(ShoeSample.created_at.desc()).offset(skip).limit(limit))
    items = jsonable_encoder([SampleResponse.model_validate(s).model_dump() for s in result.scalars().all()])
    return items, total


async def get_sample(db: AsyncSession, sample_id: int) -> Optional[ShoeSample]:
    result = await db.execute(select(ShoeSample).where(ShoeSample.id == sample_id))
    return result.scalar_one_or_none()


async def create_sample(db: AsyncSession, data: SampleCreate) -> ShoeSample:
    sample = ShoeSample(**data.model_dump())
    db.add(sample); await db.flush(); await db.refresh(sample)
    txn = SampleTransaction(sample_id=sample.id, operation_type="入库", operator="system")
    db.add(txn)
    return sample


async def update_sample(db: AsyncSession, sample_id: int, data: SampleUpdate) -> Optional[ShoeSample]:
    s = await get_sample(db, sample_id)
    if not s: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(s, k, v)
    await db.flush(); await db.refresh(s); return s


async def delete_sample(db: AsyncSession, sample_id: int) -> bool:
    s = await get_sample(db, sample_id)
    if not s: return False
    await db.delete(s); await db.flush(); return True


async def get_transactions(db: AsyncSession, sample_id: int) -> List[SampleTransaction]:
    result = await db.execute(select(SampleTransaction).where(SampleTransaction.sample_id == sample_id).order_by(SampleTransaction.created_at.desc()))
    return list(result.scalars().all())


async def create_transaction(db: AsyncSession, sample_id: int, data: TransactionCreate) -> SampleTransaction:
    txn = SampleTransaction(sample_id=sample_id, **data.model_dump())
    db.add(txn); await db.flush(); await db.refresh(txn); return txn

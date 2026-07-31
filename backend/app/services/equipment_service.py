from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder
from ..models.equipment import Equipment
from ..schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentResponse

async def get_equipment_list(db: AsyncSession, skip: int = 0, limit: int = 50, status: Optional[str] = None) -> tuple[List[dict], int]:
    query = select(Equipment); cq = select(func.count(Equipment.id))
    if status: query = query.where(Equipment.status == status); cq = cq.where(Equipment.status == status)
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(Equipment.created_at.desc()).offset(skip).limit(limit))
    items = jsonable_encoder([EquipmentResponse.model_validate(e).model_dump() for e in result.scalars().all()])
    return items, total

async def get_equipment(db: AsyncSession, eid: int) -> Optional[Equipment]:
    r = await db.execute(select(Equipment).where(Equipment.id == eid)); return r.scalar_one_or_none()

async def create_equipment(db: AsyncSession, data: EquipmentCreate) -> Equipment:
    e = Equipment(**data.model_dump()); db.add(e); await db.flush(); await db.refresh(e); return e

async def update_equipment(db: AsyncSession, eid: int, data: EquipmentUpdate) -> Optional[Equipment]:
    e = await get_equipment(db, eid)
    if not e: return None
    for k, v in data.model_dump(exclude_unset=True).items(): setattr(e, k, v)
    await db.flush(); await db.refresh(e); return e

async def delete_equipment(db: AsyncSession, eid: int) -> bool:
    e = await get_equipment(db, eid)
    if not e: return False
    await db.delete(e); await db.flush(); return True

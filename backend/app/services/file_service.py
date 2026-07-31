import os
from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import TestFile
from ..schemas.file import FileCreate

from ..core.config import STORAGE_DIR


async def get_files(
    db: AsyncSession, skip: int = 0, limit: int = 50,
    project_id: Optional[int] = None, file_type: Optional[str] = None,
) -> tuple[List[TestFile], int]:
    query = select(TestFile)
    cq = select(func.count(TestFile.id))
    if project_id:
        query = query.where(TestFile.project_id == project_id)
        cq = cq.where(TestFile.project_id == project_id)
    if file_type:
        query = query.where(TestFile.file_type == file_type)
        cq = cq.where(TestFile.file_type == file_type)
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(TestFile.created_at.desc()).offset(skip).limit(limit))
    return list(result.scalars().all()), total


async def get_recent_files(db: AsyncSession, limit: int = 10) -> List[TestFile]:
    result = await db.execute(
        select(TestFile).order_by(TestFile.created_at.desc()).limit(limit)
    )
    return list(result.scalars().all())


async def get_file(db: AsyncSession, file_id: int) -> Optional[TestFile]:
    result = await db.execute(select(TestFile).where(TestFile.id == file_id))
    return result.scalar_one_or_none()


async def create_file(db: AsyncSession, data: FileCreate) -> TestFile:
    f = TestFile(**data.model_dump())
    db.add(f)
    await db.flush()
    await db.refresh(f)
    return f


async def delete_file(db: AsyncSession, file_id: int) -> bool:
    f = await get_file(db, file_id)
    if not f:
        return False
    file_path = os.path.join(STORAGE_DIR, f.storage_path)
    if os.path.exists(file_path):
        os.remove(file_path)
    await db.delete(f)
    await db.flush()
    return True

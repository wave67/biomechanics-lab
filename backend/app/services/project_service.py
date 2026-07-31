from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from ..models import BiomechanicalTestProject
from ..schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse


async def get_projects(
    db: AsyncSession, skip: int = 0, limit: int = 50,
    status: Optional[str] = None, brand_name: Optional[str] = None,
    responsible_person: Optional[str] = None,
) -> tuple[List[dict], int]:
    query = select(BiomechanicalTestProject)
    cq = select(func.count(BiomechanicalTestProject.id))
    if status:
        query = query.where(BiomechanicalTestProject.status == status)
        cq = cq.where(BiomechanicalTestProject.status == status)
    if brand_name:
        query = query.where(BiomechanicalTestProject.brand_name.ilike(f"%{brand_name}%"))
        cq = cq.where(BiomechanicalTestProject.brand_name.ilike(f"%{brand_name}%"))
    total = (await db.execute(cq)).scalar() or 0
    result = await db.execute(query.order_by(BiomechanicalTestProject.created_at.desc()).offset(skip).limit(limit))
    projects = list(result.scalars().all())
    items = jsonable_encoder([ProjectResponse.model_validate(p).model_dump() for p in projects])
    return items, total


async def get_current_projects(db: AsyncSession, limit: int = 5) -> List[BiomechanicalTestProject]:
    non_final = ["待准备", "样品确认", "测试进行", "数据处理中", "报告整理"]
    result = await db.execute(
        select(BiomechanicalTestProject).where(BiomechanicalTestProject.status.in_(non_final))
        .order_by(BiomechanicalTestProject.updated_at.desc()).limit(limit)
    )
    return list(result.scalars().all())


async def get_project(db: AsyncSession, project_id: int) -> Optional[BiomechanicalTestProject]:
    result = await db.execute(select(BiomechanicalTestProject).where(BiomechanicalTestProject.id == project_id))
    return result.scalar_one_or_none()


async def create_project(db: AsyncSession, data: ProjectCreate) -> BiomechanicalTestProject:
    project = BiomechanicalTestProject(**data.model_dump())
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return project


async def update_project(db: AsyncSession, project_id: int, data: ProjectUpdate) -> Optional[BiomechanicalTestProject]:
    project = await get_project(db, project_id)
    if not project:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    await db.flush()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, project_id: int) -> bool:
    project = await get_project(db, project_id)
    if not project:
        return False
    await db.delete(project)
    await db.flush()
    return True

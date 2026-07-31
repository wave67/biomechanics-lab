from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from ..models import Task
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse


async def get_tasks(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    task_type: Optional[str] = None,
    priority: Optional[str] = None,
    user_id: Optional[int] = None,
    due_date: Optional[str] = None,
) -> tuple[List[dict], int]:
    query = select(Task)
    count_query = select(func.count(Task.id))
    if status:
        query = query.where(Task.status == status)
        count_query = count_query.where(Task.status == status)
    if task_type:
        query = query.where(Task.task_type == task_type)
        count_query = count_query.where(Task.task_type == task_type)
    if priority:
        query = query.where(Task.priority == priority)
        count_query = count_query.where(Task.priority == priority)
    if due_date:
        query = query.where(func.date(Task.due_time) == due_date)
        count_query = count_query.where(func.date(Task.due_time) == due_date)
    total = (await db.execute(count_query)).scalar() or 0
    result = await db.execute(query.order_by(Task.created_at.desc()).offset(skip).limit(limit))
    tasks = list(result.scalars().all())
    items = jsonable_encoder([TaskResponse.model_validate(t).model_dump() for t in tasks])
    return items, total


async def get_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    result = await db.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def create_task(db: AsyncSession, data: TaskCreate) -> Task:
    task = Task(**data.model_dump())
    db.add(task)
    await db.flush()
    await db.refresh(task)
    return task


async def update_task(db: AsyncSession, task_id: int, data: TaskUpdate) -> Optional[Task]:
    task = await get_task(db, task_id)
    if not task:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    await db.flush()
    await db.refresh(task)
    return task


async def delete_task(db: AsyncSession, task_id: int) -> bool:
    task = await get_task(db, task_id)
    if not task:
        return False
    await db.delete(task)
    await db.flush()
    return True

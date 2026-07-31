from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.dependencies import get_db
from ..schemas.task import TaskCreate, TaskUpdate, TaskResponse
from ..services import task_service

router = APIRouter()


@router.get("/", response_model=dict)
async def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: Optional[str] = None,
    task_type: Optional[str] = None,
    priority: Optional[str] = None,
    due_date: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    items, total = await task_service.get_tasks(db, skip, limit, status, task_type, priority, due_date=due_date)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}


@router.get("/today", response_model=list[TaskResponse])
async def today_tasks(db: AsyncSession = Depends(get_db)):
    from datetime import date
    items, _ = await task_service.get_tasks(db, due_date=date.today().isoformat())
    return items


@router.get("/week", response_model=dict)
async def week_tasks(db: AsyncSession = Depends(get_db)):
    from datetime import date, timedelta
    today = date.today()
    start = today - timedelta(days=today.weekday())
    end = start + timedelta(days=6)
    items, _ = await task_service.get_tasks(db, limit=200)
    week_items = [t for t in items if t.due_time and start <= t.due_time.date() <= end]
    return {"items": week_items, "start": start.isoformat(), "end": end.isoformat()}


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    return task


@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(data: TaskCreate, db: AsyncSession = Depends(get_db)):
    return await task_service.create_task(db, data)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, data: TaskUpdate, db: AsyncSession = Depends(get_db)):
    task = await task_service.update_task(db, task_id, data)
    if not task:
        raise HTTPException(404, "Task not found")
    return task


@router.patch("/{task_id}/status", response_model=TaskResponse)
async def update_task_status(task_id: int, status: str, db: AsyncSession = Depends(get_db)):
    task = await task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    task.status = status
    await db.flush()
    await db.refresh(task)
    return task


@router.delete("/{task_id}")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    ok = await task_service.delete_task(db, task_id)
    if not ok:
        raise HTTPException(404, "Task not found")
    return {"message": "Deleted"}

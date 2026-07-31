from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.dependencies import get_db
from ..schemas.metric import MetricCreate, MetricUpdate, MetricResponse
from ..services import metric_service

router = APIRouter()

@router.get("/", response_model=dict)
async def list_metrics(skip=Query(0,ge=0), limit=Query(50,ge=1,le=200), test_type: Optional[str]=None, db:AsyncSession=Depends(get_db)):
    items, total = await metric_service.get_metrics(db, skip, limit, test_type)
    return {"items": items, "total": total, "page": skip//limit+1, "page_size": limit}

@router.get("/{mid}", response_model=MetricResponse)
async def get_metric(mid: int, db: AsyncSession = Depends(get_db)):
    m = await metric_service.get_metric(db, mid)
    if not m: raise HTTPException(404)
    return m

@router.post("/", response_model=MetricResponse, status_code=201)
async def create_metric(data: MetricCreate, db: AsyncSession = Depends(get_db)):
    return await metric_service.create_metric(db, data)

@router.put("/{mid}", response_model=MetricResponse)
async def update_metric(mid: int, data: MetricUpdate, db: AsyncSession = Depends(get_db)):
    m = await metric_service.update_metric(db, mid, data)
    if not m: raise HTTPException(404)
    return m

@router.delete("/{mid}")
async def delete_metric(mid: int, db: AsyncSession = Depends(get_db)):
    ok = await metric_service.delete_metric(db, mid)
    if not ok: raise HTTPException(404)
    return {"message": "Deleted"}

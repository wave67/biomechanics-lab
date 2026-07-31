from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.dependencies import get_db
from ..schemas.test_data import TestDataCreate, TestDataUpdate, TestDataResponse
from ..services import test_data_service

router = APIRouter()


@router.get("/", response_model=dict)
async def list_test_data(
    skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    project_id: Optional[int] = None, test_type: Optional[str] = None,
    participant_id: Optional[int] = None, db: AsyncSession = Depends(get_db),
):
    items, total = await test_data_service.get_test_data_list(db, skip, limit, project_id, test_type, participant_id)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}


@router.get("/recent", response_model=list[TestDataResponse])
async def recent_test_data(db: AsyncSession = Depends(get_db)):
    return await test_data_service.get_recent_test_data(db)


@router.get("/{data_id}", response_model=TestDataResponse)
async def get_test_data(data_id: int, db: AsyncSession = Depends(get_db)):
    d = await test_data_service.get_test_data(db, data_id)
    if not d:
        raise HTTPException(404, "Test data not found")
    return d


@router.post("/", response_model=TestDataResponse, status_code=201)
async def create_test_data(data: TestDataCreate, db: AsyncSession = Depends(get_db)):
    return await test_data_service.create_test_data(db, data)


@router.put("/{data_id}", response_model=TestDataResponse)
async def update_test_data(data_id: int, data: TestDataUpdate, db: AsyncSession = Depends(get_db)):
    d = await test_data_service.update_test_data(db, data_id, data)
    if not d:
        raise HTTPException(404, "Test data not found")
    return d


@router.delete("/{data_id}")
async def delete_test_data(data_id: int, db: AsyncSession = Depends(get_db)):
    ok = await test_data_service.delete_test_data(db, data_id)
    if not ok:
        raise HTTPException(404, "Test data not found")
    return {"message": "Deleted"}

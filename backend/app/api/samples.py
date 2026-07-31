from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.dependencies import get_db
from ..schemas.sample import SampleCreate, SampleUpdate, SampleResponse, TransactionCreate, TransactionResponse
from ..services import sample_service

router = APIRouter()


@router.get("/", response_model=dict)
async def list_samples(
    skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
    status: Optional[str] = None, brand: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    items, total = await sample_service.get_samples(db, skip, limit, status, brand)
    return {"items": items, "total": total, "page": skip // limit + 1, "page_size": limit}


@router.get("/{sample_id}", response_model=SampleResponse)
async def get_sample(sample_id: int, db: AsyncSession = Depends(get_db)):
    s = await sample_service.get_sample(db, sample_id)
    if not s:
        raise HTTPException(404, "Sample not found")
    return s


@router.post("/", response_model=SampleResponse, status_code=201)
async def create_sample(data: SampleCreate, db: AsyncSession = Depends(get_db)):
    return await sample_service.create_sample(db, data)


@router.put("/{sample_id}", response_model=SampleResponse)
async def update_sample(sample_id: int, data: SampleUpdate, db: AsyncSession = Depends(get_db)):
    s = await sample_service.update_sample(db, sample_id, data)
    if not s:
        raise HTTPException(404, "Sample not found")
    return s


@router.delete("/{sample_id}")
async def delete_sample(sample_id: int, db: AsyncSession = Depends(get_db)):
    ok = await sample_service.delete_sample(db, sample_id)
    if not ok:
        raise HTTPException(404, "Sample not found")
    return {"message": "Deleted"}


@router.get("/{sample_id}/transactions", response_model=list[TransactionResponse])
async def list_transactions(sample_id: int, db: AsyncSession = Depends(get_db)):
    return await sample_service.get_transactions(db, sample_id)


@router.post("/{sample_id}/transactions", response_model=TransactionResponse, status_code=201)
async def create_transaction(sample_id: int, data: TransactionCreate, db: AsyncSession = Depends(get_db)):
    return await sample_service.create_transaction(db, sample_id, data)

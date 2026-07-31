from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


class SampleBase(BaseModel):
    sample_no: str = Field(..., max_length=32)
    brand: Optional[str] = None
    shoe_name: Optional[str] = None
    shoe_type: Optional[str] = None
    shoe_size: Optional[int] = None
    size_label: Optional[str] = None
    heel_height_mm: Optional[int] = None
    heel_structure: Optional[str] = None
    color: Optional[str] = None
    material_info: Optional[str] = None
    quantity: int = Field(default=1)
    storage_date: Optional[date] = None
    source: Optional[str] = None
    status: str = Field(default="库存")


class SampleCreate(SampleBase):
    pass


class SampleUpdate(SampleBase):
    sample_no: Optional[str] = None


class SampleResponse(SampleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TransactionCreate(BaseModel):
    operation_type: str
    operator: Optional[str] = None
    operation_date: Optional[date] = None
    notes: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    sample_id: int
    operation_type: str
    operator: Optional[str] = None
    operation_date: date
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

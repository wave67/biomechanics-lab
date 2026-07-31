from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class MetricBase(BaseModel):
    metric_no: str = Field(..., max_length=32)
    metric_name: str = Field(..., max_length=128)
    metric_name_cn: Optional[str] = None
    unit: Optional[str] = None
    test_type: str = Field(..., max_length=32)
    description: Optional[str] = None


class MetricCreate(MetricBase):
    pass


class MetricUpdate(MetricBase):
    metric_no: Optional[str] = None
    metric_name: Optional[str] = None
    test_type: Optional[str] = None


class MetricResponse(MetricBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

from datetime import date, datetime
from typing import Optional, Any
from pydantic import BaseModel, Field


class TestDataBase(BaseModel):
    data_no: str = Field(..., max_length=32)
    project_id: int
    sample_id: Optional[int] = None
    participant_id: Optional[int] = None
    test_date: Optional[date] = None
    test_type: str = Field(..., description="Test type enum")
    pressure_data: Optional[Any] = None
    force_plate_data: Optional[Any] = None
    motion_capture_data: Optional[Any] = None
    device_name: Optional[str] = None
    device_model: Optional[str] = None
    sampling_frequency: Optional[int] = None
    test_action: Optional[str] = None
    test_speed: Optional[str] = None
    test_trials: Optional[int] = None
    raw_data_path: Optional[str] = None
    analysis_result_path: Optional[str] = None
    notes: Optional[str] = None


class TestDataCreate(TestDataBase):
    pass


class TestDataUpdate(TestDataBase):
    data_no: Optional[str] = None
    project_id: Optional[int] = None


class TestDataResponse(TestDataBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    project_no: str = Field(..., max_length=32)
    project_name: str = Field(..., max_length=256)
    brand_name: Optional[str] = None
    shoe_name: Optional[str] = None
    shoe_type: Optional[str] = None
    heel_height_mm: Optional[int] = None
    heel_type: Optional[str] = None
    shoe_size: Optional[int] = None
    test_purpose: Optional[str] = None
    responsible_person: Optional[str] = None
    status: str = Field(default="待准备")
    test_equipment: Optional[Any] = None
    test_events: Optional[Any] = None
    test_environment: Optional[Any] = None
    notes: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    project_no: Optional[str] = None
    project_name: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

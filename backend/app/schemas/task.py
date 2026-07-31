from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class TaskBase(BaseModel):
    title: str = Field(..., max_length=256)
    description: Optional[str] = None
    task_type: str = Field(..., description="Type enum")
    priority: str = Field(..., description="Priority enum")
    status: str = Field(default="未开始")
    start_time: Optional[datetime] = None
    due_time: Optional[datetime] = None
    estimated_hours: Optional[Decimal] = None
    actual_hours: Optional[Decimal] = None
    project_id: Optional[int] = None
    notes: Optional[str] = None


class TaskCreate(TaskBase):
    user_id: int


class TaskUpdate(TaskBase):
    title: Optional[str] = None
    task_type: Optional[str] = None
    priority: Optional[str] = None


class TaskResponse(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

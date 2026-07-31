from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field


class ReportBase(BaseModel):
    project_id: int
    report_name: str = Field(..., max_length=256)
    report_type: str = Field(default="PPTX")
    template_snapshot: Optional[Any] = None
    analysis_ids: Optional[Any] = None
    status: str = Field(default="草稿")


class ReportCreate(ReportBase):
    pass


class ReportResponse(ReportBase):
    id: int
    file_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

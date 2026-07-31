from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field


class AnalysisBase(BaseModel):
    project_id: int
    analysis_name: str = Field(..., max_length=256)
    analysis_type: str = Field(default="descriptive")
    parameters: Optional[Any] = None
    result_data: Optional[Any] = None


class AnalysisCreate(AnalysisBase):
    pass


class AnalysisResponse(AnalysisBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

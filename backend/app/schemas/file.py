from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class FileBase(BaseModel):
    file_no: str = Field(..., max_length=32)
    file_name: str = Field(..., max_length=256)
    file_type: str = Field(..., max_length=32)
    storage_path: str = Field(..., max_length=512)
    file_size_bytes: Optional[int] = None
    project_id: Optional[int] = None
    sample_id: Optional[int] = None
    participant_id: Optional[int] = None
    test_data_id: Optional[int] = None
    uploader: Optional[str] = None
    upload_time: Optional[datetime] = None
    description: Optional[str] = None


class FileCreate(FileBase):
    pass


class FileResponse(FileBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

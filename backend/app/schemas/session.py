from datetime import date, datetime; from typing import Optional; from pydantic import BaseModel, Field

class SessionBase(BaseModel):
    session_no: str = Field(..., max_length=32)
    project_id: int
    test_date: Optional[date] = None
    test_location: Optional[str] = None
    responsible_person: Optional[str] = None
    status: str = Field(default="准备")
    notes: Optional[str] = None

class SessionCreate(SessionBase): pass
class SessionUpdate(SessionBase):
    session_no: Optional[str] = None
    project_id: Optional[int] = None

class SessionResponse(SessionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config: from_attributes = True

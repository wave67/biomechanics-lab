from datetime import datetime; from typing import Optional; from pydantic import BaseModel, Field

class TrialBase(BaseModel):
    trial_no: str = Field(..., max_length=16)
    session_id: int
    sample_id: Optional[int] = None
    participant_id: Optional[int] = None
    test_type: Optional[str] = None
    action_type: Optional[str] = None
    trial_number: Optional[int] = None
    is_valid: str = Field(default="待审核")
    invalid_reason: Optional[str] = None
    notes: Optional[str] = None

class TrialCreate(TrialBase): pass
class TrialUpdate(TrialBase):
    trial_no: Optional[str] = None
    session_id: Optional[int] = None

class TrialResponse(TrialBase):
    id: int
    created_at: datetime
    class Config: from_attributes = True

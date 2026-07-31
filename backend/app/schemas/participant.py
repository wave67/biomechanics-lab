from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class ParticipantBase(BaseModel):
    participant_no: str = Field(..., max_length=32)
    gender: Optional[str] = None
    age: Optional[int] = None
    height_cm: Optional[Decimal] = None
    weight_kg: Optional[Decimal] = None
    shoe_size: Optional[int] = None
    foot_type_info: Optional[str] = None
    exercise_habits: Optional[str] = None
    notes: Optional[str] = None


class ParticipantCreate(ParticipantBase):
    pass


class ParticipantUpdate(ParticipantBase):
    participant_no: Optional[str] = None


class ParticipantResponse(ParticipantBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

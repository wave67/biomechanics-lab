from datetime import datetime; from typing import Optional; from pydantic import BaseModel, Field

class EquipmentBase(BaseModel):
    equipment_no: Optional[str] = None
    name: str = Field(..., max_length=256)
    brand: Optional[str] = None
    model: Optional[str] = None
    sampling_frequency: Optional[int] = None
    status: str = Field(default="正常")
    notes: Optional[str] = None

class EquipmentCreate(EquipmentBase): pass
class EquipmentUpdate(EquipmentBase):
    name: Optional[str] = None

class EquipmentResponse(EquipmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config: from_attributes = True

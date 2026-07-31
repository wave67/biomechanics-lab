from datetime import datetime; from typing import Optional, Any; from pydantic import BaseModel, Field

class ProtocolBase(BaseModel):
    protocol_no: Optional[str] = None
    name: str = Field(..., max_length=256)
    version: str = Field(default="1.0")
    test_purpose: Optional[str] = None
    applicable_shoe_types: Optional[Any] = None
    equipment_requirements: Optional[Any] = None
    action_flow: Optional[Any] = None
    metric_list: Optional[Any] = None
    is_active: bool = True

class ProtocolCreate(ProtocolBase): pass
class ProtocolUpdate(ProtocolBase):
    name: Optional[str] = None

class ProtocolResponse(ProtocolBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config: from_attributes = True

from datetime import datetime
from sqlalchemy import String, Text, Boolean, DateTime, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class TestProtocol(Base):
    __tablename__ = "test_protocols"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    protocol_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    version: Mapped[str] = mapped_column(String(16), default="1.0")
    test_purpose: Mapped[str] = mapped_column(Text, nullable=True)
    applicable_shoe_types: Mapped[dict] = mapped_column(JSON, nullable=True)
    equipment_requirements: Mapped[dict] = mapped_column(JSON, nullable=True)
    action_flow: Mapped[dict] = mapped_column(JSON, nullable=True)
    metric_list: Mapped[dict] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

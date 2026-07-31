from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    equipment_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    brand: Mapped[str] = mapped_column(String(128), nullable=True)
    model: Mapped[str] = mapped_column(String(128), nullable=True)
    sampling_frequency: Mapped[int] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="正常")
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

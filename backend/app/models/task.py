from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Text, Integer, DateTime, Numeric, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    task_type: Mapped[str] = mapped_column(String(32), nullable=False)
    priority: Mapped[str] = mapped_column(String(8), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="未开始")
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    due_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    estimated_hours: Mapped[Decimal] = mapped_column(Numeric(6, 1), nullable=True)
    actual_hours: Mapped[Decimal] = mapped_column(Numeric(6, 1), nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("biomechanical_test_projects.id", ondelete="SET NULL"), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="tasks")
    project = relationship("BiomechanicalTestProject", back_populates="tasks")

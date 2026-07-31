from datetime import date, datetime
from sqlalchemy import String, Text, Integer, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class TestSession(Base):
    __tablename__ = "test_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    project_id: Mapped[int] = mapped_column(ForeignKey("biomechanical_test_projects.id", ondelete="CASCADE"), nullable=False)
    test_date: Mapped[date] = mapped_column(Date, nullable=True)
    test_location: Mapped[str] = mapped_column(String(128), nullable=True)
    responsible_person: Mapped[str] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="准备")
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    project = relationship("BiomechanicalTestProject", back_populates="sessions")
    trials = relationship("TestTrial", back_populates="session", cascade="all, delete-orphan")

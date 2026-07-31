from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Text, Integer, DateTime, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    participant_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    gender: Mapped[str] = mapped_column(String(8), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    height_cm: Mapped[Decimal] = mapped_column(Numeric(5, 1), nullable=True)
    weight_kg: Mapped[Decimal] = mapped_column(Numeric(5, 1), nullable=True)
    shoe_size: Mapped[int] = mapped_column(Integer, nullable=True)
    foot_type_info: Mapped[str] = mapped_column(Text, nullable=True)
    exercise_habits: Mapped[str] = mapped_column(Text, nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    projects = relationship("BiomechanicalTestProject", secondary="project_participants", back_populates="participants")
    test_data = relationship("BiomechanicalTestData", back_populates="participant")
    files = relationship("TestFile", back_populates="participant")

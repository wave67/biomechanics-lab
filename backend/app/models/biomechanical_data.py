from datetime import date, datetime
from sqlalchemy import String, Text, Integer, Date, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class BiomechanicalTestData(Base):
    __tablename__ = "biomechanical_test_data"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    data_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    project_id: Mapped[int] = mapped_column(ForeignKey("biomechanical_test_projects.id", ondelete="CASCADE"), nullable=False)
    sample_id: Mapped[int] = mapped_column(ForeignKey("shoe_samples.id", ondelete="SET NULL"), nullable=True)
    participant_id: Mapped[int] = mapped_column(ForeignKey("participants.id", ondelete="SET NULL"), nullable=True)
    test_date: Mapped[date] = mapped_column(Date, nullable=True)
    test_type: Mapped[str] = mapped_column(String(32), nullable=False)
    pressure_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    force_plate_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    motion_capture_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    device_name: Mapped[str] = mapped_column(String(128), nullable=True)
    device_model: Mapped[str] = mapped_column(String(128), nullable=True)
    sampling_frequency: Mapped[int] = mapped_column(Integer, nullable=True)
    test_action: Mapped[str] = mapped_column(String(64), nullable=True)
    test_speed: Mapped[str] = mapped_column(String(32), nullable=True)
    test_trials: Mapped[int] = mapped_column(Integer, nullable=True)
    raw_data_path: Mapped[str] = mapped_column(String(512), nullable=True)
    analysis_result_path: Mapped[str] = mapped_column(String(512), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    project = relationship("BiomechanicalTestProject", back_populates="test_data")
    sample = relationship("ShoeSample", back_populates="test_data")
    participant = relationship("Participant", back_populates="test_data")
    files = relationship("TestFile", back_populates="test_data", cascade="all, delete-orphan")

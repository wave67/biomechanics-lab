from datetime import datetime
from sqlalchemy import String, Text, Integer, BigInteger, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class TestFile(Base):
    __tablename__ = "test_files"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    file_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    file_name: Mapped[str] = mapped_column(String(256), nullable=False)
    file_type: Mapped[str] = mapped_column(String(32), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(512), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("biomechanical_test_projects.id", ondelete="CASCADE"), nullable=True)
    sample_id: Mapped[int] = mapped_column(ForeignKey("shoe_samples.id", ondelete="SET NULL"), nullable=True)
    participant_id: Mapped[int] = mapped_column(ForeignKey("participants.id", ondelete="SET NULL"), nullable=True)
    test_data_id: Mapped[int] = mapped_column(ForeignKey("biomechanical_test_data.id", ondelete="SET NULL"), nullable=True)
    uploader: Mapped[str] = mapped_column(String(64), nullable=True)
    upload_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    project = relationship("BiomechanicalTestProject", back_populates="files")
    sample = relationship("ShoeSample", back_populates="files")
    participant = relationship("Participant", back_populates="files")
    test_data = relationship("BiomechanicalTestData", back_populates="files")

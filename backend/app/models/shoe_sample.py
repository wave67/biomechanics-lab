from datetime import date, datetime
from sqlalchemy import String, Text, Integer, Date, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class ShoeSample(Base):
    __tablename__ = "shoe_samples"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sample_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    brand: Mapped[str] = mapped_column(String(128), nullable=True)
    shoe_name: Mapped[str] = mapped_column(String(256), nullable=True)
    shoe_type: Mapped[str] = mapped_column(String(32), nullable=True)
    shoe_size: Mapped[int] = mapped_column(Integer, nullable=True)
    size_label: Mapped[str] = mapped_column(String(16), nullable=True)
    heel_height_mm: Mapped[int] = mapped_column(Integer, nullable=True)
    heel_structure: Mapped[str] = mapped_column(String(64), nullable=True)
    color: Mapped[str] = mapped_column(String(32), nullable=True)
    material_info: Mapped[str] = mapped_column(Text, nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    storage_date: Mapped[date] = mapped_column(Date, nullable=True)
    source: Mapped[str] = mapped_column(String(128), nullable=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="库存")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    transactions = relationship("SampleTransaction", back_populates="sample", cascade="all, delete-orphan")
    projects = relationship("BiomechanicalTestProject", secondary="project_samples", back_populates="samples")
    test_data = relationship("BiomechanicalTestData", back_populates="sample")
    files = relationship("TestFile", back_populates="sample")

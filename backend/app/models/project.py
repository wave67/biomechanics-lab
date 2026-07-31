from datetime import datetime
from typing import Any
from sqlalchemy import String, Text, Integer, DateTime, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class BiomechanicalTestProject(Base):
    __tablename__ = "biomechanical_test_projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    project_name: Mapped[str] = mapped_column(String(256), nullable=False)
    brand_name: Mapped[str] = mapped_column(String(128), nullable=True)
    shoe_name: Mapped[str] = mapped_column(String(256), nullable=True)
    shoe_type: Mapped[str] = mapped_column(String(32), nullable=True)
    heel_height_mm: Mapped[int] = mapped_column(Integer, nullable=True)
    heel_type: Mapped[str] = mapped_column(String(16), nullable=True)
    shoe_size: Mapped[int] = mapped_column(Integer, nullable=True)
    test_purpose: Mapped[str] = mapped_column(Text, nullable=True)
    responsible_person: Mapped[str] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="待准备")
    test_equipment: Mapped[Any] = mapped_column(JSON, nullable=True, default=list)
    test_events: Mapped[Any] = mapped_column(JSON, nullable=True, default=list)
    test_environment: Mapped[Any] = mapped_column(JSON, nullable=True, default=dict)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    samples = relationship("ShoeSample", secondary="project_samples", back_populates="projects")
    participants = relationship("Participant", secondary="project_participants", back_populates="projects")
    test_data = relationship("BiomechanicalTestData", back_populates="project", cascade="all, delete-orphan")
    files = relationship("TestFile", back_populates="project", cascade="all, delete-orphan")
    sessions = relationship("TestSession", back_populates="project", cascade="all, delete-orphan")

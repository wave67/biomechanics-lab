from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, JSON, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class Analysis(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("biomechanical_test_projects.id", ondelete="CASCADE"), nullable=False)
    analysis_name: Mapped[str] = mapped_column(String(256), nullable=False)
    analysis_type: Mapped[str] = mapped_column(String(32), nullable=False)
    parameters: Mapped[dict] = mapped_column(JSON, nullable=True)
    result_data: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

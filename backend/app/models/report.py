from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, JSON, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("biomechanical_test_projects.id", ondelete="CASCADE"), nullable=False)
    report_name: Mapped[str] = mapped_column(String(256), nullable=False)
    report_type: Mapped[str] = mapped_column(String(16), default="PPTX")
    file_id: Mapped[int] = mapped_column(ForeignKey("test_files.id", ondelete="SET NULL"), nullable=True)
    template_snapshot: Mapped[dict] = mapped_column(JSON, nullable=True)
    analysis_ids: Mapped[dict] = mapped_column(JSON, nullable=True, default=list)
    status: Mapped[str] = mapped_column(String(16), default="草稿")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

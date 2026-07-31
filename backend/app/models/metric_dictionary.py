from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from ..core.database import Base


class MetricDictionary(Base):
    __tablename__ = "metric_dictionary"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    metric_no: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    metric_name: Mapped[str] = mapped_column(String(128), nullable=False)
    metric_name_cn: Mapped[str] = mapped_column(String(128), nullable=True)
    unit: Mapped[str] = mapped_column(String(32), nullable=True)
    test_type: Mapped[str] = mapped_column(String(32), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

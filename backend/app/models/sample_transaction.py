from datetime import date, datetime
from sqlalchemy import String, Text, Integer, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class SampleTransaction(Base):
    __tablename__ = "sample_transactions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sample_id: Mapped[int] = mapped_column(ForeignKey("shoe_samples.id", ondelete="CASCADE"), nullable=False)
    operation_type: Mapped[str] = mapped_column(String(16), nullable=False)
    operator: Mapped[str] = mapped_column(String(64), nullable=True)
    operation_date: Mapped[date] = mapped_column(Date, server_default=func.current_date())
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    sample = relationship("ShoeSample", back_populates="transactions")

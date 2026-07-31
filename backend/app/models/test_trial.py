from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core.database import Base


class TestTrial(Base):
    __tablename__ = "test_trials"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    trial_no: Mapped[str] = mapped_column(String(16), nullable=False)
    session_id: Mapped[int] = mapped_column(ForeignKey("test_sessions.id", ondelete="CASCADE"), nullable=False)
    sample_id: Mapped[int] = mapped_column(ForeignKey("shoe_samples.id", ondelete="SET NULL"), nullable=True)
    participant_id: Mapped[int] = mapped_column(ForeignKey("participants.id", ondelete="SET NULL"), nullable=True)
    test_type: Mapped[str] = mapped_column(String(32), nullable=True)
    action_type: Mapped[str] = mapped_column(String(32), nullable=True)
    trial_number: Mapped[int] = mapped_column(Integer, nullable=True)
    is_valid: Mapped[str] = mapped_column(String(16), nullable=False, default="待审核")
    invalid_reason: Mapped[str] = mapped_column(String(32), nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    session = relationship("TestSession", back_populates="trials")
    sample = relationship("ShoeSample")
    participant = relationship("Participant")

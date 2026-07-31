from datetime import datetime
from sqlalchemy import Table, Column, Integer, DateTime, ForeignKey, func

from ..core.database import Base


project_samples = Table(
    "project_samples",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("biomechanical_test_projects.id", ondelete="CASCADE"), primary_key=True),
    Column("sample_id", Integer, ForeignKey("shoe_samples.id", ondelete="CASCADE"), primary_key=True),
    Column("created_at", DateTime, server_default=func.now()),
)


project_participants = Table(
    "project_participants",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("biomechanical_test_projects.id", ondelete="CASCADE"), primary_key=True),
    Column("participant_id", Integer, ForeignKey("participants.id", ondelete="CASCADE"), primary_key=True),
    Column("created_at", DateTime, server_default=func.now()),
)

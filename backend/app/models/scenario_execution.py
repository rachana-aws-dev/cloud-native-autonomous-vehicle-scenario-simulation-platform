from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database.db import Base


class ScenarioExecution(Base):

    __tablename__ = "scenario_executions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    scenario_id = Column(
        Integer,
        nullable=False
    )

    scenario_name = Column(
        String(100),
        nullable=False
    )

    status = Column(
        String(30),
        default="REQUESTED"
    )

    pass_kpi = Column(
        Integer,
        nullable=True
    )

    fail_kpi = Column(
        Integer,
        nullable=True
    )

    overall = Column(
        String(20),
        nullable=True
    )

    result_path = Column(
        String(500),
        nullable=True
    )

    error_message = Column(
        String(2000),
        nullable=True
    )

    started_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
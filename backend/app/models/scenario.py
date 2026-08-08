from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database.db import Base


class Scenario(Base):

    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)

    scenario_name = Column(String(100), unique=True, nullable=False)

    scenario_type = Column(String(50), nullable=False)

    weather = Column(String(50), nullable=False)

    road_type = Column(String(50), nullable=False)

    simulation_time = Column(Integer, nullable=False)

    vehicle_speed = Column(Integer, nullable=False)

    pedestrians = Column(Integer, nullable=False)

    vehicles = Column(Integer, nullable=False)

    priority = Column(String(20), nullable=False)

    status = Column(String(20), default="Created")

    json_path = Column(String(255))

    created_by = Column(String(50))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
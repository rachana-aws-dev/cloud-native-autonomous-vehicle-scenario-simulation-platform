from pydantic import BaseModel


class ScenarioCreate(BaseModel):

    scenario_name: str

    scenario_type: str

    weather: str

    road_type: str

    simulation_time: int

    vehicle_speed: int

    pedestrians: int

    vehicles: int

    priority: str

    created_by: str
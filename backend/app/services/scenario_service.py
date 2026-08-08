import json
import os
import re

from sqlalchemy.orm import Session

from app.models.scenario import Scenario


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )
    )
)

INPUT_DIRECTORY = os.path.join(
    BASE_DIR,
    "simulation_engine",
    "scenario_inputs"
)

os.makedirs(
    INPUT_DIRECTORY,
    exist_ok=True
)


def create_scenario(db: Session, scenario):

    db_scenario = Scenario(

        scenario_name=scenario.scenario_name,

        scenario_type=scenario.scenario_type,

        weather=scenario.weather,

        road_type=scenario.road_type,

        simulation_time=scenario.simulation_time,

        vehicle_speed=scenario.vehicle_speed,

        pedestrians=scenario.pedestrians,

        vehicles=scenario.vehicles,

        priority=scenario.priority,

        created_by=scenario.created_by

    )

    db.add(db_scenario)

    db.commit()

    db.refresh(db_scenario)

    safe_filename = re.sub(

        r'[^a-zA-Z0-9_-]',

        "_",

        db_scenario.scenario_name

    )

    json_file = os.path.join(

        INPUT_DIRECTORY,

        f"{safe_filename}.json"

    )

    data = {

        "scenario_id": db_scenario.id,

        "scenario_name": db_scenario.scenario_name,

        "scenario_type": db_scenario.scenario_type,

        "weather": db_scenario.weather,

        "road_type": db_scenario.road_type,

        "simulation_time": db_scenario.simulation_time,

        "vehicle_speed": db_scenario.vehicle_speed,

        "pedestrians": db_scenario.pedestrians,

        "vehicles": db_scenario.vehicles,

        "priority": db_scenario.priority,

        "created_by": db_scenario.created_by

    }

    with open(

        json_file,

        "w"

    ) as file:

        json.dump(

            data,

            file,

            indent=4

        )

    db_scenario.json_path = os.path.relpath(

        json_file,

        BASE_DIR

    )

    db.commit()

    db.refresh(db_scenario)

    return db_scenario


def get_all_scenarios(db: Session):

    return (

        db.query(Scenario)

        .order_by(

            Scenario.id.desc()

        )

        .all()

    )
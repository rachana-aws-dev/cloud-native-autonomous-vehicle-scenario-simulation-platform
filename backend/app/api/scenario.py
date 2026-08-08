from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.schemas.scenario import ScenarioCreate

from app.services.scenario_service import create_scenario


router = APIRouter(

    prefix="/scenario",

    tags=["Scenario"]

)


@router.post("/create")

def create(

    scenario: ScenarioCreate,

    db: Session = Depends(get_db)

):

    return create_scenario(db, scenario)

from app.services.scenario_service import (
    create_scenario,
    get_all_scenarios
)

@router.get("/all")
def get_all(

    db: Session = Depends(get_db)

):

    return get_all_scenarios(db)
from pathlib import Path

from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import BackgroundTasks

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database.db import get_db

from app.models.scenario import Scenario

from app.models.scenario_execution import ScenarioExecution

from app.services.execution_service import execute_scenario


router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"]
)


class SimulationRequest(BaseModel):

    scenario_ids: List[int]


@router.post("/run")
def run_simulation(

    request: SimulationRequest,

    background_tasks: BackgroundTasks,

    db: Session = Depends(get_db)

):

    if not request.scenario_ids:

        raise HTTPException(
            status_code=400,
            detail="Please select at least one scenario."
        )

    scenarios = (

        db.query(Scenario)

        .filter(
            Scenario.id.in_(
                request.scenario_ids
            )
        )

        .all()

    )

    if not scenarios:

        raise HTTPException(
            status_code=404,
            detail="No selected scenarios were found."
        )

    found_ids = {

        scenario.id

        for scenario in scenarios

    }

    missing_ids = [

        scenario_id

        for scenario_id in request.scenario_ids

        if scenario_id not in found_ids

    ]

    if missing_ids:

        raise HTTPException(

            status_code=404,

            detail=f"Scenario(s) not found: {missing_ids}"

        )

    executions = []

    for scenario in scenarios:

        if not scenario.json_path:

            raise HTTPException(

                status_code=400,

                detail=(
                    f"No JSON input found for "
                    f"scenario '{scenario.scenario_name}'."
                )

            )

        json_filename = Path(
            scenario.json_path
        ).name

        execution = ScenarioExecution(

            scenario_id=scenario.id,

            scenario_name=scenario.scenario_name,

            status="REQUESTED"

        )

        db.add(execution)

        db.flush()

        executions.append({

            "execution_id": execution.id,

            "scenario_id": scenario.id,

            "scenario_name": scenario.scenario_name,

            "status": "REQUESTED"

        })

        background_tasks.add_task(

            execute_scenario,

            execution.id,

            scenario.id,

            scenario.scenario_name,

            json_filename

        )

    db.commit()

    return {

        "message": "Simulation request submitted.",

        "scenario_count": len(executions),

        "executions": executions

    }


@router.get("/executions")
def get_execution_history(

    db: Session = Depends(get_db)

):

    executions = (

        db.query(ScenarioExecution)

        .order_by(

            ScenarioExecution.id.desc()

        )

        .all()

    )

    return [

        {

            "id": execution.id,

            "scenario_id": execution.scenario_id,

            "scenario_name": execution.scenario_name,

            "status": execution.status,

            "pass_kpi": execution.pass_kpi,

            "fail_kpi": execution.fail_kpi,

            "overall": execution.overall,

            "result_path": execution.result_path,

            "error_message": execution.error_message,

            "started_at": execution.started_at,

            "completed_at": execution.completed_at,

            "created_at": execution.created_at

        }

        for execution in executions

    ]
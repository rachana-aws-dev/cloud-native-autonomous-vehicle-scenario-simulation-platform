import json
import subprocess
from datetime import datetime
from pathlib import Path

from app.database.db import SessionLocal
from app.models.scenario_execution import ScenarioExecution


# Absolute path to the simulation engine
PROJECT_ROOT = Path(__file__).resolve().parents[3]

SIMULATION_ENGINE = PROJECT_ROOT / "simulation_engine"

SCENARIO_INPUTS = SIMULATION_ENGINE / "scenario_inputs"
SIMULATION_RESULTS = SIMULATION_ENGINE / "simulation_results"

DOCKER_IMAGE = "autonomous-vehicle-simulation:1.0"


def execute_scenario(
    execution_id: int,
    scenario_id: int,
    scenario_name: str,
    json_filename: str
):
    db = SessionLocal()

    execution = None

    try:
        # -------------------------------------------------
        # 1. Find execution record
        # -------------------------------------------------

        execution = (
            db.query(ScenarioExecution)
            .filter(
                ScenarioExecution.id == execution_id
            )
            .first()
        )

        if not execution:
            print(
                f"Execution {execution_id} not found"
            )
            return

        # -------------------------------------------------
        # 2. Mark execution as RUNNING
        # -------------------------------------------------

        execution.status = "RUNNING"
        execution.started_at = datetime.now()

        db.commit()

        print(
            f"Starting simulation "
            f"execution={execution_id} "
            f"scenario={scenario_name}"
        )

        # -------------------------------------------------
        # 3. Verify scenario input exists
        # -------------------------------------------------

        scenario_file = SCENARIO_INPUTS / json_filename

        if not scenario_file.exists():

            raise FileNotFoundError(
                f"Scenario file not found: {scenario_file}"
            )

        print(
            f"Scenario input: {scenario_file}"
        )

        # -------------------------------------------------
        # 4. Create temporary execution directory
        # -------------------------------------------------

        execution_dir = (
            SIMULATION_ENGINE
            / "execution_workspace"
            / str(execution_id)
        )

        execution_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        # -------------------------------------------------
        # 5. Run Docker container
        # -------------------------------------------------

        command = [
            "docker",
            "run",
            "--rm",

            "-v",
            f"{SIMULATION_RESULTS}:/simulation_engine/simulation_results",

            "-v",
            f"{SCENARIO_INPUTS}:/simulation_engine/scenario_inputs",

            DOCKER_IMAGE,

            "python",
            "simulate.py",
            f"/simulation_engine/scenario_inputs/{json_filename}"
        ]

        print(
            "Running Docker command:"
        )

        print(
            " ".join(command)
        )

        result = subprocess.run(
            command,
            capture_output=True,
            text=True
        )

        # -------------------------------------------------
        # 6. Print Docker output
        # -------------------------------------------------

        print(
            "Docker stdout:"
        )

        print(result.stdout)

        print(
            "Docker stderr:"
        )

        print(result.stderr)

        # -------------------------------------------------
        # 7. Check Docker execution
        # -------------------------------------------------

        if result.returncode != 0:

            raise RuntimeError(
                "Docker simulation failed:\n"
                + result.stderr
            )

        # -------------------------------------------------
        # 8. Locate simulation result
        # -------------------------------------------------

        result_file = (
            SIMULATION_RESULTS
            / f"{scenario_name}_result.json"
        )

        if not result_file.exists():

            raise FileNotFoundError(
                f"Simulation result was not created: "
                f"{result_file}"
            )

        # -------------------------------------------------
        # 9. Read simulation result
        # -------------------------------------------------

        with open(
            result_file,
            "r"
        ) as file:

            simulation_result = json.load(file)

        kpi_result = simulation_result.get(
            "kpi_result",
            {}
        )

        pass_count = kpi_result.get(
            "pass_count",
            0
        )

        fail_count = kpi_result.get(
            "fail_count",
            0
        )

        overall = kpi_result.get(
            "overall"
        )

        # -------------------------------------------------
        # 10. Update execution record
        # -------------------------------------------------

        execution.status = "COMPLETED"

        execution.pass_kpi = pass_count
        execution.fail_kpi = fail_count
        execution.overall = overall

        execution.result_path = str(
            result_file
        )

        execution.completed_at = datetime.now()

        execution.error_message = None

        db.commit()

        print(
            f"Simulation completed successfully "
            f"for execution {execution_id}"
        )

    except Exception as error:

        print(
            f"Simulation failed "
            f"for execution {execution_id}: "
            f"{error}"
        )

        if execution:

            execution.status = "FAILED"

            execution.error_message = str(
                error
            )

            execution.completed_at = datetime.now()

            db.commit()

    finally:

        db.close()
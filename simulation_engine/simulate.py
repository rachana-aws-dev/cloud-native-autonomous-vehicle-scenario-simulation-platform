import json
import os
import sys
from datetime import datetime

from config import OUTPUT_FOLDER
from simulator import run_simulation
from kpi_engine import evaluate_kpis


def main():

    if len(sys.argv) < 2:

        print("Usage:")

        print("python simulate.py scenario.json")

        return

    scenario_file = sys.argv[1]

    with open(scenario_file, "r") as file:

        scenario = json.load(file)

    simulation_data = run_simulation(scenario)

    kpi_result = evaluate_kpis(simulation_data)

    final_result = {

        "scenario_name": scenario["scenario_name"],

        "status": "Completed",

        "executed_at": str(datetime.now()),

        "simulation_data": simulation_data,

        "kpi_result": kpi_result

    }

    output_file = os.path.join(

        OUTPUT_FOLDER,

        scenario["scenario_name"] + "_result.json"

    )

    with open(output_file, "w") as outfile:

        json.dump(final_result, outfile, indent=4)

    print()

    print("Simulation Completed Successfully")

    print("Result Stored At")

    print(output_file)


if __name__ == "__main__":

    main()
import random
import time

def run_simulation(scenario):

    print("Simulation Started...")

    time.sleep(5)

    simulation_output = {

        "scenario_name": scenario["scenario_name"],

        "vehicle_speed": scenario["vehicle_speed"],

        "collisions": random.randint(0,1),

        "lane_departures": random.randint(0,3),

        "traffic_signal": random.choice([True,True,True,False]),

        "object_detection": random.randint(90,100),

        "emergency_brake": random.choice([True,True,False])

    }

    print("Simulation Finished")

    return simulation_output
def evaluate_kpis(simulation_data):

    pass_count = 0
    fail_count = 0

    kpis = {}

    # Collision KPI
    if simulation_data["collisions"] == 0:
        kpis["Collision"] = "PASS"
        pass_count += 1
    else:
        kpis["Collision"] = "FAIL"
        fail_count += 1

    # Lane Departure KPI
    if simulation_data["lane_departures"] <= 2:
        kpis["Lane Departure"] = "PASS"
        pass_count += 1
    else:
        kpis["Lane Departure"] = "FAIL"
        fail_count += 1

    # Speed KPI
    if simulation_data["vehicle_speed"] <= 50:
        kpis["Speed Limit"] = "PASS"
        pass_count += 1
    else:
        kpis["Speed Limit"] = "FAIL"
        fail_count += 1

    # Traffic Signal
    if simulation_data["traffic_signal"]:
        kpis["Traffic Signal"] = "PASS"
        pass_count += 1
    else:
        kpis["Traffic Signal"] = "FAIL"
        fail_count += 1

    # Object Detection
    if simulation_data["object_detection"] >= 95:
        kpis["Object Detection"] = "PASS"
        pass_count += 1
    else:
        kpis["Object Detection"] = "FAIL"
        fail_count += 1

    # Emergency Brake
    if simulation_data["emergency_brake"]:
        kpis["Emergency Brake"] = "PASS"
        pass_count += 1
    else:
        kpis["Emergency Brake"] = "FAIL"
        fail_count += 1

    overall = "GOOD" if pass_count >= 4 else "BAD"

    return {

        "kpis": kpis,

        "pass_count": pass_count,

        "fail_count": fail_count,

        "overall": overall

    }
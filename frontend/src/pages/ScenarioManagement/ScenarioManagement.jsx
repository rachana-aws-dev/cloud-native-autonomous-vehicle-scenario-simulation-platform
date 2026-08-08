import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ScenarioManagement() {

    const navigate = useNavigate();

    const [scenarioName, setScenarioName] = useState("");
    const [scenarioType, setScenarioType] = useState("Open Loop");
    const [weather, setWeather] = useState("Sunny");
    const [roadType, setRoadType] = useState("City");
    const [simulationTime, setSimulationTime] = useState(60);
    const [vehicleSpeed, setVehicleSpeed] = useState(50);
    const [pedestrians, setPedestrians] = useState(10);
    const [vehicles, setVehicles] = useState(20);
    const [priority, setPriority] = useState("Medium");

    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadScenarios();
    }, []);

    async function loadScenarios() {

        try {

            const response = await api.get("/scenario/all");

            setHistory(response.data);

        }

        catch (error) {

            console.log(error);

        }

    }

    async function createScenario(e) {

        e.preventDefault();

        const username = localStorage.getItem("username");

        try {

            await api.post("/scenario/create",{

                scenario_name:scenarioName,
                scenario_type:scenarioType,
                weather:weather,
                road_type:roadType,
                simulation_time:Number(simulationTime),
                vehicle_speed:Number(vehicleSpeed),
                pedestrians:Number(pedestrians),
                vehicles:Number(vehicles),
                priority:priority,
                created_by:username

            });

            alert("Scenario Created Successfully");

            setScenarioName("");

            loadScenarios();

        }

        catch(error){

            console.log(error);

        }

    }

    return(

        <div
            style={{
                width:"900px",
                margin:"30px auto",
                background:"white",
                padding:"30px",
                borderRadius:"10px",
                boxShadow:"0px 0px 10px lightgray"
            }}
        >

            <h1>Scenario Management</h1>

            <hr/>

            <form onSubmit={createScenario}>

                <p>Scenario Name</p>

                <input
                    style={{width:"100%",padding:"10px"}}
                    value={scenarioName}
                    onChange={(e)=>setScenarioName(e.target.value)}
                />

                <p>Scenario Type</p>

                <select
                    value={scenarioType}
                    onChange={(e)=>setScenarioType(e.target.value)}
                >

                    <option>Open Loop</option>
                    <option>Closed Loop</option>

                </select>

                <p>Weather</p>

                <select
                    value={weather}
                    onChange={(e)=>setWeather(e.target.value)}
                >

                    <option>Sunny</option>
                    <option>Rain</option>
                    <option>Fog</option>
                    <option>Snow</option>

                </select>

                <p>Road Type</p>

                <select
                    value={roadType}
                    onChange={(e)=>setRoadType(e.target.value)}
                >

                    <option>City</option>
                    <option>Highway</option>
                    <option>Roundabout</option>

                </select>

                <p>Simulation Time</p>

                <input
                    type="number"
                    value={simulationTime}
                    onChange={(e)=>setSimulationTime(e.target.value)}
                />

                <p>Vehicle Speed</p>

                <input
                    type="number"
                    value={vehicleSpeed}
                    onChange={(e)=>setVehicleSpeed(e.target.value)}
                />

                <p>Pedestrians</p>

                <input
                    type="number"
                    value={pedestrians}
                    onChange={(e)=>setPedestrians(e.target.value)}
                />

                <p>Vehicles</p>

                <input
                    type="number"
                    value={vehicles}
                    onChange={(e)=>setVehicles(e.target.value)}
                />

                <p>Priority</p>

                <select
                    value={priority}
                    onChange={(e)=>setPriority(e.target.value)}
                >

                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>

                </select>

                <br/><br/>

                <button>

                    Create Scenario

                </button>

            </form>

            <hr/>

            <h2>Scenario History</h2>

            <table
                border="1"
                cellPadding="10"
                style={{
                    width:"100%",
                    borderCollapse:"collapse"
                }}
            >

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Weather</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created By</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        history.map((scenario)=>(

                            <tr key={scenario.id}>

                                <td>{scenario.id}</td>
                                <td>{scenario.scenario_name}</td>
                                <td>{scenario.weather}</td>
                                <td>{scenario.scenario_type}</td>
                                <td>{scenario.status}</td>
                                <td>{scenario.created_by}</td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            <br/>

            <button

                style={{
                    width:"100%",
                    padding:"15px",
                    fontSize:"18px",
                    cursor:"pointer"
                }}

                onClick={()=>navigate("/SimulationDashboard")}

            >

                Proceed To Simulation Dashboard →

            </button>

        </div>

    );

}

export default ScenarioManagement;
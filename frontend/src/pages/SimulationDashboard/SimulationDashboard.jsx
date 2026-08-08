import { useEffect, useRef, useState } from "react";
import api from "../../services/api";

function SimulationDashboard() {
    const [scenarios, setScenarios] = useState([]);
    const [selectedScenarios, setSelectedScenarios] = useState([]);

    const [loading, setLoading] = useState(false);
    const [running, setRunning] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [executionHistory, setExecutionHistory] = useState([]);

    const pollingRef = useRef(null);


    // ---------------------------------------------------------
    // Load scenarios
    // ---------------------------------------------------------

    async function loadScenarios() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/scenario/all");

            setScenarios(response.data);

        } catch (err) {
            console.error(
                "Error loading scenarios:",
                err
            );

            console.error(
                "Backend response:",
                err.response?.data
            );

            setError(
                "Unable to load scenarios from backend."
            );

        } finally {
            setLoading(false);
        }
    }


    // ---------------------------------------------------------
    // Load execution history from database
    // ---------------------------------------------------------

    async function loadExecutionHistory() {
        try {
            const response = await api.get(
                "/simulation/executions"
            );

            console.log(
                "Execution history:",
                response.data
            );

            setExecutionHistory(
                response.data
            );

            return response.data;

        } catch (err) {
            console.error(
                "Error loading execution history:",
                err
            );

            console.error(
                "Backend response:",
                err.response?.data
            );

            return [];
        }
    }


    // ---------------------------------------------------------
    // Start polling
    // ---------------------------------------------------------

    function startPolling() {

        // Clear existing polling first
        if (pollingRef.current) {
            clearInterval(
                pollingRef.current
            );
        }

        pollingRef.current = setInterval(
            async () => {

                const executions =
                    await loadExecutionHistory();

                const activeExecutions =
                    executions.filter(
                        execution =>
                            execution.status === "REQUESTED" ||
                            execution.status === "RUNNING"
                    );

                console.log(
                    "Active executions:",
                    activeExecutions
                );

                // Stop polling when everything is completed
                if (
                    activeExecutions.length === 0
                ) {
                    clearInterval(
                        pollingRef.current
                    );

                    pollingRef.current = null;

                    setRunning(false);

                    console.log(
                        "All simulations completed."
                    );
                }

            },
            1000
        );
    }


    // ---------------------------------------------------------
    // Initial page load
    // ---------------------------------------------------------

    useEffect(() => {

        loadScenarios();

        loadExecutionHistory();

        return () => {

            if (pollingRef.current) {
                clearInterval(
                    pollingRef.current
                );
            }

        };

    }, []);


    // ---------------------------------------------------------
    // Handle scenario checkbox
    // ---------------------------------------------------------

    function handleSelection(id) {

        setMessage("");
        setError("");

        if (
            selectedScenarios.includes(id)
        ) {

            setSelectedScenarios(
                selectedScenarios.filter(
                    item => item !== id
                )
            );

        } else {

            setSelectedScenarios(
                [
                    ...selectedScenarios,
                    id
                ]
            );

        }
    }


    // ---------------------------------------------------------
    // Run simulation
    // ---------------------------------------------------------

    async function runSimulation() {

        setMessage("");
        setError("");

        if (
            selectedScenarios.length === 0
        ) {

            setError(
                "Please select at least one scenario."
            );

            return;
        }


        try {

            setRunning(true);

            const response =
                await api.post(
                    "/simulation/run",
                    {
                        scenario_ids:
                            selectedScenarios
                    }
                );


            console.log(
                "Simulation response:",
                response.data
            );


            setMessage(
                response.data.message
            );


            /*
             * IMPORTANT:
             *
             * Backend returns:
             *
             * response.data.executions
             *
             * NOT:
             *
             * response.data.scenarios
             *
             */


            // Immediately load records from database
            await loadExecutionHistory();


            // Start polling because simulation
            // runs in BackgroundTasks
            startPolling();


            // Clear selected scenarios
            setSelectedScenarios([]);


        } catch (err) {

            console.error(
                "Error starting simulation:",
                err
            );

            console.error(
                "Backend response:",
                err.response?.data
            );


            if (
                err.response &&
                err.response.data &&
                err.response.data.detail
            ) {

                setError(
                    err.response.data.detail
                );

            } else {

                setError(
                    "Unable to start simulation."
                );
            }

            setRunning(false);
        }
    }


    // ---------------------------------------------------------
    // Summary calculations
    // ---------------------------------------------------------

    const totalScenarios =
        scenarios.length;


    const runningCount =
        executionHistory.filter(
            item =>
                item.status === "RUNNING" ||
                item.status === "REQUESTED"
        ).length;


    const passedCount =
        executionHistory.filter(
            item =>
                item.overall === "GOOD" ||
                item.overall === "PASS" ||
                item.overall === "PASSED"
        ).length;


    const failedCount =
        executionHistory.filter(
            item =>
                item.overall === "BAD" ||
                item.overall === "FAIL" ||
                item.overall === "FAILED"
        ).length;


    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------

    return (
        <div
            style={{
                width: "1100px",
                margin: "30px auto",
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow:
                    "0px 0px 10px lightgray"
            }}
        >

            <h1>
                Simulation Dashboard
            </h1>

            <hr />


            {/* Success message */}

            {
                message && (
                    <div
                        style={{
                            padding: "15px",
                            marginBottom: "20px",
                            background: "#e8f5e9",
                            border:
                                "1px solid #4caf50",
                            borderRadius: "5px"
                        }}
                    >
                        {message}
                    </div>
                )
            }


            {/* Error message */}

            {
                error && (
                    <div
                        style={{
                            padding: "15px",
                            marginBottom: "20px",
                            background: "#ffebee",
                            border:
                                "1px solid #f44336",
                            borderRadius: "5px"
                        }}
                    >
                        {error}
                    </div>
                )
            }


            {/* ------------------------------------------------
                Simulation Queue
            ------------------------------------------------ */}

            <h2>
                Simulation Queue
            </h2>


            {
                loading ? (

                    <p>
                        Loading scenarios...
                    </p>

                ) : scenarios.length === 0 ? (

                    <p>
                        No scenarios available.
                    </p>

                ) : (

                    <table
                        border="1"
                        cellPadding="10"
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th>
                                    Select
                                </th>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Scenario
                                </th>

                                <th>
                                    Weather
                                </th>

                                <th>
                                    Priority
                                </th>

                                <th>
                                    Created By
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {
                                scenarios.map(
                                    scenario => (

                                        <tr
                                            key={
                                                scenario.id
                                            }
                                        >

                                            <td>

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedScenarios.includes(
                                                            scenario.id
                                                        )
                                                    }
                                                    onChange={() =>
                                                        handleSelection(
                                                            scenario.id
                                                        )
                                                    }
                                                />

                                            </td>


                                            <td>
                                                {
                                                    scenario.id
                                                }
                                            </td>


                                            <td>
                                                {
                                                    scenario.scenario_name
                                                }
                                            </td>


                                            <td>
                                                {
                                                    scenario.weather
                                                }
                                            </td>


                                            <td>
                                                {
                                                    scenario.priority
                                                }
                                            </td>


                                            <td>
                                                {
                                                    scenario.created_by
                                                }
                                            </td>

                                        </tr>

                                    )
                                )
                            }

                        </tbody>

                    </table>
                )
            }


            <br />


            {/* Run button */}

            <button
                onClick={runSimulation}
                disabled={
                    running ||
                    selectedScenarios.length === 0
                }
                style={{
                    width: "100%",
                    padding: "15px",
                    fontSize: "18px",
                    cursor:
                        running ||
                        selectedScenarios.length === 0
                            ? "not-allowed"
                            : "pointer",
                    opacity:
                        running ||
                        selectedScenarios.length === 0
                            ? 0.6
                            : 1
                }}
            >

                {
                    running
                        ? "Running Simulation..."
                        : "Run Simulation"
                }

            </button>


            <hr />


            {/* ------------------------------------------------
                Simulation Summary
            ------------------------------------------------ */}

            <h2>
                Simulation Summary
            </h2>


            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent:
                        "space-between"
                }}
            >

                {/* Total */}

                <div
                    style={{
                        flex: 1,
                        background: "#f3f3f3",
                        padding: "20px",
                        textAlign: "center"
                    }}
                >

                    <h3>
                        Total
                    </h3>

                    <h1>
                        {totalScenarios}
                    </h1>

                </div>


                {/* Running */}

                <div
                    style={{
                        flex: 1,
                        background: "#f3f3f3",
                        padding: "20px",
                        textAlign: "center"
                    }}
                >

                    <h3>
                        Running
                    </h3>

                    <h1>
                        {runningCount}
                    </h1>

                </div>


                {/* Passed */}

                <div
                    style={{
                        flex: 1,
                        background: "#f3f3f3",
                        padding: "20px",
                        textAlign: "center"
                    }}
                >

                    <h3>
                        Passed
                    </h3>

                    <h1>
                        {passedCount}
                    </h1>

                </div>


                {/* Failed */}

                <div
                    style={{
                        flex: 1,
                        background: "#f3f3f3",
                        padding: "20px",
                        textAlign: "center"
                    }}
                >

                    <h3>
                        Failed
                    </h3>

                    <h1>
                        {failedCount}
                    </h1>

                </div>

            </div>


            <hr />


            {/* ------------------------------------------------
                Execution History
            ------------------------------------------------ */}

            <h2>
                Execution History
            </h2>


            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    borderCollapse:
                        "collapse"
                }}
            >

                <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Scenario
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Pass KPI
                        </th>

                        <th>
                            Fail KPI
                        </th>

                        <th>
                            Overall
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {
                        executionHistory.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign:
                                            "center"
                                    }}
                                >
                                    No simulations executed yet.
                                </td>

                            </tr>

                        ) : (

                            executionHistory.map(
                                execution => (

                                    <tr
                                        key={
                                            execution.id
                                        }
                                    >

                                        <td>
                                            {
                                                execution.id
                                            }
                                        </td>


                                        <td>
                                            {
                                                execution.scenario_name
                                            }
                                        </td>


                                        <td>
                                            {
                                                execution.status
                                            }
                                        </td>


                                        <td>
                                            {
                                                execution.pass_kpi ??
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                execution.fail_kpi ??
                                                "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                execution.overall ??
                                                "-"
                                            }
                                        </td>

                                    </tr>

                                )
                            )

                        )
                    }

                </tbody>

            </table>

        </div>
    );
}

export default SimulationDashboard;
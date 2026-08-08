import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";

import Register from "./pages/Register/Register";

import ScenarioManagement from "./pages/ScenarioManagement/ScenarioManagement";


import SimulationDashboard from "./pages/SimulationDashboard/SimulationDashboard";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login/>}
                />

                <Route
                    path="/register"
                    element={<Register/>}
                />

                <Route
                    path="/ScenarioManagement"
                    element={<ScenarioManagement/>}
                />

                <Route
                    path="/SimulationDashboard"
                    element={<SimulationDashboard/>}
                />

            </Routes>

        </BrowserRouter>

    );

}



export default App;
from fastapi import FastAPI

from app.database.db import Base, engine

from app.models.user import User

from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.models.scenario import Scenario
from app.api.scenario import router as scenario_router
from app.api.simulation import router as simulation_router

from app.models.scenario import Scenario
from app.models.scenario_execution import ScenarioExecution

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Cloud Native Autonomous Vehicle Scenario Simulation Platform",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(scenario_router)
app.include_router(simulation_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "application": "Cloud Native Autonomous Vehicle Scenario Simulation Platform",
        "status": "Running"
    }
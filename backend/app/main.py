from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os, traceback
from fastapi import Request
from fastapi.responses import JSONResponse

from .core.config import PROJECT_NAME, VERSION, API_V1_PREFIX
from .core.database import init_db, engine

from .models import (
    User, Task, BiomechanicalTestProject, ShoeSample,
    SampleTransaction, Participant, BiomechanicalTestData, TestFile,
)

from .api import metrics, analysis_api, reports, tasks, projects, samples, participants, test_data, files, dashboard, sessions, trials, protocols, equipment_api


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await engine.dispose()


app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    lifespan=lifespan,
)

@app.exception_handler(Exception)
async def global_exc_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "traceback": traceback.format_exc()},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix=f"{API_V1_PREFIX}/tasks", tags=["Tasks"])
app.include_router(projects.router, prefix=f"{API_V1_PREFIX}/projects", tags=["Projects"])
app.include_router(samples.router, prefix=f"{API_V1_PREFIX}/samples", tags=["Samples"])
app.include_router(participants.router, prefix=f"{API_V1_PREFIX}/participants", tags=["Participants"])
app.include_router(test_data.router, prefix=f"{API_V1_PREFIX}/test-data", tags=["Test Data"])
app.include_router(files.router, prefix=f"{API_V1_PREFIX}/files", tags=["Files"])
app.include_router(dashboard.router, prefix=f"{API_V1_PREFIX}/dashboard", tags=["Dashboard"])
app.include_router(sessions.router, prefix=f"{API_V1_PREFIX}/sessions", tags=["Sessions"])
app.include_router(trials.router, prefix=f"{API_V1_PREFIX}/trials", tags=["Trials"])
app.include_router(protocols.router, prefix=f"{API_V1_PREFIX}/protocols", tags=["Protocols"])
app.include_router(reports.router, prefix=f"{API_V1_PREFIX}/reports", tags=["Reports"])
app.include_router(metrics.router, prefix=f"{API_V1_PREFIX}/metrics", tags=["Metrics"])
app.include_router(analysis_api.router, prefix=f"{API_V1_PREFIX}/analysis", tags=["Analysis"])
app.include_router(equipment_api.router, prefix=f"{API_V1_PREFIX}/equipment", tags=["Equipment"])

@app.get(f"{API_V1_PREFIX}/health")
async def health_check():
    return {"status": "ok", "version": VERSION}

_static = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
_assets = os.path.join(_static, "assets")

if os.path.exists(_assets):
    app.mount("/assets", StaticFiles(directory=_assets), name="assets")

@app.get("/favicon.svg")
async def favicon():
    return FileResponse(os.path.join(_static, "favicon.svg"))

@app.get("/{full_path:path}")
async def spa_fallback(full_path: str):
    from fastapi.responses import RedirectResponse
    if full_path.startswith("api/") and not full_path.endswith("/"):
        return RedirectResponse(url="/" + full_path + "/")
    idx = os.path.join(_static, "index.html")
    if os.path.exists(idx):
        return FileResponse(idx, media_type="text/html")
    return {"error": "Frontend not built"}

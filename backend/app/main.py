"""
Intent-to-Interface: Adaptive AI Workspace - Backend Application
Tagline: "An interface that adapts to your intent, not the other way around."
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import get_database, get_client
from app.models.models import (
    PROFILES, PROJECT_TASKS, USER_PREFERENCES,
    new_profile, new_project_task, new_user_preference
)
from app.demo_data import INITIAL_PROJECT_TASKS
from app.api.endpoints import router as api_router


# ── Seed initial data into MongoDB ───────────────────────────────────────────
def seed_initial_data():
    try:
        db = get_database()

        # Seed demo profile
        if not db[PROFILES].find_one({"_id": "demo_user"}):
            db[PROFILES].insert_one(new_profile(_id="demo_user"))

        # Seed project tasks
        if db[PROJECT_TASKS].count_documents({}) == 0:
            for item in INITIAL_PROJECT_TASKS:
                doc = new_project_task(
                    title=item["title"],
                    status=item.get("status", "todo"),
                    priority=item.get("priority", "medium"),
                    due_date=item.get("due_date", ""),
                    project_name=item.get("project_name", "Nova Core Platform"),
                )
                db[PROJECT_TASKS].insert_one(doc)

        # Seed user preferences
        if not db[USER_PREFERENCES].find_one({"user_id": "demo_user"}):
            db[USER_PREFERENCES].insert_one(new_user_preference(user_id="demo_user"))

    except Exception as e:
        print(f"Warning: could not seed initial data: {e}")


seed_initial_data()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Intent-to-Interface: Adaptive AI Workspace.",
    version=settings.VERSION,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Application status and welcome message."""
    return {
        "app": settings.PROJECT_NAME,
        "tagline": settings.PROJECT_TAGLINE,
        "version": settings.VERSION,
        "status": "online",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "intent_analysis": "/api/intent/analyze",
            "workspace_generation": "/api/workspace/generate",
            "default_workspace": "/api/workspace/default",
            "tasks": "/api/tasks",
            "history": "/api/history",
            "preferences": "/api/preferences",
            "demo_analytics": "/api/demo/analytics",
            "demo_projects": "/api/demo/projects",
        },
    }


@app.get("/health")
def health_check():
    """Health status check — pings MongoDB to confirm connectivity."""
    try:
        client = get_client()
        client.admin.command("ping")
        db_status = f"connected (MongoDB · {settings.MONGODB_DB_NAME})"
        healthy = True
    except Exception as e:
        db_status = f"error: {e}"
        healthy = False

    return {
        "status": "ok" if healthy else "degraded",
        "healthy": healthy,
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "ai_engine": "Deterministic Rule-Based & Semantic Scorer (Active)",
    }


# ── API routes ────────────────────────────────────────────────────────────────
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

"""
Intent-to-Interface: Adaptive AI Workspace - Backend Application
Tagline: "An interface that adapts to your intent, not the other way around."
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.models.models import ProjectTask, UserPreference
from app.demo_data import INITIAL_PROJECT_TASKS
from app.api.endpoints import router as api_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Seed initial project tasks and default preferences if not existing
def seed_initial_data():
    db = SessionLocal()
    try:
        task_count = db.query(ProjectTask).count()
        if task_count == 0:
            for item in INITIAL_PROJECT_TASKS:
                db.add(ProjectTask(**item))
            db.commit()

        pref = db.query(UserPreference).filter(UserPreference.user_id == "demo_user").first()
        if not pref:
            db.add(UserPreference(
                user_id="demo_user",
                theme="light",
                preferred_widgets="[]",
                layout_preferences="{}"
            ))
            db.commit()
    except Exception as e:
        db.rollback()
        print(f"Warning: could not seed initial database data: {e}")
    finally:
        db.close()

seed_initial_data()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Intent-to-Interface: Adaptive AI Workspace. Automatically detects user goal and delivers adaptive component-driven workspace configurations.",
    version=settings.VERSION
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
            "demo_projects": "/api/demo/projects"
        }
    }

@app.get("/health")
def health_check():
    """Health status check."""
    return {
        "status": "ok",
        "healthy": True,
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected (SQLite)",
        "ai_engine": "Deterministic Rule-Based & Semantic Scorer (Active)"
    }

# Include API routes
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

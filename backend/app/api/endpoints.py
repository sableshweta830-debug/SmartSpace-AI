"""
API Endpoints for Intent-to-Interface: Adaptive AI Workspace.
All routes use MongoDB (pymongo) instead of SQLAlchemy.
"""

import json
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.database import Database

from app.database import get_db
from app.models.models import (
    TASKS, WORKSPACE_CONFIGS, USER_PREFERENCES, PROJECT_TASKS,
    new_task, new_workspace_config, new_user_preference, new_project_task,
    generate_uuid, now,
)
from app.schemas.schemas import (
    IntentRequest, IntentResponse,
    WorkspaceGenerateRequest, WorkspaceResponse,
    TaskCreate, TaskUpdate, TaskOut,
    HistoryItem, PreferenceUpdate, PreferenceOut,
    ProjectTaskUpdate, ProjectTaskOut,
    ChatRequest, ChatResponse,
)
from app.services.intent_service import intent_service
from app.services.workspace_service import workspace_service
from app.services.llm_service import llm_service, LLMError
from app.demo_data import (
    DEFAULT_DASHBOARD_DATA,
    PRODUCT_USAGE_DATA,
    PROJECT_REVIEW_DATA,
    INITIAL_PROJECT_TASKS,
)

router = APIRouter()


# ── helpers ───────────────────────────────────────────────────────────────────

def _task_to_out(doc: dict) -> dict:
    """Convert a MongoDB task document to a TaskOut-compatible dict."""
    return {
        "id": doc["_id"],
        "user_id": doc.get("user_id", "demo_user"),
        "title": doc.get("title", ""),
        "original_prompt": doc.get("original_prompt", ""),
        "detected_intent": doc.get("detected_intent", ""),
        "status": doc.get("status", "active"),
        "is_saved": doc.get("is_saved", False),
        "created_at": doc.get("created_at", datetime.utcnow()),
        "updated_at": doc.get("updated_at", datetime.utcnow()),
    }


def _project_task_to_out(doc: dict) -> dict:
    return {
        "id": doc["_id"],
        "project_name": doc.get("project_name", "Nova Core Platform"),
        "title": doc.get("title", ""),
        "status": doc.get("status", "todo"),
        "priority": doc.get("priority", "medium"),
        "due_date": doc.get("due_date", ""),
        "created_at": doc.get("created_at", datetime.utcnow()),
    }


# ── INTENT ────────────────────────────────────────────────────────────────────

@router.post("/intent/analyze", response_model=IntentResponse, tags=["Intent"])
def analyze_intent(req: IntentRequest):
    """Analyze natural language goal to classify user intent."""
    result = intent_service.analyze_intent(req.text)
    return IntentResponse(**result)


# ── WORKSPACE ────────────────────────────────────────────────────────────────

@router.post("/workspace/generate", response_model=WorkspaceResponse, tags=["Workspace"])
def generate_workspace(req: WorkspaceGenerateRequest, db: Database = Depends(get_db)):
    """Generate an adaptive workspace layout and persist to MongoDB."""
    try:
        response = workspace_service.generate_workspace(
            text=req.text, db=db, save_to_history=req.save_to_history
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate workspace: {e}")


@router.get("/workspace/default", tags=["Workspace"])
def get_default_workspace():
    """Return default initial dashboard configuration."""
    return workspace_service.get_default_dashboard()


# ── TASKS ────────────────────────────────────────────────────────────────────

@router.get("/tasks", response_model=List[TaskOut], tags=["Tasks"])
def get_tasks(saved_only: bool = False, db: Database = Depends(get_db)):
    """Return list of tasks from MongoDB."""
    query: dict = {}
    if saved_only:
        query["is_saved"] = True
    docs = list(db[TASKS].find(query).sort("created_at", -1))
    return [_task_to_out(d) for d in docs]


@router.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
def create_task(req: TaskCreate, db: Database = Depends(get_db)):
    """Create and save a task manually."""
    doc = new_task(
        title=req.title,
        original_prompt=req.original_prompt,
        detected_intent=req.detected_intent,
        status=req.status,
    )
    db[TASKS].insert_one(doc)
    return _task_to_out(doc)


@router.get("/tasks/{task_id}", tags=["Tasks"])
def get_task_details(task_id: str, db: Database = Depends(get_db)):
    """Return task details and associated workspace configuration."""
    task = db[TASKS].find_one({"_id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    config_entry = db[WORKSPACE_CONFIGS].find_one({"task_id": task_id})
    config_data = json.loads(config_entry["configuration_json"]) if config_entry else None

    widget_data, _ = workspace_service.get_widget_data_for_intent(task["detected_intent"], db)

    return {
        "task": _task_to_out(task),
        "configuration": config_data,
        "widget_data": widget_data,
    }


@router.patch("/tasks/{task_id}", response_model=TaskOut, tags=["Tasks"])
def update_task(task_id: str, req: TaskUpdate, db: Database = Depends(get_db)):
    """Update task status, saved flag, or title."""
    task = db[TASKS].find_one({"_id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    updates: dict = {"updated_at": now()}
    if req.title is not None:
        updates["title"] = req.title
    if req.status is not None:
        updates["status"] = req.status
    if req.is_saved is not None:
        updates["is_saved"] = req.is_saved

    db[TASKS].update_one({"_id": task_id}, {"$set": updates})
    return _task_to_out({**task, **updates})


@router.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK, tags=["Tasks"])
def delete_task(task_id: str, db: Database = Depends(get_db)):
    """Delete a task and its workspace configuration."""
    task = db[TASKS].find_one({"_id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    db[TASKS].delete_one({"_id": task_id})
    db[WORKSPACE_CONFIGS].delete_many({"task_id": task_id})
    return {"message": f"Task {task_id} deleted successfully", "deleted_id": task_id}


# ── HISTORY ──────────────────────────────────────────────────────────────────

@router.get("/history", response_model=List[HistoryItem], tags=["History"])
def get_task_history(db: Database = Depends(get_db)):
    """Return previous user tasks."""
    docs = list(db[TASKS].find({}).sort("created_at", -1))
    return [_task_to_out(d) for d in docs]


# ── PREFERENCES ──────────────────────────────────────────────────────────────

@router.get("/preferences", response_model=PreferenceOut, tags=["Preferences"])
def get_preferences(db: Database = Depends(get_db)):
    """Return saved workspace preferences."""
    pref = db[USER_PREFERENCES].find_one({"user_id": "demo_user"})
    if not pref:
        pref = new_user_preference()
        db[USER_PREFERENCES].insert_one(pref)

    return PreferenceOut(
        user_id=pref["user_id"],
        theme=pref.get("theme", "light"),
        preferred_widgets=json.loads(pref.get("preferred_widgets", "[]")),
        layout_preferences=json.loads(pref.get("layout_preferences", "{}")),
    )


@router.put("/preferences", response_model=PreferenceOut, tags=["Preferences"])
def update_preferences(req: PreferenceUpdate, db: Database = Depends(get_db)):
    """Save preferences such as theme, preferred widgets, and layout."""
    pref = db[USER_PREFERENCES].find_one({"user_id": "demo_user"})
    if not pref:
        pref = new_user_preference()
        db[USER_PREFERENCES].insert_one(pref)

    updates: dict = {"updated_at": now()}
    if req.theme is not None:
        updates["theme"] = req.theme
    if req.preferred_widgets is not None:
        updates["preferred_widgets"] = json.dumps(req.preferred_widgets)
    if req.layout_preferences is not None:
        updates["layout_preferences"] = json.dumps(req.layout_preferences)

    db[USER_PREFERENCES].update_one({"user_id": "demo_user"}, {"$set": updates})
    updated = {**pref, **updates}

    return PreferenceOut(
        user_id=updated["user_id"],
        theme=updated.get("theme", "light"),
        preferred_widgets=json.loads(updated.get("preferred_widgets", "[]")),
        layout_preferences=json.loads(updated.get("layout_preferences", "{}")),
    )


# ── DEMO DATA ────────────────────────────────────────────────────────────────

@router.get("/demo/analytics", tags=["Demo"])
def get_demo_analytics():
    """Return sample product analytics."""
    return PRODUCT_USAGE_DATA


@router.get("/demo/projects", tags=["Demo"])
def get_demo_projects(db: Database = Depends(get_db)):
    """Return sample project data and interactive sprint tasks from MongoDB."""
    db_tasks = list(db[PROJECT_TASKS].find({}).sort("created_at", 1))

    if not db_tasks:
        for item in INITIAL_PROJECT_TASKS:
            doc = new_project_task(
                title=item["title"],
                status=item.get("status", "todo"),
                priority=item.get("priority", "medium"),
                due_date=item.get("due_date", ""),
                project_name=item.get("project_name", "Nova Core Platform"),
            )
            db[PROJECT_TASKS].insert_one(doc)
        db_tasks = list(db[PROJECT_TASKS].find({}).sort("created_at", 1))

    tasks_out = [_project_task_to_out(t) for t in db_tasks]
    project_payload = dict(PROJECT_REVIEW_DATA)
    project_payload["task_list"] = tasks_out
    return project_payload


@router.patch("/demo/projects/{project_task_id}", response_model=ProjectTaskOut, tags=["Demo"])
def update_project_task_status(
    project_task_id: str, req: ProjectTaskUpdate, db: Database = Depends(get_db)
):
    """Update project task status or priority in MongoDB."""
    task = db[PROJECT_TASKS].find_one({"_id": project_task_id})
    if not task:
        raise HTTPException(status_code=404, detail=f"Project task {project_task_id} not found")

    updates: dict = {}
    if req.status is not None:
        updates["status"] = req.status
    if req.priority is not None:
        updates["priority"] = req.priority

    if updates:
        db[PROJECT_TASKS].update_one({"_id": project_task_id}, {"$set": updates})

    return _project_task_to_out({**task, **updates})


# ── AI CHAT ──────────────────────────────────────────────────────────────────

def _build_db_context(db: Database) -> str:
    """Fetch safe context from MongoDB for the LLM."""
    lines = []
    try:
        tasks = list(db[TASKS].find({}).sort("created_at", -1).limit(10))
        if tasks:
            lines.append("Recent workspace tasks:")
            for t in tasks:
                lines.append(f"  - [{t.get('status')}] {t.get('title')} (intent: {t.get('detected_intent')})")

        total = db[PROJECT_TASKS].count_documents({})
        if total:
            completed  = db[PROJECT_TASKS].count_documents({"status": "completed"})
            in_progress = db[PROJECT_TASKS].count_documents({"status": "in_progress"})
            blocked    = db[PROJECT_TASKS].count_documents({"status": "blocked"})
            lines.append(
                f"Project tasks: {total} total, {completed} completed, "
                f"{in_progress} in progress, {blocked} blocked."
            )
    except Exception:
        pass
    return "\n".join(lines) if lines else ""


@router.post("/ai/chat", response_model=ChatResponse, tags=["AI Assistant"])
def ai_chat(req: ChatRequest, db: Database = Depends(get_db)):
    """SmartSpace AI intelligent assistant endpoint."""
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=422, detail="Message cannot be empty.")

    if not llm_service.is_configured():
        raise HTTPException(
            status_code=503,
            detail="AI assistant is not configured. Please set GEMINI_API_KEY in the server environment.",
        )

    db_context = _build_db_context(db)

    try:
        ai_response = llm_service.chat(message=message, context=db_context or None)
        return ChatResponse(response=ai_response, provider=llm_service.get_provider_name())
    except LLMError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception:
        raise HTTPException(status_code=500, detail="An unexpected error occurred. Please try again.")


@router.get("/ai/status", tags=["AI Assistant"])
def ai_status():
    """Returns whether the AI assistant is configured."""
    return {
        "configured": llm_service.is_configured(),
        "provider": llm_service.get_provider_name() if llm_service.is_configured() else "Not configured",
        "status": "ready" if llm_service.is_configured() else "unconfigured",
    }

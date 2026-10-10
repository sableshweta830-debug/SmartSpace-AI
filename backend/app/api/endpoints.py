"""
API Endpoints for Intent-to-Interface: Adaptive AI Workspace.
All routes organized logically with proper typing and error handling.
"""

import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Task, WorkspaceConfiguration, UserPreference, ProjectTask
from app.schemas.schemas import (
    IntentRequest,
    IntentResponse,
    WorkspaceGenerateRequest,
    WorkspaceResponse,
    TaskCreate,
    TaskUpdate,
    TaskOut,
    HistoryItem,
    PreferenceUpdate,
    PreferenceOut,
    ProjectTaskUpdate,
    ProjectTaskOut
)
from app.services.intent_service import intent_service
from app.services.workspace_service import workspace_service
from app.demo_data import (
    DEFAULT_DASHBOARD_DATA,
    PRODUCT_USAGE_DATA,
    PROJECT_REVIEW_DATA,
    INITIAL_PROJECT_TASKS
)

router = APIRouter()

# ----------------- INTENT ENDPOINTS -----------------
@router.post("/intent/analyze", response_model=IntentResponse, tags=["Intent"])
def analyze_intent(req: IntentRequest):
    """
    Analyze natural language goal to classify user intent, calculate confidence,
    extract entities, and determine whether clarification is necessary.
    """
    result = intent_service.analyze_intent(req.text)
    return IntentResponse(**result)

# ----------------- WORKSPACE ENDPOINTS -----------------
@router.post("/workspace/generate", response_model=WorkspaceResponse, tags=["Workspace"])
def generate_workspace(req: WorkspaceGenerateRequest, db: Session = Depends(get_db)):
    """
    Generate an adaptive workspace layout dynamically mapped to the detected user intent.
    Stores task & layout configuration in SQLite database for persistent history.
    """
    try:
        response = workspace_service.generate_workspace(
            text=req.text,
            db=db,
            save_to_history=req.save_to_history
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate workspace: {str(e)}")

@router.get("/workspace/default", tags=["Workspace"])
def get_default_workspace():
    """
    Return default initial dashboard configuration and sample widgets.
    """
    return workspace_service.get_default_dashboard()

# ----------------- TASK & HISTORY ENDPOINTS -----------------
@router.get("/tasks", response_model=List[TaskOut], tags=["Tasks"])
def get_tasks(saved_only: bool = False, db: Session = Depends(get_db)):
    """
    Return list of saved tasks from the database.
    """
    query = db.query(Task)
    if saved_only:
        query = query.filter(Task.is_saved == True)
    tasks = query.order_by(Task.created_at.desc()).all()
    return tasks

@router.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
def create_task(req: TaskCreate, db: Session = Depends(get_db)):
    """
    Create and save a task manually.
    """
    task = Task(
        user_id="demo_user",
        title=req.title,
        original_prompt=req.original_prompt,
        detected_intent=req.detected_intent,
        status=req.status
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/tasks/{task_id}", tags=["Tasks"])
def get_task_details(task_id: int, db: Session = Depends(get_db)):
    """
    Return detailed task metadata and associated workspace configuration.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")
    
    config_entry = db.query(WorkspaceConfiguration).filter(WorkspaceConfiguration.task_id == task_id).first()
    config_data = json.loads(config_entry.configuration_json) if config_entry else None
    
    # Also fetch widget data for this task's intent
    widget_data, _ = workspace_service.get_widget_data_for_intent(task.detected_intent, db)

    return {
        "task": {
            "id": task.id,
            "title": task.title,
            "original_prompt": task.original_prompt,
            "detected_intent": task.detected_intent,
            "status": task.status,
            "is_saved": task.is_saved,
            "created_at": task.created_at,
            "updated_at": task.updated_at
        },
        "configuration": config_data,
        "widget_data": widget_data
    }

@router.patch("/tasks/{task_id}", response_model=TaskOut, tags=["Tasks"])
def update_task(task_id: int, req: TaskUpdate, db: Session = Depends(get_db)):
    """
    Update task status, saved flag, or title.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")
    
    if req.title is not None:
        task.title = req.title
    if req.status is not None:
        task.status = req.status
    if req.is_saved is not None:
        task.is_saved = req.is_saved
        
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK, tags=["Tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """
    Delete a saved task and its associated workspace configuration.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")
    
    db.delete(task)
    db.commit()
    return {"message": f"Task {task_id} deleted successfully", "deleted_id": task_id}

@router.get("/history", response_model=List[HistoryItem], tags=["History"])
def get_task_history(db: Session = Depends(get_db)):
    """
    Return previous user tasks and their timestamps.
    """
    history = db.query(Task).order_by(Task.created_at.desc()).all()
    return history

# ----------------- USER PREFERENCES -----------------
@router.get("/preferences", response_model=PreferenceOut, tags=["Preferences"])
def get_preferences(db: Session = Depends(get_db)):
    """
    Return saved workspace preferences (theme, preferred widgets, layout).
    """
    pref = db.query(UserPreference).filter(UserPreference.user_id == "demo_user").first()
    if not pref:
        pref = UserPreference(
            user_id="demo_user",
            theme="light",
            preferred_widgets="[]",
            layout_preferences="{}"
        )
        db.add(pref)
        db.commit()
        db.refresh(pref)

    return PreferenceOut(
        user_id=pref.user_id,
        theme=pref.theme,
        preferred_widgets=json.loads(pref.preferred_widgets or "[]"),
        layout_preferences=json.loads(pref.layout_preferences or "{}")
    )

@router.put("/preferences", response_model=PreferenceOut, tags=["Preferences"])
def update_preferences(req: PreferenceUpdate, db: Session = Depends(get_db)):
    """
    Save preferences such as theme, preferred widgets, and layout settings.
    """
    pref = db.query(UserPreference).filter(UserPreference.user_id == "demo_user").first()
    if not pref:
        pref = UserPreference(user_id="demo_user")
        db.add(pref)

    if req.theme is not None:
        pref.theme = req.theme
    if req.preferred_widgets is not None:
        pref.preferred_widgets = json.dumps(req.preferred_widgets)
    if req.layout_preferences is not None:
        pref.layout_preferences = json.dumps(req.layout_preferences)

    db.commit()
    db.refresh(pref)

    return PreferenceOut(
        user_id=pref.user_id,
        theme=pref.theme,
        preferred_widgets=json.loads(pref.preferred_widgets or "[]"),
        layout_preferences=json.loads(pref.layout_preferences or "{}")
    )

# ----------------- DEMO DATA ENDPOINTS -----------------
@router.get("/demo/analytics", tags=["Demo"])
def get_demo_analytics():
    """
    Return sample product analytics and 30-day telemetry metrics.
    """
    return PRODUCT_USAGE_DATA

@router.get("/demo/projects", tags=["Demo"])
def get_demo_projects(db: Session = Depends(get_db)):
    """
    Return sample project data and interactive sprint tasks from SQLite.
    """
    db_tasks = db.query(ProjectTask).order_by(ProjectTask.id.asc()).all()
    if not db_tasks:
        for item in INITIAL_PROJECT_TASKS:
            new_pt = ProjectTask(**item)
            db.add(new_pt)
        db.commit()
        db_tasks = db.query(ProjectTask).order_by(ProjectTask.id.asc()).all()

    tasks_out = [
        {
            "id": t.id,
            "project_name": t.project_name,
            "title": t.title,
            "status": t.status,
            "priority": t.priority,
            "due_date": t.due_date
        }
        for t in db_tasks
    ]

    project_payload = dict(PROJECT_REVIEW_DATA)
    project_payload["task_list"] = tasks_out
    return project_payload

@router.patch("/demo/projects/{project_task_id}", response_model=ProjectTaskOut, tags=["Demo"])
def update_project_task_status(project_task_id: int, req: ProjectTaskUpdate, db: Session = Depends(get_db)):
    """
    Update project task status or priority and persist directly into SQLite database.
    Allows users to toggle task statuses and dynamically update project progress.
    """
    task = db.query(ProjectTask).filter(ProjectTask.id == project_task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail=f"Project task {project_task_id} not found")

    if req.status is not None:
        task.status = req.status
    if req.priority is not None:
        task.priority = req.priority

    db.commit()
    db.refresh(task)
    return task

"""
MongoDB Document Helpers for SmartSpace AI.
No ORM — pure dicts matching MongoDB documents.
Collection names mirror the old SQL table names.
"""

import uuid
from datetime import datetime


def generate_uuid() -> str:
    return str(uuid.uuid4())


def now() -> datetime:
    return datetime.utcnow()


# ── Collection name constants ─────────────────────────────────────────────────
PROFILES            = "profiles"
USER_INTENTS        = "user_intents"
WORKSPACES          = "workspaces"
WORKSPACE_COMPONENTS = "workspace_components"
TASKS               = "tasks"
WORKSPACE_CONFIGS   = "workspace_configurations"
USER_PREFERENCES    = "user_preferences"
ACTIVITY_LOGS       = "activity_logs"
PROJECT_TASKS       = "project_tasks"


# ── Document factories ────────────────────────────────────────────────────────

def new_profile(
    name: str = "Alex Mercer",
    email: str = "alex.mercer@intentai.dev",
    role: str = "Principal Solutions Architect",
    preferences: dict | None = None,
    _id: str | None = None,
) -> dict:
    return {
        "_id": _id or generate_uuid(),
        "name": name,
        "email": email,
        "role": role,
        "preferences": preferences or {"theme": "light", "voice_input_enabled": True},
        "created_at": now(),
        "updated_at": now(),
    }


def new_task(
    title: str,
    original_prompt: str,
    detected_intent: str,
    user_id: str = "demo_user",
    workspace_id: str | None = None,
    description: str | None = None,
    status: str = "active",
    priority: str = "medium",
    due_date: str | None = None,
    is_saved: bool = False,
) -> dict:
    return {
        "_id": generate_uuid(),
        "user_id": user_id,
        "workspace_id": workspace_id,
        "title": title,
        "description": description,
        "original_prompt": original_prompt,
        "detected_intent": detected_intent,
        "status": status,
        "priority": priority,
        "due_date": due_date,
        "is_saved": is_saved,
        "created_at": now(),
        "updated_at": now(),
    }


def new_workspace_config(task_id: str, configuration_json: str) -> dict:
    return {
        "_id": generate_uuid(),
        "task_id": task_id,
        "configuration_json": configuration_json,
        "created_at": now(),
    }


def new_user_preference(
    user_id: str = "demo_user",
    theme: str = "light",
    preferred_widgets: str = "[]",
    layout_preferences: str = "{}",
) -> dict:
    return {
        "_id": generate_uuid(),
        "user_id": user_id,
        "preferred_layout": "adaptive_grid",
        "theme": theme,
        "preferred_widgets": preferred_widgets,
        "layout_preferences": layout_preferences,
        "frequently_used_components": "[]",
        "interaction_preferences": "{}",
        "created_at": now(),
        "updated_at": now(),
    }


def new_project_task(
    title: str,
    status: str = "todo",
    priority: str = "medium",
    due_date: str = "",
    project_name: str = "Nova Core Platform",
) -> dict:
    return {
        "_id": generate_uuid(),
        "project_name": project_name,
        "title": title,
        "status": status,
        "priority": priority,
        "due_date": due_date,
        "created_at": now(),
    }

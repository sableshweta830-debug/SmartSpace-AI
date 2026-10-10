from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict

# Intent Schemas
class IntentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="User goal or task description")

class IntentResponse(BaseModel):
    intent: str
    confidence: float
    entities: Dict[str, Any] = Field(default_factory=dict)
    clarification_needed: bool = False
    clarification_question: Optional[str] = None
    suggested_alternatives: Optional[List[str]] = None
    is_fallback: bool = True
    provider: str = "Deterministic Rule-Based Classifier"

# Widget Schemas
class WidgetConfig(BaseModel):
    id: str
    type: str
    title: str
    priority: int
    size: str = "medium"  # small, medium, large, full
    category: str = "general"
    description: Optional[str] = None
    hidden: bool = False

class RecommendedAction(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool = False
    action_type: str = "checkbox"  # checkbox, button, modal

# Workspace Schemas
class WorkspaceGenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    save_to_history: bool = True

class WorkspaceConfig(BaseModel):
    task_title: str
    intent: str
    confidence: float
    summary: str
    widgets: List[WidgetConfig]
    explanation: str

class WorkspaceResponse(BaseModel):
    task_id: Optional[int] = None
    task_title: str
    intent: str
    confidence: float
    summary: str
    widgets: List[WidgetConfig]
    widget_data: Dict[str, Any]
    recommended_actions: List[RecommendedAction]
    explanation: str
    explanations_per_widget: Dict[str, str]
    is_fallback: bool
    data_source: str = "Demo Data"
    available_info: List[str]
    missing_info: List[str]
    recommended_next_step: str
    workspace_configuration: WorkspaceConfig

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    original_prompt: str
    detected_intent: str
    status: str = "active"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None  # active, completed, archived
    is_saved: Optional[bool] = None

class TaskOut(BaseModel):
    id: int
    user_id: str
    title: str
    original_prompt: str
    detected_intent: str
    status: str
    is_saved: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# History item schema
class HistoryItem(BaseModel):
    id: int
    title: str
    original_prompt: str
    detected_intent: str
    status: str
    is_saved: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Preference Schemas
class PreferenceUpdate(BaseModel):
    theme: Optional[str] = None
    preferred_widgets: Optional[List[str]] = None
    layout_preferences: Optional[Dict[str, Any]] = None

class PreferenceOut(BaseModel):
    user_id: str
    theme: str
    preferred_widgets: List[str]
    layout_preferences: Dict[str, Any]

# Project Task Schemas
class ProjectTaskUpdate(BaseModel):
    status: Optional[str] = None  # todo, in_progress, completed, blocked
    priority: Optional[str] = None

class ProjectTaskOut(BaseModel):
    id: int
    project_name: str
    title: str
    status: str
    priority: str
    due_date: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

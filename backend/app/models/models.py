"""
SQLAlchemy Database Models for Intent-to-Interface: Adaptive AI Workspace.
Includes both:
1. The 7 Supabase PostgreSQL Relational Entities:
   - profiles (users)
   - user_intents
   - workspaces
   - workspace_components
   - tasks
   - user_preferences
   - activity_logs
2. Interactive demo & cache entities (project_tasks, workspace_configurations)
"""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    Numeric
)
from sqlalchemy.types import JSON
from sqlalchemy.orm import relationship
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


# ==============================================================================
# TABLE A: profiles / users
# ==============================================================================
class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(100), primary_key=True, default=generate_uuid, index=True)
    name = Column(String(255), nullable=False, default="Alex Mercer")
    email = Column(String(255), unique=True, nullable=False, index=True, default="demo@intentai.dev")
    role = Column(String(100), default="Product Lead / Engineer")
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    intents = relationship("UserIntent", back_populates="user", cascade="all, delete-orphan")
    workspaces = relationship("Workspace", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")


# ==============================================================================
# TABLE B: user_intents
# ==============================================================================
class UserIntent(Base):
    __tablename__ = "user_intents"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(100), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    intent_text = Column(Text, nullable=False)
    intent_type = Column(String(100), nullable=False, index=True)
    confidence_score = Column(Numeric(5, 4), default=0.8500)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("Profile", back_populates="intents")
    workspaces = relationship("Workspace", back_populates="intent")


# ==============================================================================
# TABLE C: workspaces
# ==============================================================================
class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(100), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    current_intent_id = Column(String(36), ForeignKey("user_intents.id", ondelete="SET NULL"), nullable=True)
    layout_config = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("Profile", back_populates="workspaces")
    intent = relationship("UserIntent", back_populates="workspaces")
    components = relationship("WorkspaceComponent", back_populates="workspace", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="workspace")


# ==============================================================================
# TABLE D: workspace_components
# ==============================================================================
class WorkspaceComponent(Base):
    __tablename__ = "workspace_components"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    component_type = Column(String(100), nullable=False)
    component_name = Column(String(255), nullable=False)
    position = Column(Integer, default=0)
    priority = Column(Integer, default=1)
    data_source = Column(JSON, default=dict)
    visibility = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    workspace = relationship("Workspace", back_populates="components")


# ==============================================================================
# TABLE E: tasks
# ==============================================================================
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(100), default="demo_user", index=True)
    workspace_id = Column(String(36), nullable=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    original_prompt = Column(Text, nullable=False)
    detected_intent = Column(String(100), nullable=False)
    status = Column(String(50), default="active")  # active, completed, archived, todo, in_progress, blocked
    priority = Column(String(50), default="medium")  # high, medium, low
    due_date = Column(String(100), nullable=True)
    is_saved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to configuration
    configuration = relationship("WorkspaceConfiguration", back_populates="task", uselist=False, cascade="all, delete-orphan")


# ==============================================================================
# Workspace Configuration entry (JSON serialization for rapid reload)
# ==============================================================================
class WorkspaceConfiguration(Base):
    __tablename__ = "workspace_configurations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, unique=True)
    configuration_json = Column(Text, nullable=False)  # JSON serialized string
    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="configuration")


# ==============================================================================
# TABLE F: user_preferences
# ==============================================================================
class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(100), unique=True, default="demo_user", index=True)
    preferred_layout = Column(String(50), default="adaptive_grid")
    theme = Column(String(20), default="light")  # light, dark
    preferred_widgets = Column(Text, default="[]")  # JSON string
    layout_preferences = Column(Text, default="{}")  # JSON string
    frequently_used_components = Column(Text, default="[]")  # JSON string
    interaction_preferences = Column(Text, default="{}")  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ==============================================================================
# TABLE G: activity_logs
# ==============================================================================
class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(100), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("Profile", back_populates="activity_logs")
    workspace = relationship("Workspace", back_populates="activity_logs")


# ==============================================================================
# Interactive Project Tasks (Sprint tasks displayed in widgets)
# ==============================================================================
class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_name = Column(String(100), default="Nova Core Platform", index=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="todo")  # todo, in_progress, completed, blocked
    priority = Column(String(50), default="medium")  # high, medium, low
    due_date = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

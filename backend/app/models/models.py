from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(100), default="demo_user", index=True)
    title = Column(String(255), nullable=False)
    original_prompt = Column(Text, nullable=False)
    detected_intent = Column(String(100), nullable=False)
    status = Column(String(50), default="active")  # active, completed, archived
    is_saved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to configuration
    configuration = relationship("WorkspaceConfiguration", back_populates="task", uselist=False, cascade="all, delete-orphan")


class WorkspaceConfiguration(Base):
    __tablename__ = "workspace_configurations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, unique=True)
    configuration_json = Column(Text, nullable=False)  # JSON serialized string
    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("Task", back_populates="configuration")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(100), unique=True, default="demo_user", index=True)
    theme = Column(String(20), default="light")  # light, dark
    preferred_widgets = Column(Text, default="[]")  # JSON string
    layout_preferences = Column(Text, default="{}")  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_name = Column(String(100), default="Nova Core Platform", index=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default="todo")  # todo, in_progress, completed, blocked
    priority = Column(String(50), default="medium")  # high, medium, low
    due_date = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

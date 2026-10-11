"""
Workspace Service:
Coordinates intent detection, layout engine, data assembly, and database persistence.
"""

import json
from typing import Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from app.models.models import (
    Task,
    WorkspaceConfiguration,
    ProjectTask,
    UserPreference,
    Profile,
    UserIntent,
    Workspace,
    WorkspaceComponent,
    ActivityLog
)
from app.schemas.schemas import (
    WorkspaceResponse,
    WorkspaceConfig,
    RecommendedAction,
    WidgetConfig
)
from app.services.intent_service import intent_service
from app.services.layout_engine import layout_engine
from app.demo_data import (
    DEFAULT_DASHBOARD_DATA,
    CLIENT_MEETING_DATA,
    PRODUCT_USAGE_DATA,
    PROJECT_REVIEW_DATA,
    CUSTOMER_COMPLAINTS_DATA,
    PRESENTATION_PREPARATION_DATA,
    INITIAL_PROJECT_TASKS
)

class WorkspaceService:
    def get_widget_data_for_intent(self, intent: str, db: Session) -> Tuple[Dict[str, Any], List[RecommendedAction]]:
        """Retrieves and prepares widget data for the detected intent."""
        if intent == "meeting_preparation":
            raw_data = CLIENT_MEETING_DATA
            actions = [RecommendedAction(**act) for act in raw_data["recommended_actions"]]
            return raw_data, actions

        elif intent == "product_usage_analysis":
            raw_data = PRODUCT_USAGE_DATA
            actions = [RecommendedAction(**act) for act in raw_data["recommended_investigations"]]
            return raw_data, actions

        elif intent == "project_review":
            raw_data = dict(PROJECT_REVIEW_DATA)
            # Retrieve project tasks directly from SQLite database so user edits reflect dynamically!
            db_tasks = db.query(ProjectTask).order_by(ProjectTask.id.asc()).all()
            if not db_tasks:
                # Seed if empty
                for item in INITIAL_PROJECT_TASKS:
                    new_pt = ProjectTask(**item)
                    db.add(new_pt)
                db.commit()
                db_tasks = db.query(ProjectTask).order_by(ProjectTask.id.asc()).all()

            tasks_list = [
                {
                    "id": t.id,
                    "title": t.title,
                    "status": t.status,
                    "priority": t.priority,
                    "due_date": t.due_date,
                    "project_name": t.project_name
                }
                for t in db_tasks
            ]
            raw_data["task_list"] = tasks_list
            actions = [RecommendedAction(**act) for act in raw_data["recommended_actions"]]
            return raw_data, actions

        elif intent == "complaint_analysis":
            raw_data = CUSTOMER_COMPLAINTS_DATA
            actions = [RecommendedAction(**act) for act in raw_data["recommended_actions"]]
            return raw_data, actions

        elif intent == "presentation_preparation":
            raw_data = PRESENTATION_PREPARATION_DATA
            actions = [RecommendedAction(**act) for act in raw_data["recommended_actions"]]
            return raw_data, actions

        else:
            # General task fallback data
            raw_data = dict(PROJECT_REVIEW_DATA)
            db_tasks = db.query(ProjectTask).limit(5).all()
            raw_data["task_list"] = [
                {"id": t.id, "title": t.title, "status": t.status, "priority": t.priority, "due_date": t.due_date}
                for t in db_tasks
            ]
            actions = [RecommendedAction(**act) for act in raw_data["recommended_actions"]]
            return raw_data, actions

    def generate_workspace(self, text: str, db: Session, save_to_history: bool = True) -> WorkspaceResponse:
        """
        Processes prompt text, generates adaptive workspace configuration,
        and saves the task to the database.
        """
        # 1. Analyze user intent
        analysis = intent_service.analyze_intent(text)
        detected_intent = analysis["intent"]
        confidence = analysis["confidence"]
        is_fallback = analysis["is_fallback"]

        # 2. Layout engine calculates components
        (
            task_title,
            summary,
            widgets,
            overall_explanation,
            explanations_per_widget,
            available_info,
            missing_info,
            recommended_next_step
        ) = layout_engine.generate_layout(detected_intent, confidence)

        # 3. Assemble widget data and recommended actions
        widget_data, recommended_actions = self.get_widget_data_for_intent(detected_intent, db)

        # 4. Form configuration object
        workspace_config = WorkspaceConfig(
            task_title=task_title,
            intent=detected_intent,
            confidence=confidence,
            summary=summary,
            widgets=widgets,
            explanation=overall_explanation
        )

        task_id = None
        if save_to_history:
            # Ensure Profile exists
            profile = db.query(Profile).filter(Profile.id == "demo_user").first()
            if not profile:
                profile = Profile(
                    id="demo_user",
                    name="Alex Mercer",
                    email="alex.mercer@intentai.dev",
                    role="Principal Solutions Architect",
                    preferences={"theme": "light", "voice_input_enabled": True}
                )
                db.add(profile)
                db.commit()

            # 1. Record User Intent
            new_intent = UserIntent(
                user_id="demo_user",
                intent_text=text,
                intent_type=detected_intent,
                confidence_score=confidence
            )
            db.add(new_intent)
            db.commit()
            db.refresh(new_intent)

            # 2. Record Workspace Entity
            new_workspace = Workspace(
                user_id="demo_user",
                name=task_title,
                description=summary,
                current_intent_id=new_intent.id,
                layout_config={
                    "intent": detected_intent,
                    "confidence": confidence,
                    "summary": summary,
                    "widgets": [w.model_dump() for w in widgets],
                    "explanation": overall_explanation
                }
            )
            db.add(new_workspace)
            db.commit()
            db.refresh(new_workspace)

            # 3. Record Workspace Components
            for idx, w in enumerate(widgets):
                comp = WorkspaceComponent(
                    workspace_id=new_workspace.id,
                    component_type=str(w.type),
                    component_name=w.title,
                    position=idx,
                    priority=w.priority,
                    visibility=not w.hidden,
                    data_source={"category": w.category, "size": w.size}
                )
                db.add(comp)

            # 4. Create Task in DB linked to Workspace
            new_task = Task(
                user_id="demo_user",
                workspace_id=new_workspace.id,
                title=task_title,
                original_prompt=text,
                detected_intent=detected_intent,
                status="active"
            )
            db.add(new_task)
            db.commit()
            db.refresh(new_task)
            task_id = new_task.id

            # 5. Save Workspace Configuration in DB (for backward compatibility)
            config_entry = WorkspaceConfiguration(
                task_id=new_task.id,
                configuration_json=json.dumps({
                    "task_title": task_title,
                    "intent": detected_intent,
                    "confidence": confidence,
                    "summary": summary,
                    "widgets": [w.model_dump() for w in widgets],
                    "explanation": overall_explanation,
                    "explanations_per_widget": explanations_per_widget,
                    "recommended_actions": [a.model_dump() for a in recommended_actions],
                    "available_info": available_info,
                    "missing_info": missing_info,
                    "recommended_next_step": recommended_next_step,
                    "data_source": "Demo Data",
                    "workspace_id": new_workspace.id,
                    "intent_id": new_intent.id
                })
            )
            db.add(config_entry)

            # 6. Record Activity Log
            activity = ActivityLog(
                user_id="demo_user",
                workspace_id=new_workspace.id,
                action="workspace_generated",
                metadata_json={
                    "intent": detected_intent,
                    "confidence": confidence,
                    "components_count": len(widgets),
                    "prompt": text
                }
            )
            db.add(activity)
            db.commit()

        return WorkspaceResponse(
            task_id=task_id,
            task_title=task_title,
            intent=detected_intent,
            confidence=confidence,
            summary=summary,
            widgets=widgets,
            widget_data=widget_data,
            recommended_actions=recommended_actions,
            explanation=overall_explanation,
            explanations_per_widget=explanations_per_widget,
            is_fallback=is_fallback,
            data_source="Demo Data",
            available_info=available_info,
            missing_info=missing_info,
            recommended_next_step=recommended_next_step,
            workspace_configuration=workspace_config
        )

    def get_default_dashboard(self) -> Dict[str, Any]:
        """Returns the default initial dashboard configuration."""
        return DEFAULT_DASHBOARD_DATA

workspace_service = WorkspaceService()

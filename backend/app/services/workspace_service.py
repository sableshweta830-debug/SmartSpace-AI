"""
Workspace Service:
Coordinates intent detection, layout engine, data assembly, and MongoDB persistence.
"""

import json
from typing import Dict, Any, List, Tuple

from pymongo.database import Database

from app.models.models import (
    TASKS, WORKSPACE_CONFIGS, PROJECT_TASKS, PROFILES,
    USER_INTENTS, WORKSPACES, WORKSPACE_COMPONENTS, ACTIVITY_LOGS,
    new_task, new_workspace_config, new_project_task, generate_uuid, now,
)
from app.schemas.schemas import (
    WorkspaceResponse,
    WorkspaceConfig,
    RecommendedAction,
    WidgetConfig,
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
    INITIAL_PROJECT_TASKS,
)


class WorkspaceService:

    def get_widget_data_for_intent(
        self, intent: str, db: Database
    ) -> Tuple[Dict[str, Any], List[RecommendedAction]]:
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
            # Fetch project tasks from MongoDB so user edits reflect dynamically
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

            raw_data["task_list"] = [
                {
                    "id": t["_id"],
                    "title": t["title"],
                    "status": t["status"],
                    "priority": t["priority"],
                    "due_date": t.get("due_date", ""),
                    "project_name": t.get("project_name", "Nova Core Platform"),
                }
                for t in db_tasks
            ]
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
            raw_data = dict(PROJECT_REVIEW_DATA)
            db_tasks = list(db[PROJECT_TASKS].find({}).limit(5))
            raw_data["task_list"] = [
                {
                    "id": t["_id"],
                    "title": t["title"],
                    "status": t["status"],
                    "priority": t["priority"],
                    "due_date": t.get("due_date", ""),
                }
                for t in db_tasks
            ]
            actions = [RecommendedAction(**act) for act in raw_data["recommended_actions"]]
            return raw_data, actions

    def generate_workspace(
        self, text: str, db: Database, save_to_history: bool = True
    ) -> WorkspaceResponse:
        """
        Processes prompt text, generates adaptive workspace configuration,
        and saves the task to MongoDB.
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
            recommended_next_step,
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
            explanation=overall_explanation,
        )

        task_id = None
        if save_to_history:
            # Ensure Profile exists in MongoDB
            if not db[PROFILES].find_one({"_id": "demo_user"}):
                db[PROFILES].insert_one({
                    "_id": "demo_user",
                    "name": "Alex Mercer",
                    "email": "alex.mercer@intentai.dev",
                    "role": "Principal Solutions Architect",
                    "preferences": {"theme": "light", "voice_input_enabled": True},
                    "created_at": now(),
                    "updated_at": now(),
                })

            # 1. Record User Intent
            intent_id = generate_uuid()
            db[USER_INTENTS].insert_one({
                "_id": intent_id,
                "user_id": "demo_user",
                "intent_text": text,
                "intent_type": detected_intent,
                "confidence_score": confidence,
                "created_at": now(),
            })

            # 2. Record Workspace
            workspace_id = generate_uuid()
            db[WORKSPACES].insert_one({
                "_id": workspace_id,
                "user_id": "demo_user",
                "name": task_title,
                "description": summary,
                "current_intent_id": intent_id,
                "layout_config": {
                    "intent": detected_intent,
                    "confidence": confidence,
                    "summary": summary,
                    "widgets": [w.model_dump() for w in widgets],
                    "explanation": overall_explanation,
                },
                "created_at": now(),
                "updated_at": now(),
            })

            # 3. Record Workspace Components
            for idx, w in enumerate(widgets):
                db[WORKSPACE_COMPONENTS].insert_one({
                    "_id": generate_uuid(),
                    "workspace_id": workspace_id,
                    "component_type": str(w.type),
                    "component_name": w.title,
                    "position": idx,
                    "priority": w.priority,
                    "visibility": not w.hidden,
                    "data_source": {"category": w.category, "size": w.size},
                    "created_at": now(),
                })

            # 4. Create Task in MongoDB
            task_doc = new_task(
                title=task_title,
                original_prompt=text,
                detected_intent=detected_intent,
                workspace_id=workspace_id,
                status="active",
            )
            db[TASKS].insert_one(task_doc)
            task_id = task_doc["_id"]

            # 5. Save Workspace Configuration
            config_doc = new_workspace_config(
                task_id=task_id,
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
                    "workspace_id": workspace_id,
                    "intent_id": intent_id,
                }),
            )
            db[WORKSPACE_CONFIGS].insert_one(config_doc)

            # 6. Record Activity Log
            db[ACTIVITY_LOGS].insert_one({
                "_id": generate_uuid(),
                "user_id": "demo_user",
                "workspace_id": workspace_id,
                "action": "workspace_generated",
                "metadata_json": {
                    "intent": detected_intent,
                    "confidence": confidence,
                    "components_count": len(widgets),
                    "prompt": text,
                },
                "created_at": now(),
            })

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
            workspace_configuration=workspace_config,
        )

    def get_default_dashboard(self) -> Dict[str, Any]:
        """Returns the default initial dashboard configuration."""
        return DEFAULT_DASHBOARD_DATA


workspace_service = WorkspaceService()

"""
Automated backend test suite for Intent-to-Interface: Adaptive AI Workspace.
Covers:
1. Health and Root endpoints
2. Intent classification for each primary scenario
3. Workspace configuration generation
4. Ambiguous / Unknown prompt handling
5. Task creation, retrieval, and deletion (CRUD)
6. Task status updates
7. Project task status update persistence
8. Validation error handling
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Intent-to-Interface" in data["app"]
    assert data["status"] == "online"

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["healthy"] is True

# --- INTENT CLASSIFICATION TESTS ---
def test_intent_meeting_preparation():
    response = client.post("/api/intent/analyze", json={"text": "Prepare for tomorrow's client meeting."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "meeting_preparation"
    assert data["confidence"] > 0.60
    assert "timeframe" in data["entities"]

def test_intent_product_usage_analysis():
    response = client.post("/api/intent/analyze", json={"text": "Investigate why product usage dropped this month."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "product_usage_analysis"
    assert data["confidence"] > 0.60

def test_intent_project_review():
    response = client.post("/api/intent/analyze", json={"text": "Review the progress of our ongoing project."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "project_review"
    assert data["confidence"] > 0.60

def test_intent_complaint_analysis():
    response = client.post("/api/intent/analyze", json={"text": "Summarize recent customer complaints."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "complaint_analysis"
    assert data["confidence"] > 0.60

def test_intent_presentation_preparation():
    response = client.post("/api/intent/analyze", json={"text": "Help me prepare a project presentation."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "presentation_preparation"
    assert data["confidence"] > 0.60

def test_unknown_or_ambiguous_prompt():
    response = client.post("/api/intent/analyze", json={"text": "xyz random 123"})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "general_task"
    assert data["clarification_needed"] is True
    assert data["clarification_question"] is not None

# --- WORKSPACE GENERATION TESTS ---
def test_workspace_generate_meeting():
    response = client.post("/api/workspace/generate", json={"text": "Prepare for tomorrow's client meeting."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "meeting_preparation"
    assert len(data["widgets"]) > 0
    assert any(w["type"] == "ClientOverviewWidget" for w in data["widgets"])
    assert "client_overview" in data["widget_data"]
    assert data["explanation"] != ""
    assert data["data_source"] == "Demo Data"

def test_workspace_generate_usage_drop():
    response = client.post("/api/workspace/generate", json={"text": "Investigate why product usage dropped this month."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "product_usage_analysis"
    assert any(w["type"] == "LineChartWidget" for w in data["widgets"])
    assert "usage_trend_chart" in data["widget_data"]

def test_workspace_generate_project_review():
    response = client.post("/api/workspace/generate", json={"text": "Review the progress of our ongoing project."})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "project_review"
    assert any(w["type"] == "ProjectProgressWidget" for w in data["widgets"])
    assert "task_list" in data["widget_data"]

def test_default_workspace():
    response = client.get("/api/workspace/default")
    assert response.status_code == 200
    data = response.json()
    assert "welcome" in data
    assert "quick_stats" in data
    assert "quick_actions" in data

# --- TASK CRUD & DATABASE PERSISTENCE TESTS ---
def test_task_creation_and_retrieval():
    create_resp = client.post("/api/tasks", json={
        "title": "Automated Test Task",
        "original_prompt": "Run automated test prompt",
        "detected_intent": "project_review",
        "status": "active"
    })
    assert create_resp.status_code == 201
    created_data = create_resp.json()
    task_id = created_data["id"]

    # Retrieve
    get_resp = client.get(f"/api/tasks/{task_id}")
    assert get_resp.status_code == 200
    retrieved_data = get_resp.json()
    assert retrieved_data["task"]["title"] == "Automated Test Task"

    # Update status
    patch_resp = client.patch(f"/api/tasks/{task_id}", json={"status": "completed"})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "completed"

    # Delete
    del_resp = client.delete(f"/api/tasks/{task_id}")
    assert del_resp.status_code == 200

    # Verify 404 after deletion
    get_after_del = client.get(f"/api/tasks/{task_id}")
    assert get_after_del.status_code == 404

def test_task_history():
    response = client.get("/api/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_preferences_update_and_get():
    # Update preferences
    pref_update = client.put("/api/preferences", json={
        "theme": "dark",
        "preferred_widgets": ["MetricCard", "LineChartWidget"]
    })
    assert pref_update.status_code == 200
    assert pref_update.json()["theme"] == "dark"

    # Get preferences
    get_pref = client.get("/api/preferences")
    assert get_pref.status_code == 200
    assert get_pref.json()["theme"] == "dark"

def test_demo_project_task_status_update():
    # Get demo projects
    proj_resp = client.get("/api/demo/projects")
    assert proj_resp.status_code == 200
    tasks = proj_resp.json()["task_list"]
    assert len(tasks) > 0
    first_task_id = tasks[0]["id"]

    # Update status to completed
    update_resp = client.patch(f"/api/demo/projects/{first_task_id}", json={"status": "completed"})
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "completed"

def test_invalid_request_handling():
    # Empty string should fail validation
    resp = client.post("/api/intent/analyze", json={"text": ""})
    assert resp.status_code == 422

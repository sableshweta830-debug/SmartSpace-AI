# Intent-to-Interface: Adaptive AI Workspace

> **"An interface that adapts to your intent, not the other way around."**

[![Backend Tests](https://img.shields.io/badge/pytest-17%20passed-emerald)](./backend)
[![Frontend](https://img.shields.io/badge/Vite-React%2019%20%2B%20TypeScript-blue)](./frontend)
[![Styling](https://img.shields.io/badge/TailwindCSS-v3.4-violet)](./frontend)
[![Backend](https://img.shields.io/badge/FastAPI-Python%203.14-teal)](./backend)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2B%20SQLAlchemy-amber)](./backend)

---

## 1. Project Overview

Traditional software dashboards force users to navigate static menus, dozens of nested filters, and disjointed tabs. **Intent-to-Interface: Adaptive AI Workspace** is an intelligent, full-stack application that captures what a user wants to achieve in natural language and dynamically reconfigures its UI widgets, analytics charts, risk registers, and recommended action plans to match that exact goal.

This prototype was built as a college hackathon demonstration, featuring a fully functional frontend, FastAPI backend, modular intent detection engine, dynamic layout engine, and persistent SQLite database.

---

## 2. Key Features

- **Intelligent Command Bar:**
  - Natural language goal input (*"What do you want to accomplish today?"*).
  - Speech recognition with browser microphone permissions.
  - Interactive clickable suggestions chips.
- **Adaptive Layout Engine:**
  - Evaluates intent confidence and extracts domain entities.
  - Selects and prioritizes widgets from a reusable React widget registry.
  - Dynamically resizes widgets (full, large, medium, small) into a responsive grid.
  - Explains the architectural rationale behind every selected component.
- **Hackathon Quick-Demo Bar ("Try Demo Tasks"):**
  - **Client Meeting Preparation:** Client overview, recent communications with pending response flags, previous decisions, SLA latency risks, suggested talking points, and an interactive **Meeting Brief Generator**.
  - **Investigate Product Usage Decline:** 30-day time-series telemetry charts (Recharts), MoM drop metrics, feature adoption distributions, and data-backed release correlation hypotheses.
  - **Review Project Progress:** Sprint velocity (68%), burndown progress bar, milestone deadlines countdown, active blockers, and interactive SQLite-synced task status updates.
  - **Summarize Customer Complaints:** 142 ticket synthesis, category breakdown, recurring webhook dropped alerts, and recommended engineering remediations.
- **Persistent Storage & Task History:**
  - SQLite database (`workspace.db`) powered by SQLAlchemy ORM.
  - Full CRUD operations: create, reopen, update status, bookmark/save, and delete tasks.
- **Customizable Experience:**
  - Light & dark mode with instant theme persistence.
  - Widget hide & restore controls with a dedicated restoration tray.
  - Transparent engine labeling: clearly identifies Rule-Based Fallback vs AI LLM.

---

## 3. Technology Stack

### Frontend
- **Framework:** React.js (v19) with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React
- **Data Visualization:** Recharts (Area, Line, Bar, and Pie charts)
- **Transitions:** Framer Motion & CSS custom animations
- **Routing:** React Router v7

### Backend
- **Framework:** FastAPI
- **Language:** Python
- **Validation:** Pydantic v2
- **ORM & Database:** SQLAlchemy with SQLite (`workspace.db`)
- **Server:** Uvicorn (ASGI)
- **Testing:** Pytest & FastAPI TestClient

---

## 4. Project Folder Structure

```
SmartSpace-AI/
│
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # EmptyState, LoadingState, ErrorState, MeetingBriefModal
│   │   │   ├── dashboard/          # CommandBar, DemoTaskBar, DefaultDashboard
│   │   │   ├── layout/             # Sidebar, Navbar, Layout
│   │   │   └── widgets/            # MetricCard, LineChart, BarChart, TaskList, Registry, etc.
│   │   ├── pages/                  # HomePage, AdaptiveWorkspacePage, TaskHistory, Saved, Settings, Help
│   │   ├── services/
│   │   │   └── api.ts              # Centralized typed HTTP API service
│   │   ├── types/                  # TypeScript interface definitions
│   │   ├── App.tsx                 # Root router & theme state
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Tailwind CSS & theme variables
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py        # All REST API endpoints
│   │   ├── core/
│   │   │   └── config.py           # Application settings & environment variables
│   │   ├── models/
│   │   │   └── models.py           # SQLAlchemy models (Task, WorkspaceConfig, Preference, ProjectTask)
│   │   ├── schemas/
│   │   │   └── schemas.py          # Pydantic v2 request/response schemas
│   │   ├── services/
│   │   │   ├── intent_service.py   # Deterministic semantic classifier & entity extractor
│   │   │   ├── layout_engine.py    # Adaptive component selection & explanation engine
│   │   │   └── workspace_service.py# Orchestrator & database synchronizer
│   │   ├── database.py             # SQLite engine & session management
│   │   ├── demo_data.py            # High-fidelity demo datasets
│   │   └── main.py                 # FastAPI application, CORS, & startup seeding
│   ├── tests/
│   │   └── test_api.py             # 17 comprehensive automated pytest test cases
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 5. Prerequisites

- **Python:** 3.10+ (tested on Python 3.14)
- **Node.js:** v18+ or v20+ (with `npm`)
- **Operating System:** Windows, macOS, or Linux (PowerShell commands documented below)

---

## 6. Installation & Startup (Windows PowerShell)

### ⚡ One-Click Instant Launcher (Fastest)
Double-click `start.bat` or run in PowerShell:
```powershell
.\start.ps1
```
This automatically boots the FastAPI backend on port 8000, Vite frontend on port 5173, and opens your default browser at `http://127.0.0.1:5173/`!

---

### Manual Step-by-Step Setup:

### Step 1: Clone or Navigate to the Repository
```powershell
cd c:\Users\Asus\Downloads\index\SmartSpace-AI
```

---

### Step 2: Backend Setup & Run

1. Navigate to the `backend/` directory:
   ```powershell
   cd backend
   ```

2. (Optional) Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install backend dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

4. Create local environment configuration:
   ```powershell
   Copy-Item .env.example .env
   ```

5. Run the FastAPI backend server:
   ```powershell
   $env:PYTHONPATH = "."
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

   The backend will be running at **http://127.0.0.1:8000**.
   - Interactive Swagger API docs: **http://127.0.0.1:8000/docs**
   - Health Check: **http://127.0.0.1:8000/health**

---

### Step 3: Frontend Setup & Run

Open a new PowerShell terminal:

1. Navigate to the `frontend/` directory:
   ```powershell
   cd c:\Users\Asus\Downloads\index\SmartSpace-AI\frontend
   ```

2. Install npm dependencies:
   ```powershell
   npm install
   ```

3. Create frontend environment configuration:
   ```powershell
   Copy-Item .env.example .env
   ```

4. Start the Vite development server:
   ```powershell
   npm run dev -- --host 127.0.0.1 --port 5173
   ```

5. Open your browser and navigate to:
   👉 **http://127.0.0.1:5173**

---

## 7. Running Automated Tests

The application includes an automated test suite verifying all 17 critical backend behaviors:
- Health and status endpoints
- Classification for all 4 primary scenarios + unknown prompts
- Dynamic layout engine generation
- Full SQLite task CRUD operations
- Interactive project task status persistence
- Request validation and error handling

Run the tests with:
```powershell
cd c:\Users\Asus\Downloads\index\SmartSpace-AI\backend
$env:PYTHONPATH = "."
python -m pytest tests -v
```

All 17 tests run 100% offline without requiring paid external AI API keys.

---

## 8. Hackathon Demonstration Scenarios

| Scenario | Click / Enter | Adaptive UI Transformation |
| :--- | :--- | :--- |
| **1. Client Meeting** | Click **"Prepare for a Client Meeting"** or enter *"Prepare for tomorrow's client meeting."* | Renders Client Profile ($420k ACV), Recent Email threads, Last Meeting Decisions, SLA Latency Open Issues, Talking Points, and **Meeting Brief Generator**. |
| **2. Usage Drop** | Click **"Investigate Product Usage"** or enter *"Investigate why product usage dropped this month."* | Transforms into 30-day time series chart (Recharts), feature adoption metrics, cohort decline analysis, and deployment v2.4 root cause findings. |
| **3. Project Progress** | Click **"Review Project Progress"** or enter *"Review the progress of our ongoing project."* | Renders 68% milestone progress, upcoming sprint countdowns, blockers, and **Interactive Task List** (changing status updates SQLite database!). |
| **4. Complaints** | Click chip *"Summarize recent customer complaints."* | Categorizes 142 tickets, recurring Stripe webhook failure analysis, and recommended engineering remediations. |

---

## 9. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Application status & welcome message |
| `GET` | `/health` | Health status and engine state |
| `POST` | `/api/intent/analyze` | Classify natural language goal & calculate confidence |
| `POST` | `/api/workspace/generate` | Generate adaptive workspace layout & persist task |
| `GET` | `/api/workspace/default` | Get default general dashboard data |
| `GET` | `/api/tasks` | Retrieve saved tasks from SQLite |
| `POST` | `/api/tasks` | Create a new task manually |
| `GET` | `/api/tasks/{task_id}` | Retrieve specific task and saved workspace layout |
| `PATCH` | `/api/tasks/{task_id}` | Update task status or bookmark flag |
| `DELETE`| `/api/tasks/{task_id}` | Delete task from SQLite |
| `GET` | `/api/history` | List task history log with timestamps |
| `GET` | `/api/preferences` | Retrieve user preferences (theme, layout) |
| `PUT` | `/api/preferences` | Update user preferences |
| `GET` | `/api/demo/analytics` | Retrieve product usage telemetry |
| `GET` | `/api/demo/projects` | Retrieve project overview & interactive tasks |
| `PATCH`| `/api/demo/projects/{id}` | Update interactive task status in SQLite |

---

## 10. Troubleshooting

- **Backend Connection Error in Browser:**
  Ensure Uvicorn is running on port 8000:
  ```powershell
  python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
  ```
- **Port 8000 or 5173 in use:**
  Terminate lingering processes using `Get-Process python` or `Stop-Process -Id <PID>`.
- **Database Reset:**
  To reset the database, simply delete `backend/workspace.db`. It will be recreated and re-seeded automatically on server launch.

@echo off
title SmartSpace AI Launcher
echo ========================================================
echo   Starting Intent-to-Interface: Adaptive AI Workspace
echo ========================================================
echo.

echo [1/3] Starting FastAPI Backend on Port 8000...
start "SmartSpace AI Backend (FastAPI)" cmd /k "cd backend && set PYTHONPATH=. && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting React Frontend on Port 5173...
start "SmartSpace AI Frontend (Vite)" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 3 /nobreak >nul

echo [3/3] Launching Web Browser...
start http://127.0.0.1:5173/

echo.
echo ========================================================
echo   Workspace is running!
echo   - Frontend: http://127.0.0.1:5173/
echo   - Backend:  http://127.0.0.1:8000/
echo   - API Docs: http://127.0.0.1:8000/docs
echo ========================================================
echo Close the respective terminal windows to stop the servers.
pause

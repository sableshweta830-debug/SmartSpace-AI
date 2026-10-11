@echo off
title SmartSpace AI Launcher (Local Network & Localhost)
echo ========================================================
echo   Starting Intent-to-Interface: Adaptive AI Workspace
echo ========================================================
echo.

:: Detect Local LAN IP Address
for /f "tokens=*" %%a in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*','Ethernet*' -ErrorAction SilentlyContinue | Select-Object -First 1).IPAddress"') do set LOCAL_IP=%%a
if "%LOCAL_IP%"=="" set LOCAL_IP=127.0.0.1

echo [1/3] Starting FastAPI Backend on 0.0.0.0:8000...
start "SmartSpace AI Backend (FastAPI)" cmd /k "cd backend && set PYTHONPATH=. && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting React Frontend on 0.0.0.0:5173...
start "SmartSpace AI Frontend (Vite)" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0 --port 5173"

timeout /t 3 /nobreak >nul

echo [3/3] Launching Web Browser...
start http://localhost:5173/

echo.
echo ========================================================
echo   Workspace is running on Local Network!
echo   - Local PC:       http://localhost:5173/
echo   - Mobile / LAN:   http://%LOCAL_IP%:5173/
echo   - Backend API:    http://%LOCAL_IP%:8000/
echo   - API Docs:       http://%LOCAL_IP%:8000/docs
echo ========================================================
echo Kisi bhi phone ya doosre computer par 'http://%LOCAL_IP%:5173/' kholein.
echo Close the respective terminal windows to stop the servers.
pause

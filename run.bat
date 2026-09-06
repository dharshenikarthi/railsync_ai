@echo off
echo ===============================================================================
echo   RAILSYNC AI — AI-Powered Automatic Block Planning System
echo   Indian Railways Maintenance Optimization & Safety Coordination (SIH)
echo ===============================================================================
echo.
echo [*] Starting FastAPI Backend on http://localhost:8000 ...
echo [*] Starting React Vite Frontend on http://localhost:5173 ...
echo.

:: Launch backend in a separate terminal window
start "RAILSYNC AI - Backend (FastAPI + OR-Tools)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: Launch frontend in a separate terminal window
start "RAILSYNC AI - Frontend (React + Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait 3 seconds then open default browser to the UI
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo ===============================================================================
echo   Services are running!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo ===============================================================================
echo   Keep both windows open during demonstration.
echo.

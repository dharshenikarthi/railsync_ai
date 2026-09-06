@echo off
setlocal enabledelayedexpansion

echo ===============================================================================
echo   RAILSYNC AI — System Setup & Environment Provisioning
echo   AI-Powered Automatic Block Planning Prototype for Indian Railways (SIH)
echo ===============================================================================
echo.

:: 1. Copy .env if not exists
if not exist ".env" (
    echo [*] Creating .env from .env.example...
    copy .env.example .env >nul
) else (
    echo [*] Existing .env file found.
)

:: 2. Check Python
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] Python is not found in PATH. Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)
echo [*] Python verified.

:: 3. Check Node.js
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] Node.js is not found in PATH. Please install Node.js 18+ and add it to PATH.
    pause
    exit /b 1
)
echo [*] Node.js verified.

:: 4. Install Backend Dependencies
echo.
echo [*] Installing Python requirements from requirements.txt...
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo [!] Warning: Some pip packages had issues. Continuing...
)

:: 5. Initialize PostgreSQL Database
echo.
echo [*] Initializing RAILSYNC_DB schema and synthetic corridor data...
python database\init_db.py
if %ERRORLEVEL% neq 0 (
    echo [!] Database initialization had warnings. Verify PostgreSQL service is running on port 5432.
)

:: 6. Train Machine Learning Model
echo.
echo [*] Training/Verifying RandomForest Maintenance Priority Model...
python ml\train_model.py

:: 7. Install Frontend Dependencies
echo.
echo [*] Installing Frontend NPM packages...
cd frontend
call npm install
echo [*] Testing Frontend Production Build...
call npm run build
cd ..

echo.
echo ===============================================================================
echo   Setup Complete! You can now start the application using: run.bat
echo ===============================================================================
echo.
pause

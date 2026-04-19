@echo off
title Aigenda - Launching All Servers
color 0A

echo.
echo  ============================================================
echo    AIGENDA - AI Event Planner
echo    Starting 2 servers (merged backend)...
echo  ============================================================
echo.

:: ── Check Python ─────────────────────────────────────────────────────────────
set PYTHON=
where python >nul 2>&1 && set PYTHON=python
if "%PYTHON%"=="" (
    where python3 >nul 2>&1 && set PYTHON=python3
)
if "%PYTHON%"=="" (
    echo  [ERROR] Python not found.
    echo  Install from: https://python.org
    pause & exit /b 1
)

:: ── Install React frontend deps ───────────────────────────────────────────────
echo  [1/4] Installing React frontend dependencies...
cd /d "%~dp0ai-genda"
call npm install --silent
if %errorlevel% neq 0 ( echo  [ERROR] npm install failed for React & pause & exit /b 1 )

:: ── Install Python deps ───────────────────────────────────────────────────────
echo  [2/4] Installing Python backend dependencies...
cd /d "%~dp0backend"
%PYTHON% -m pip install -r requirements.txt -q
if %errorlevel% neq 0 ( echo  [WARNING] Some Python packages may have failed. Continuing... )

:: ── Launch servers ──────────────────────────────────────────────────────────
echo  [3/4] Launching servers...

cd /d "%~dp0backend"
start "Aigenda  |  Python Backend  (port 5001)" cmd /k "%PYTHON% server.py"

cd /d "%~dp0ai-genda"
start "Aigenda  |  React Frontend (port 3000)" cmd /k "npm start"

echo  [4/4] All servers launched!
echo.
echo  ============================================================
echo    React App      ->  http://localhost:3000
echo    Python API     ->  http://localhost:5001
echo    Production     ->  https://aigenda.onrender.com
echo  ============================================================
echo.
echo  Keep both terminal windows open while using the app.
echo.
echo  Test accounts:
echo    Alice  /  alice1234
echo    Bob    /  bob5678
echo    Adhi   /  nandha123
echo    Dev    /  nandha123
echo  ============================================================
echo.
pause

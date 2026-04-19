@echo off
title Aigenda - Launching All Servers
color 0A

echo.
echo  ============================================================
echo    AIGENDA - AI Event Planner
echo    Starting 3 servers...
echo  ============================================================
echo.

:: ── Check Node.js ────────────────────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found.
    echo  Install from: https://nodejs.org
    pause & exit /b 1
)

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

:: ── Install Node backend deps ─────────────────────────────────────────────────
echo  [1/5] Installing Node backend dependencies...
cd /d "%~dp0login-op-backend"
call npm install --silent
if %errorlevel% neq 0 ( echo  [ERROR] npm install failed for Node backend & pause & exit /b 1 )

:: ── Install React frontend deps ───────────────────────────────────────────────
echo  [2/5] Installing React frontend dependencies...
cd /d "%~dp0ai-genda"
call npm install --silent
if %errorlevel% neq 0 ( echo  [ERROR] npm install failed for React & pause & exit /b 1 )

:: ── Install Python deps ───────────────────────────────────────────────────────
echo  [3/5] Installing Python AI backend dependencies...
cd /d "%~dp0ai-genda-backend"
%PYTHON% -m pip install -r requirements.txt -q
if %errorlevel% neq 0 ( echo  [WARNING] Some Python packages may have failed. Continuing... )

:: ── Launch all 3 servers ──────────────────────────────────────────────────────
echo  [4/5] Launching servers...

cd /d "%~dp0login-op-backend"
start "Aigenda  |  Node Backend  (port 5000)" cmd /k "node server.js"

cd /d "%~dp0ai-genda-backend"
start "Aigenda  |  Python AI     (port 5001)" cmd /k "%PYTHON% server.py"

cd /d "%~dp0ai-genda"
start "Aigenda  |  React Frontend (port 3000)" cmd /k "npm start"

echo  [5/5] All servers launched!
echo.
echo  ============================================================
echo    React App  ->  http://localhost:3000    (opens in browser)
echo    Node API   ->  http://localhost:5000
echo    Python AI  ->  http://localhost:5001
echo  ============================================================
echo.
echo  Keep all 3 terminal windows open while using the app.
echo.
echo  Test accounts:
echo    Alice  /  alice1234
echo    Bob    /  bob5678
echo    Adhi   /  nandha123
echo    Dev    /  nandha123
echo  ============================================================
echo.
pause

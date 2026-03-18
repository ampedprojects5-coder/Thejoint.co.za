@echo off
REM Start The Joint order app (local preview). Double-click or run from repo root.
title The Joint - App (localhost:4001)
cd /d "%~dp0app\apps\app"
if not exist "package.json" (
  echo ERROR: app\apps\app\package.json not found. Run this from the repo root.
  pause
  exit /b 1
)
if not exist "%~dp0app\node_modules" (
  echo Installing dependencies...
  cd /d "%~dp0app"
  call npm install
  cd /d "%~dp0app\apps\app"
)
echo.
echo ========================================
echo   The Joint app - KEEP THIS WINDOW OPEN
echo   When ready, open: http://localhost:4001
echo ========================================
echo.
call npm run dev:new
echo.
echo Server stopped. Close this window or press any key.
pause

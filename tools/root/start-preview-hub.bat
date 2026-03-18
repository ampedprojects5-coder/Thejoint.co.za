@echo off
REM Start the preview hub (local page with links to website and app). Double-click or run from repo root.
title The Joint - Preview hub
cd /d "%~dp0"
if not exist "preview-hub\index.html" (
  echo ERROR: preview-hub\index.html not found. Run this from the repo root.
  pause
  exit /b 1
)
echo.
echo ========================================
echo   The Joint - PREVIEW HUB
echo   KEEP THIS WINDOW OPEN
echo   Your browser will open the hub page.
echo   From there, open Website (4000) and App (4001).
echo   Start those in two OTHER terminals:
echo     npm run start:website
echo     npm run start:app
echo ========================================
echo.
node scripts\serve-preview-hub.js
echo.
echo Server stopped. Close this window or press any key.
pause

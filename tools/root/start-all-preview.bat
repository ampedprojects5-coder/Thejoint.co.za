@echo off
REM Start locally hosted preview: hub page + website + application.
REM Opens 3 windows (keep all open). Browser opens to the hub with links to both.
title The Joint - Preview hub (keep open)
cd /d "%~dp0"

echo.
echo ========================================
echo   The Joint - Full local preview
echo   Starting Website and App in new windows...
echo   This window runs the PREVIEW HUB.
echo   Keep all windows open.
echo ========================================
echo.

start "The Joint - Website (4000)" cmd /k "cd /d ""%~dp0"" && npm run start:website"
start "The Joint - App (4001)"     cmd /k "cd /d ""%~dp0"" && npm run start:app"

node scripts\serve-preview-hub.js

echo.
pause

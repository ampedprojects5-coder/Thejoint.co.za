@echo off
REM One-click localhost preview: hub + website + app.
REM Double-click this file or run from repo root.
title The Joint - Preview (keep open)
cd /d "%~dp0"

echo.
echo   The Joint - Localhost preview
echo   Starting website (4000) and app (4001)...
echo   This window runs the hub. Keep all windows open.
echo.

node scripts\start-all-preview.js

echo.
pause

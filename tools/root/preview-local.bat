@echo off
REM New locally hosted preview: hub + website + app. One click.
title The Joint - Local preview (keep open)
cd /d "%~dp0"

echo.
echo   The Joint - Local preview
echo   Starting website and app in new windows...
echo   This window runs the hub. Keep it open.
echo.

node scripts\preview-local.js

echo.
pause

@echo off
REM Start the simple preview server. Double-click this file.
REM Keep this window OPEN — if you close it, localhost will refuse to connect.
title The Joint - Preview (keep this open)
cd /d "%~dp0"
if not exist "preview.html" (
  echo ERROR: preview.html not found. Run this from the repo root.
  pause
  exit /b 1
)
echo.
node scripts\serve-preview.js
echo.
echo Server stopped. Close this window or press any key.
pause

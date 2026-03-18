@echo off
REM Open the preview hub in your browser (no server needed).
REM Then start Website and App in two terminals: npm run start:website  and  npm run start:app
cd /d "%~dp0"
start "" "preview-hub\index.html"

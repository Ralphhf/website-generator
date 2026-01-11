@echo off
title Website Generator Watcher
echo.
echo Starting Website Generator Watcher...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0website-generator-watcher.ps1"
pause

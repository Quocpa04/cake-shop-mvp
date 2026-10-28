@echo off
title Backend API - Miette Bakery
echo ========================================================
echo   KHOI DONG BACKEND API (PORT 5000)
echo   MONGODB URI: mongodb://127.0.0.1:27018/miette_bakery
echo ========================================================
cd /d "%~dp0backend"
node server.js
pause

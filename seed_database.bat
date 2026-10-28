@echo off
title Seed Database - Miette Bakery
echo ========================================================
echo   NAP DU LIEU MAU VAO MONGODB (PORT 27018)
echo ========================================================
cd /d "%~dp0backend"
node seed.js
pause

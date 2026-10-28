@echo off
title MongoDB 27018 - Miette Bakery
echo ========================================================
echo   KHOI DONG MONGODB TREN PORT 27018 (KHONG DUNG PORT 27017)
echo ========================================================
if not exist "data\db_miette" mkdir "data\db_miette"
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --port 27018 --dbpath "%~dp0data\db_miette"
pause

@echo off
echo Start all services...

start "Backend" cmd /k "cd .\backend\OilCollectionScheme.API\ && dotnet run"
timeout /t 2 /nobreak >nul

start "Frontend" cmd /k "cd .\frontend\ && npm start" 

echo Frontend and Backend are working!
@echo off
echo.
echo ========================================
echo  Stock Market Predictor - Starting All Services
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB service is not running!
    echo Please start MongoDB manually or run: net start MongoDB
    echo.
)

echo Starting ML Service (Python/FastAPI) on port 8000...
start "ML Service" cmd /k "cd ml-service && python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak >nul

echo Starting Backend (Node.js/Express) on port 5000...
start "Backend API" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend (React/Vite) on port 5173...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo  All services are starting...
echo ========================================
echo.
echo  ML Service:  http://localhost:8000
echo  Backend API: http://localhost:5000
echo  Frontend:    http://localhost:5173
echo.
echo  ML Docs (Swagger): http://localhost:8000/docs
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:5173

echo.
echo Running! To stop all services, close all terminal windows.
echo.

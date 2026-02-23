@echo off
REM Install All Dependencies (Windows Command Prompt)

echo.
echo ========================================
echo  Installing Dependencies
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js not found! Please install from https://nodejs.org/
    exit /b 1
) else (
    node --version
    echo [OK] Node.js installed
)

REM Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Python not found! Please install from https://python.org/
    exit /b 1
) else (
    python --version
    echo [OK] Python installed
)

echo.
echo ========================================
echo  Installing Backend Dependencies
echo ========================================
echo.

cd backend
call npm install
if %errorlevel% neq 0 (
    echo [X] Backend installation failed!
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..

echo.
echo ========================================
echo  Installing Frontend Dependencies
echo ========================================
echo.

cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [X] Frontend installation failed!
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..

echo.
echo ========================================
echo  Installing ML Service Dependencies
echo ========================================
echo.

cd ml-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [X] ML Service installation failed!
    exit /b 1
)
echo [OK] ML Service dependencies installed
cd ..

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Make sure MongoDB is running
echo   2. Run: start-all.bat
echo.

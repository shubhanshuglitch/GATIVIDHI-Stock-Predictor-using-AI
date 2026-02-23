# Stock Market Predictor - Start All Services (PowerShell)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Stock Market Predictor - Starting All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -eq 'Running') {
        Write-Host "[✓] MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "[!] MongoDB service is not running!" -ForegroundColor Red
        Write-Host "    Please start MongoDB manually or run: Start-Service MongoDB" -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    Write-Host "[!] MongoDB service not found. Make sure MongoDB is installed and running." -ForegroundColor Red
    Write-Host "    You can start it manually with: mongod" -ForegroundColor Yellow
    Write-Host ""
}

# Start ML Service
Write-Host "Starting ML Service (Python/FastAPI) on port 8000..." -ForegroundColor Yellow
$mlPath = Join-Path $PSScriptRoot "ml-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mlPath'; python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Backend
Write-Host "Starting Backend (Node.js/Express) on port 5000..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend (React/Vite) on port 5173..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " All services are starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " ML Service:  " -NoNewline; Write-Host "http://localhost:8000" -ForegroundColor Green
Write-Host " Backend API: " -NoNewline; Write-Host "http://localhost:5000" -ForegroundColor Green
Write-Host " Frontend:    " -NoNewline; Write-Host "http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host " ML Docs (Swagger): " -NoNewline; Write-Host "http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

# Wait a bit for services to start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening application in your default browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "All services are running!" -ForegroundColor Green
Write-Host "To stop all services, close all PowerShell windows." -ForegroundColor Yellow
Write-Host ""

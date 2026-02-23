# Check Service Status (PowerShell)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Service Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test HTTP endpoint
function Test-Service {
    param (
        [string]$Name,
        [string]$Url
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        Write-Host "[✓] $Name is " -NoNewline -ForegroundColor Green
        Write-Host "UP" -ForegroundColor Green -NoNewline
        Write-Host " - $Url" -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "[✗] $Name is " -NoNewline -ForegroundColor Red
        Write-Host "DOWN" -ForegroundColor Red -NoNewline
        Write-Host " - $Url" -ForegroundColor Gray
        return $false
    }
}

# Function to test TCP port
function Test-Port {
    param (
        [string]$Name,
        [int]$Port
    )
    
    $test = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    if ($test.TcpTestSucceeded) {
        Write-Host "[✓] $Name (Port $Port) is " -NoNewline -ForegroundColor Green
        Write-Host "OPEN" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[✗] $Name (Port $Port) is " -NoNewline -ForegroundColor Red
        Write-Host "CLOSED" -ForegroundColor Red
        return $false
    }
}

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoUp = Test-Port -Name "MongoDB" -Port 27017

Write-Host ""
Write-Host "Checking Application Services..." -ForegroundColor Yellow

# Check ML Service
$mlUp = Test-Service -Name "ML Service    " -Url "http://localhost:8000"

# Check Backend
$backendUp = Test-Service -Name "Backend API  " -Url "http://localhost:5000"

# Check Frontend
$frontendUp = Test-Service -Name "Frontend     " -Url "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Summary
$allUp = $mongoUp -and $mlUp -and $backendUp -and $frontendUp
if ($allUp) {
    Write-Host " All services are running! ✓" -ForegroundColor Green
    Write-Host ""
    Write-Host " Access the application at: " -NoNewline
    Write-Host "http://localhost:5173" -ForegroundColor Cyan
} else {
    Write-Host " Some services are not running! ✗" -ForegroundColor Red
    Write-Host ""
    if (-not $mongoUp) {
        Write-Host " → Start MongoDB: " -NoNewline
        Write-Host "mongod" -ForegroundColor Yellow -NoNewline
        Write-Host " or " -NoNewline
        Write-Host "Start-Service MongoDB" -ForegroundColor Yellow
    }
    if (-not $mlUp) {
        Write-Host " → Start ML Service: " -NoNewline
        Write-Host "cd ml-service; python -m uvicorn app:app --port 8000" -ForegroundColor Yellow
    }
    if (-not $backendUp) {
        Write-Host " → Start Backend: " -NoNewline
        Write-Host "cd backend; npm start" -ForegroundColor Yellow
    }
    if (-not $frontendUp) {
        Write-Host " → Start Frontend: " -NoNewline
        Write-Host "cd frontend; npm run dev" -ForegroundColor Yellow
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

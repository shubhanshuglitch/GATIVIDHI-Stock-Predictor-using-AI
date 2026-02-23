# Stop All Services (PowerShell)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Stopping All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on port
function Stop-ProcessOnPort {
    param (
        [int]$Port,
        [string]$ServiceName
    )
    
    $connections = netstat -ano | Select-String ":$Port\s" | Select-String "LISTENING"
    
    if ($connections) {
        $connections | ForEach-Object {
            $line = $_.Line.Trim()
            $pid = ($line -split '\s+')[-1]
            
            if ($pid -and $pid -match '^\d+$') {
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        Write-Host "Stopping $ServiceName (PID: $pid)..." -ForegroundColor Yellow
                        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                        Write-Host "[✓] $ServiceName stopped" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "[!] Could not stop process $pid" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "[i] $ServiceName is not running" -ForegroundColor Gray
    }
}

# Stop services
Write-Host "Stopping Frontend (Port 5173)..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 5173 -ServiceName "Frontend"
Write-Host ""

Write-Host "Stopping Backend (Port 5000)..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 5000 -ServiceName "Backend"
Write-Host ""

Write-Host "Stopping ML Service (Port 8000)..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 8000 -ServiceName "ML Service"
Write-Host ""

# Also kill any node/python processes related to the project
Write-Host "Cleaning up remaining processes..." -ForegroundColor Yellow

# Kill uvicorn processes
Get-Process | Where-Object { $_.ProcessName -eq "python" -and $_.CommandLine -like "*uvicorn*" } | ForEach-Object {
    Write-Host "Stopping Python/Uvicorn (PID: $($_.Id))" -ForegroundColor Yellow
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " All services stopped!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: MongoDB was not stopped. To stop MongoDB:" -ForegroundColor Gray
Write-Host "  Stop-Service MongoDB" -ForegroundColor Gray
Write-Host ""

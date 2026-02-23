# Install All Dependencies (PowerShell)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "[✓] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[✗] Node.js not found! Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "[✓] npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[✗] npm not found!" -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "[✓] Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[✗] Python not found! Please install from https://python.org/" -ForegroundColor Red
    exit 1
}

# Check pip
try {
    $pipVersion = pip --version
    Write-Host "[✓] pip: installed" -ForegroundColor Green
} catch {
    Write-Host "[✗] pip not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[✓] Backend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] Frontend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[✓] Frontend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Installing ML Service Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location ml-service
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "[✗] ML Service installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[✓] ML Service dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "  2. Run: " -NoNewline -ForegroundColor White
Write-Host ".\start-all.ps1" -ForegroundColor Cyan -NoNewline
Write-Host " or " -ForegroundColor White -NoNewline
Write-Host "start-all.bat" -ForegroundColor Cyan
Write-Host ""

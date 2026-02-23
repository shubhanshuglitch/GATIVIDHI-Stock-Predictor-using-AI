# Production Deployment Script (PowerShell)
# This script helps prepare your app for production deployment

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Production Deployment Preparation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Step 1: Check Git
Write-Host "Step 1: Checking Git repository..." -ForegroundColor Yellow
try {
    git status | Out-Null
    Write-Host "[✓] Git repository detected" -ForegroundColor Green
} catch {
    Write-Host "[!] No git repository found. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "[✓] Git initialized" -ForegroundColor Green
}

# Step 2: Build Frontend
Write-Host ""
Write-Host "Step 2: Building frontend for production..." -ForegroundColor Yellow
Set-Location frontend
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "[✗] Frontend build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Step 3: Test Backend
Write-Host ""
Write-Host "Step 3: Testing backend..." -ForegroundColor Yellow
Set-Location backend
npm install --production=false
if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] Backend dependencies verified" -ForegroundColor Green
} else {
    Write-Host "[✗] Backend dependency check failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Step 4: Test ML Service
Write-Host ""
Write-Host "Step 4: Testing ML service..." -ForegroundColor Yellow
Set-Location ml-service
pip install -r requirements.txt --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "[✓] ML service dependencies verified" -ForegroundColor Green
} else {
    Write-Host "[✗] ML service dependency check failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Step 5: Environment Variables Check
Write-Host ""
Write-Host "Step 5: Environment variables checklist..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Have you prepared the following?" -ForegroundColor White
Write-Host "  [ ] MongoDB Atlas cluster created" -ForegroundColor Gray
Write-Host "  [ ] MongoDB connection string ready" -ForegroundColor Gray
Write-Host "  [ ] Strong JWT secret generated" -ForegroundColor Gray
Write-Host "  [ ] GitHub repository created" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Have you completed all the above? (y/n)"
if ($continue -ne 'y') {
    Write-Host ""
    Write-Host "Please complete the checklist and run this script again." -ForegroundColor Yellow
    Write-Host "See PRODUCTION.md for detailed instructions." -ForegroundColor Cyan
    exit 0
}

# Step 6: Git Commit
Write-Host ""
Write-Host "Step 6: Preparing Git commit..." -ForegroundColor Yellow

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "Creating .gitignore..." -ForegroundColor Yellow
    @"
node_modules/
__pycache__/
*.pyc
.env
.env.local
.env.production
dist/
build/
*.log
.DS_Store
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
}

# Add all files
git add .

# Check for changes
$status = git status --porcelain
if ($status) {
    Write-Host "Files to commit:" -ForegroundColor Gray
    git status --short
    Write-Host ""
    
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Prepare for production deployment"
    }
    
    git commit -m $commitMsg
    Write-Host "[✓] Changes committed" -ForegroundColor Green
} else {
    Write-Host "[i] No changes to commit" -ForegroundColor Gray
}

# Step 7: Final Instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Ready for Production Deployment!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Push to GitHub:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/yourusername/repo.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy ML Service & Backend:" -ForegroundColor White
Write-Host "   → Go to https://render.com" -ForegroundColor Cyan
Write-Host "   → Click 'New +' → 'Blueprint'" -ForegroundColor Gray
Write-Host "   → Connect your GitHub repo" -ForegroundColor Gray
Write-Host "   → Set environment variables (see PRODUCTION.md)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy Frontend:" -ForegroundColor White
Write-Host "   → Go to https://vercel.com" -ForegroundColor Cyan
Write-Host "   → Import your GitHub repo" -ForegroundColor Gray
Write-Host "   → Root Directory: frontend" -ForegroundColor Gray
Write-Host "   → Set VITE_API_URL environment variable" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed instructions, see: " -NoNewline -ForegroundColor White
Write-Host "PRODUCTION.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Good luck with your deployment!" -ForegroundColor Green
Write-Host ""

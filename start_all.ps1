# 🚀 NeuroScan AI: One-Click Launch Script

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   NEUROSCAN AI PLATFORM INITIALIZER   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if we are in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "dementia-detection")) {
    Write-Host "❌ Error: Please run this script from the root 'AG Java Project' folder." -ForegroundColor Red
    exit
}

# 1. Start Java Backend
Write-Host "📦 Starting Java Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; mvn spring-boot:run"

# 2. Start Python Microservice
Write-Host "🐍 Starting Python Microservice (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd python-backend; python app.py"

# 3. Start React Frontend
Write-Host "⚛️ Starting React Frontend (Port 5174)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd dementia-detection; npm run dev"

Write-Host ""
Write-Host "✅ All systems are initializing in separate windows." -ForegroundColor Green
Write-Host "-----------------------------------------"
Write-Host "Frontend: http://localhost:5174" -ForegroundColor White
Write-Host "Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "Python API: http://localhost:5000" -ForegroundColor White
Write-Host "-----------------------------------------"
Write-Host "Please wait for the terminals to finish loading." -ForegroundColor Gray

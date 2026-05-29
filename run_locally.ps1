# TruthLens Local Runner Script
# This script sets up and launches the microservices locally without requiring Docker Desktop

$ProjectRoot = Get-Location
$MavenDir = "$ProjectRoot\maven"
$MavenZip = "$ProjectRoot\maven.zip"
$MvnPath = "$MavenDir\apache-maven-3.9.6\bin\mvn.cmd"

# 1. Download Maven if not present
if (-not (Test-Path $MvnPath)) {
    Write-Host "Downloading Apache Maven for Java compilation (using curl)..." -ForegroundColor Cyan
    curl.exe -L -o $MavenZip "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    
    Write-Host "Extracting Maven..." -ForegroundColor Cyan
    Expand-Archive -Path $MavenZip -DestinationPath $MavenDir -Force
    Remove-Item $MavenZip
    Write-Host "Maven installed successfully at: $MvnPath" -ForegroundColor Green
} else {
    Write-Host "Maven already configured." -ForegroundColor Green
}

# 2. Setup and run Python NLP service
Write-Host "Setting up Python NLP service..." -ForegroundColor Cyan
cd "$ProjectRoot\nlp-service"
if (-not (Test-Path ".\venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
    py -m venv venv
}

Write-Host "Installing Python dependencies (FastAPI, NLTK, etc.)..." -ForegroundColor Cyan
& ".\venv\Scripts\pip" install -r requirements.txt

Write-Host "Starting Python FastAPI NLP service on port 8000..." -ForegroundColor Green
Start-Process -FilePath ".\venv\Scripts\python.exe" -ArgumentList "main.py" -WorkingDirectory "$ProjectRoot\nlp-service" -NoNewWindow -PassThru

# 3. Compile and run Spring Boot Backend
Write-Host "Starting Spring Boot backend compiling & launching on port 8080..." -ForegroundColor Green
# Pass environment vars for local mode
$env:MONGODB_URI = "mongodb://localhost:27017/truthlens"
$env:NLP_SERVICE_URL = "http://localhost:8000"
$env:JWT_SECRET = "dHJ1dGhsZW5zLXNlY3VyZS1qd3Qtc2VjcmV0LWtleS1mb3ItZmluYWwtcHJvamVjdC1jYXN0bGU="
$env:JWT_EXPIRATION_MS = "86400000"

Start-Process -FilePath $MvnPath -ArgumentList "spring-boot:run" -WorkingDirectory "$ProjectRoot\backend" -NoNewWindow -PassThru

# 4. Start React Frontend
Write-Host "Launching Vite React frontend development server on port 5173..." -ForegroundColor Green
cd "$ProjectRoot\frontend"
# Set backend URL to local host
$env:VITE_API_BASE_URL = "http://localhost:8080/api"
npm run dev

Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting Kutum Chatbot Backend Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location backend

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install fastapi uvicorn openai python-dotenv --quiet
Write-Host ""

Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Backend will run at: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "*** KEEP THIS WINDOW OPEN ***" -ForegroundColor Red
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Red
Write-Host ""

python main.py


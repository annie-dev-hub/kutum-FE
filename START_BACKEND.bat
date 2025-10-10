@echo off
echo ========================================
echo Starting Kutum Chatbot Backend Server
echo ========================================
echo.

cd backend

echo Installing dependencies...
pip install fastapi uvicorn openai python-dotenv --quiet
echo.

echo Starting server...
echo Backend will run at: http://localhost:8000
echo.
echo *** KEEP THIS WINDOW OPEN ***
echo Press CTRL+C to stop the server
echo.

python main.py

pause


@echo off
echo Starting Kutum Family Chatbot Backend...
echo.
echo Checking Python installation...
python --version
echo.

echo Installing dependencies...
pip install -r requirements.txt
echo.

echo Starting FastAPI server...
echo Server will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
python main.py


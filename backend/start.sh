#!/bin/bash
echo "Starting Kutum Family Chatbot Backend..."
echo ""
echo "Checking Python installation..."
python3 --version
echo ""

echo "Installing dependencies..."
pip3 install -r requirements.txt
echo ""

echo "Starting FastAPI server..."
echo "Server will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
python3 main.py


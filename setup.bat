@echo off
echo ========================================
echo  RA Detection - Complete Setup
echo ========================================
echo.
echo This script will set up both backend and frontend
echo.

REM Setup Backend
echo [1/3] Setting up Backend...
echo.
cd RA_backend

REM Create virtual environment
if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo.
        echo ❌ Failed to create virtual environment
        echo Please ensure Python 3.8+ is installed
        pause
        exit /b 1
    )
)

REM Activate and install dependencies
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

REM Check model file
if not exist "Best_EfficientNetB3.h5" (
    echo.
    echo ⚠️  WARNING: Model file not found!
    echo Please place Best_EfficientNetB3.h5 in RA_backend folder
)

cd ..

REM Setup Frontend
echo.
echo [2/3] Setting up Frontend...
echo.
cd RA_frontend

if not exist "node_modules\" (
    echo Installing Node.js dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install Node.js dependencies
        echo Please ensure Node.js and npm are installed
        pause
        exit /b 1
    )
)

cd ..

REM Create quick start guide
echo.
echo [3/3] Setup Complete!
echo.
echo ========================================
echo  Setup Successful! 
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (in one terminal):
echo    Double-click: start-backend.bat
echo    Or run: cd RA_backend ^&^& venv\Scripts\activate ^&^& python app.py
echo.
echo 2. Start Frontend (in another terminal):
echo    Double-click: start-frontend.bat
echo    Or run: cd RA_frontend ^&^& npm run dev
echo.
echo 3. Open browser: http://localhost:5173
echo.
echo ========================================
echo.
pause

@echo off
echo ========================================
echo  RA Detection - Starting Backend Server
echo ========================================
echo.

cd RA_backend

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Check if requirements are installed
echo Checking dependencies...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

REM Check if model file exists
if not exist "RA_Ordinal_Classification\efficientnet_ordinal.pth" (
    echo.
    echo ========================================
    echo  WARNING: Model file not found!
    echo ========================================
    echo.
    echo Please ensure efficientnet_ordinal.pth is in RA_backend\RA_Ordinal_Classification folder
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Start the server
echo.
echo Starting Flask server on http://localhost:5000
echo Press CTRL+C to stop the server
echo.
python app.py

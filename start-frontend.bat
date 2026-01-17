@echo off
echo ========================================
echo  RA Detection - Starting Frontend
echo ========================================
echo.

cd RA_frontend

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start the development server
echo.
echo Starting Vite development server...
echo Frontend will be available at http://localhost:5173
echo.
call npm run dev

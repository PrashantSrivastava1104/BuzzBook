@echo off
echo Starting Bus Booking System...

echo Starting Backend (Mock Mode)...
start "Backend Server" cmd /k "cd backend && npm run mock"

echo Starting Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev -- --host"

echo Waiting for servers to initialize...
timeout /t 5

echo Opening Application...
start http://localhost:5173/

echo Done! Servers are running in background windows.
pause

@echo off
echo Starting NEURVEXA backend and frontend...
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
echo Servers are starting in new windows. You can close this window.

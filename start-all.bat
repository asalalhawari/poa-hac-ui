@echo off
start "HAC Backend" cmd /k "npm run server"
start "HAC Frontend" cmd /k "npm run dev"

@echo off
echo ========================================
echo    Vereinskasse wird gestartet...
echo ========================================
echo.

cd /d "%~dp0"

echo Installiere Abhaengigkeiten (falls noetig)...
call npm install

echo.
echo Starte Server...
echo.
echo Die Kasse ist erreichbar unter:
echo http://localhost:3000
echo.
echo Zum Beenden druecke STRG+C
echo.

node server.js

pause

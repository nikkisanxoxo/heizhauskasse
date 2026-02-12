@echo off
echo ========================================
echo    Vereinskasse Docker Container
echo ========================================
echo.

REM Prüfe ob Docker läuft
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [FEHLER] Docker laeuft nicht!
    echo Bitte starte Docker Desktop.
    pause
    exit /b 1
)

echo [OK] Docker ist bereit
echo.

REM Prüfe ob Container läuft
docker ps | findstr "vereinskasse" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Container laeuft bereits!
    echo.
    echo Optionen:
    echo 1) Container neustarten
    echo 2) Container stoppen
    echo 3) Logs anzeigen
    echo 4) Abbrechen
    echo.
    set /p choice="Waehle eine Option (1-4): "
    
    if "%choice%"=="1" (
        echo Starte Container neu...
        docker-compose restart
        goto end
    )
    if "%choice%"=="2" (
        echo Stoppe Container...
        docker-compose down
        goto end
    )
    if "%choice%"=="3" (
        echo Zeige Logs (STRG+C zum Beenden)...
        docker-compose logs -f
        goto end
    )
    echo Abgebrochen.
    goto end
)

echo Starte Container...
echo.

REM Erstelle data-Verzeichnis
if not exist "data" mkdir data

REM Starte Container
docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo [OK] Container erfolgreich gestartet!
    echo.
    echo Die Kasse ist erreichbar unter:
    echo   http://kasse.internal (via Caddy Reverse Proxy)
    echo   http://localhost (Direktzugriff)
    echo.
    echo WICHTIG: Fuer kasse.internal siehe CADDY-SETUP.md
    echo (DNS oder Hosts-Datei muss konfiguriert werden)
    echo.
    echo Statistiken:
    echo   http://kasse.internal/statistics.html
    echo.
    echo Verwaltung:
    echo   http://kasse.internal/admin.html
    echo.
    echo Zum Stoppen: docker-compose down
    echo Logs anzeigen: docker-compose logs -f
) else (
    echo.
    echo [FEHLER] Fehler beim Starten!
    echo Pruefe die Logs: docker-compose logs
)

:end
echo.
echo ========================================
pause

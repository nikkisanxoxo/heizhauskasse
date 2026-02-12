#!/bin/bash

echo "========================================"
echo "   Vereinskasse Docker Container"
echo "========================================"
echo ""

# Prüfe ob Docker läuft
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker läuft nicht!"
    echo "Bitte starte Docker Desktop oder den Docker Service."
    exit 1
fi

echo "✅ Docker ist bereit"
echo ""

# Prüfe ob Container bereits läuft
if docker ps | grep -q vereinskasse; then
    echo "⚠️  Container läuft bereits!"
    echo ""
    echo "Optionen:"
    echo "1) Container neustarten"
    echo "2) Container stoppen"
    echo "3) Logs anzeigen"
    echo "4) Abbrechen"
    echo ""
    read -p "Wähle eine Option (1-4): " choice
    
    case $choice in
        1)
            echo "Starte Container neu..."
            docker-compose restart
            ;;
        2)
            echo "Stoppe Container..."
            docker-compose down
            exit 0
            ;;
        3)
            echo "Zeige Logs (STRG+C zum Beenden)..."
            docker-compose logs -f
            exit 0
            ;;
        *)
            echo "Abgebrochen."
            exit 0
            ;;
    esac
else
    echo "Starte Container..."
    echo ""
    
    # Erstelle data-Verzeichnis falls nicht vorhanden
    mkdir -p data
    
    # Starte Container
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Container erfolgreich gestartet!"
        echo ""
        echo "🍺 Die Kasse ist erreichbar unter:"
        echo "   http://kasse.internal (via Caddy Reverse Proxy)"
        echo "   http://localhost (Direktzugriff)"
        echo ""
        echo "⚠️  WICHTIG: Für kasse.internal siehe CADDY-SETUP.md"
        echo "   (DNS oder Hosts-Datei muss konfiguriert werden)"
        echo ""
        echo "📊 Statistiken:"
        echo "   http://kasse.internal/statistics.html"
        echo ""
        echo "⚙️  Verwaltung:"
        echo "   http://kasse.internal/admin.html"
        echo ""
        echo "Zum Stoppen: docker-compose down"
        echo "Logs anzeigen: docker-compose logs -f"
    else
        echo ""
        echo "❌ Fehler beim Starten!"
        echo "Prüfe die Logs: docker-compose logs"
    fi
fi

echo ""
echo "========================================"

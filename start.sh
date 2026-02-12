#!/bin/bash

echo "========================================"
echo "   Vereinskasse wird gestartet..."
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "Installiere Abhängigkeiten (falls nötig)..."
npm install

echo ""
echo "Starte Server..."
echo ""
echo "Die Kasse ist erreichbar unter:"
echo "http://localhost:3000"
echo ""
echo "Zum Beenden drücke STRG+C"
echo ""

node server.js

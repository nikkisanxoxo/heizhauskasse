# Vereinskasse - Version 2.1 Update

## 🎉 Neue Features

### 1. 🔢 Verbessertes Trinkgeld-Numpad

**Professionelles Numpad-Interface für Trinkgeld-Eingabe!**

Das Trinkgeld-Modal wurde komplett überarbeitet:

- ✅ **Großes Numpad** mit Ziffern 0-9 und Komma
- ✅ **Schnellauswahl** mit Beträgen von 0,50€ bis 5,00€ in 0,50€ Schritten
  - 0,50€, 1,00€, 1,50€, 2,00€, 2,50€, 3,00€, 3,50€, 4,00€, 4,50€, 5,00€
- ✅ **Löschen-Button** zum Zurücksetzen
- ✅ **Live-Anzeige** des eingegebenen Betrags
- ✅ Kleinere Schnellauswahl-Buttons, größere Numpad-Tasten
- ✅ Touch-optimiert für Tablet-Bedienung

**Bedienung:**
1. "💰 Trinkgeld" klicken
2. Entweder Schnellbetrag wählen ODER
3. Betrag mit Numpad eintippen
4. "Speichern" klicken

**Formatierung:**
- Automatische Formatierung als X,XX €
- Maximal 2 Nachkommastellen
- Maximal 5 Stellen vor dem Komma
- Nur ein Komma erlaubt

---

### 2. 🔄 Drag & Drop Sortierung der Getränke

**Reihenfolge der Getränke jetzt anpassbar!**

Im Verwaltungsbereich können Getränke jetzt per Drag & Drop sortiert werden:

- ✅ **☰ Symbol** zum Anfassen und Ziehen
- ✅ Getränke werden in der gewählten Reihenfolge gespeichert
- ✅ Reihenfolge wird sofort in der Kasse übernommen
- ✅ Visuelle Rückmeldung beim Ziehen
- ✅ Automatisches Speichern

**So sortierst du:**
1. Gehe zu `/admin.html`
2. Greife ein Getränk am ☰ Symbol
3. Ziehe es an die gewünschte Position
4. Loslassen - Fertig! Wird automatisch gespeichert

**Tipp:** Die Reihenfolge in der Verwaltung entspricht der Reihenfolge der Buttons in der Kasse!

---

### 3. 📊 Erweiterte CSV-Abrechnung pro Raum

**Detaillierte Abrechnung für jeden Raum!**

Der CSV-Export wurde erheblich erweitert:

**Neue Struktur:**
```
1. Detaillierte Getränkeliste (wie vorher)
   - Raum, Getränk, Anzahl, Umsatz

2. === ABRECHNUNG PRO RAUM ===
   Rolltore:
   - Getränke: 45
   - Einnahmen Getränke: 89,50€
   - Trinkgeld: 12,30€
   - Gesamt Rolltore: 101,80€

   Brücke:
   - Getränke: 38
   - Einnahmen Getränke: 76,00€
   - Trinkgeld: 8,70€
   - Gesamt Brücke: 84,70€

3. === GESAMT ===
   - Gesamt Getränke: 83
   - Gesamt Einnahmen Getränke: 165,50€
   - Gesamt Trinkgeld: 21,00€
   - Gesamt Einnahmen: 186,50€

4. Metadaten
   - Zeitraum
   - Export-Datum
```

**Trinkgeld-Verteilung:**
- Bei **Raum-Filter**: Gesamtes Trinkgeld dem gewählten Raum zugeordnet
- **Ohne Filter**: Trinkgeld anteilig nach Umsatz verteilt

**Verwendung:**
Perfekt für:
- Monatliche Abrechnungen
- Vergleich zwischen Räumen
- Buchhaltung und Finanzberichte
- Controlling

---

## 🗄️ Datenbank-Änderungen

```sql
-- Neue Spalte für Sortierung
ALTER TABLE drinks ADD COLUMN sort_order INTEGER DEFAULT 0;
```

Die `sort_order` Spalte speichert die Position jedes Getränks. Kleinere Werte = weiter oben.

---

## 🔧 Neue API-Endpoints

### Alle Getränke abrufen (inkl. inaktive)
```
GET /api/drinks/all
Response: [{ id, name, price, color, active, sort_order }, ...]
```

Wird vom Admin-Bereich verwendet, um auch deaktivierte Getränke anzuzeigen.

---

## 📝 Migrations-Anleitung

### Für bestehende Installationen:

**Option 1: Automatisch (empfohlen)**
```bash
# Container neu starten - Datenbank wird automatisch aktualisiert
docker-compose restart
```

**Option 2: Manuell**
```bash
# 1. Container stoppen
docker-compose down

# 2. Backup erstellen
cp -r data data_backup_$(date +%Y%m%d)

# 3. Neue Version deployen
docker-compose up -d --build

# 4. Testen
# Öffne http://localhost:3000/admin.html
# Sortiere Getränke per Drag & Drop
```

**Nach dem Update:**
1. Getränke werden initial in alphabetischer Reihenfolge angezeigt
2. Sortiere sie einmal manuell im Admin-Bereich
3. Reihenfolge wird gespeichert und bleibt erhalten

---

## 🎨 Empfohlene Getränke-Reihenfolge

**Nach Beliebtheit:**
1. Bier (meistverkauft zuerst)
2. Mate
3. Cola
4. Radler
5. Wasser

**Nach Kategorie:**
1. Alkoholische Getränke (Bier, Pils, Radler)
2. Softdrinks (Cola, Mate)
3. Wasser/Schorle

**Nach Preis:**
1. Premium-Getränke (teuerste zuerst)
2. Standard-Getränke
3. Wasser (günstigste zuletzt)

---

## 💡 Tipps & Best Practices

### Trinkgeld-Erfassung
- Schnellauswahl für gängige Beträge nutzen (1€, 2€, 5€)
- Numpad für ungerade Beträge (z.B. 3,75€)
- Regelmäßig erfassen (nicht am Ende des Abends alles auf einmal)

### Getränke-Sortierung
- Meistverkaufte Getränke nach oben
- Saisonale Getränke temporär prominent platzieren
- Deaktivierte Getränke sind unten (werden nicht in Kasse angezeigt)

### CSV-Export
- Monatlich exportieren für Buchhaltung
- Zeitraum-Filter nutzen für Events (z.B. Sommerfest)
- Raum-Filter für separate Abrechnungen

---

## 🐛 Bugfixes

- Getränke-Farben werden jetzt korrekt beim ersten Laden angezeigt
- Drag & Drop funktioniert auch bei vielen Getränken
- CSV-Export korrekt formatiert für Excel/Google Sheets
- Trinkgeld-Modal schließt korrekt nach Speichern

---

## 🔜 Geplante Features (v2.2)

- [ ] Tages-Abschluss Funktion
- [ ] Kassenstand-Verwaltung
- [ ] Mehrtägige Events mit Tagesbilanz
- [ ] Export als PDF (zusätzlich zu CSV)
- [ ] Notizen/Kommentare zu Transaktionen
- [ ] Barcode-Scanner Integration

---

## 📞 Support

Bei Fragen:
- Siehe CHANGELOG.md für v2.0 Features
- Siehe README.md für Grundlagen
- Logs prüfen: `docker-compose logs -f`

---

**Version 2.1 - Optimiert für professionelle Nutzung! 🍻**

_Erstellt: ${new Date().toLocaleDateString('de-DE')}_

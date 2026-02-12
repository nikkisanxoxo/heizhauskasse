# Vereinskasse - Version 2.0 Changelog

## 🎉 Neue Features

### 1. 🔒 Passwortschutz für Verwaltung und Statistiken

**Statistiken und Verwaltung sind jetzt durch ein Passwort geschützt!**

- Beim Öffnen von `/statistics.html` oder `/admin.html` erscheint ein Login-Dialog
- Passwort wird in der `docker-compose.yml` konfiguriert
- Standardpasswort: `meinPasswort123` (bitte ändern!)

**Passwort ändern:**
```yaml
# docker-compose.yml
environment:
  - ADMIN_PASSWORD=DeinSicheresPasswort123
```

Nach Änderung Container neu starten:
```bash
docker-compose down
docker-compose up -d
```

---

### 2. 🎨 Farbige Getränke-Buttons

**Jedes Getränk kann jetzt eine eigene Farbe haben!**

- Im Verwaltungsbereich kann für jedes Getränk eine Farbe ausgewählt werden
- Die Farbe wird im Kassenmodus als Button-Farbe verwendet
- Standardfarbe: Lila (#667eea)
- Farben werden in der Datenbank gespeichert

**So änderst du die Farbe:**
1. Gehe zu `/admin.html` (Passwort eingeben)
2. Klicke auf das Farb-Icon neben dem Getränk
3. Wähle eine Farbe aus
4. Klicke "Speichern"

**Farb-Vorschläge:**
- 🍺 Bier: #f59e0b (Orange/Gold)
- 🥤 Cola: #dc2626 (Rot)
- 🧃 Mate: #10b981 (Grün)
- 🍋 Radler: #fbbf24 (Gelb)
- 💧 Wasser: #3b82f6 (Blau)

---

### 3. 📊 CSV-Export der Statistiken

**Statistiken können jetzt als CSV-Datei exportiert werden!**

- Button "📥 Export CSV" im Statistik-Bereich
- Export enthält:
  - Alle Getränkeverkäufe (Raum, Getränk, Anzahl, Umsatz)
  - Zusammenfassung (Gesamt, Trinkgeld)
  - Zeitraum
- Dateiname: `statistik_DATUM_DATUM.csv`
- Kann in Excel, Google Sheets, etc. geöffnet werden

**So exportierst du:**
1. Gehe zu `/statistics.html`
2. Wähle optional Zeitraum/Raum
3. Klicke "Aktualisieren"
4. Klicke "📥 Export CSV"
5. Datei wird heruntergeladen

---

### 4. 💰 Trinkgeld-Funktion

**Neue Trinkgeld-Funktion im Kassenmodus!**

- Neuer Button "💰 Trinkgeld" in der Kassenoberfläche
- Angenehmes Eingabe-Modal mit Schnellauswahl
- Schnellauswahl: 1€, 2€, 5€, 10€, 20€, 50€
- Oder eigenen Betrag eintippen
- Trinkgeld wird pro Raum erfasst
- In Statistiken separat ausgewiesen

**So erfasst ihr Trinkgeld:**
1. Wähle einen Raum (Rolltore/Brücke)
2. Klicke auf "💰 Trinkgeld"
3. Wähle Schnellbetrag oder tippe eigenen Betrag ein
4. Klicke "Speichern"
5. Fertig! 🎉

**In Statistiken:**
- Eigene Karte "Trinkgeld" zeigt Gesamtsumme
- Separate Zeile in CSV-Export
- Nach Raum und Zeitraum filterbar

---

### 5. 🏠 Umbenennung der Räume

**Räume wurden umbenannt:**
- ~~Raum 1~~ → **Rolltore**
- ~~Raum 2~~ → **Brücke**

---

## 🗄️ Datenbank-Änderungen

Neue Datenbank-Struktur (automatisch beim ersten Start):

```sql
-- Neue Spalte in drinks Tabelle
ALTER TABLE drinks ADD COLUMN color TEXT DEFAULT '#667eea';

-- Neue Tabelle für Trinkgeld
CREATE TABLE tips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Wichtig:** Wenn ihr bereits eine Datenbank habt, wird die `color`-Spalte automatisch hinzugefügt. Bestehende Getränke bekommen die Standardfarbe #667eea.

---

## 🔧 Neue API-Endpoints

### Passwort-Validierung
```
POST /api/auth/validate
Body: { "password": "..." }
Response: { "valid": true/false }
```

### Trinkgeld hinzufügen
```
POST /api/tips
Body: { "room_id": 1, "amount": 5.00 }
```

### Geschützte Endpoints (benötigen Header)
```
Header: X-Admin-Password: DeinPasswort

POST /api/drinks (Getränk erstellen)
PUT /api/drinks/:id (Getränk bearbeiten)
```

---

## 📝 Migrations-Anleitung

### Für bestehende Installationen:

1. **Container stoppen:**
   ```bash
   docker-compose down
   ```

2. **Backup erstellen:**
   ```bash
   cp -r data data_backup_$(date +%Y%m%d)
   ```

3. **Neue Version deployen:**
   ```bash
   docker-compose pull  # Falls Image von Registry
   # ODER
   docker-compose up -d --build  # Falls lokal gebaut
   ```

4. **Passwort setzen:**
   Bearbeite `docker-compose.yml`:
   ```yaml
   environment:
     - ADMIN_PASSWORD=DeinSicheresPasswort
   ```

5. **Container starten:**
   ```bash
   docker-compose up -d
   ```

6. **Testen:**
   - Öffne http://localhost:3000/admin.html
   - Passwort eingeben
   - Farben für Getränke setzen

---

## 🎨 Beispiel-Konfiguration

### Empfohlene Getränke-Farben:

```
Bier     → #f59e0b (Orange/Gold)
Mate     → #10b981 (Grün)
Pils     → #fbbf24 (Gelb)
Radler   → #a3e635 (Hellgrün)
Cola     → #dc2626 (Rot)
Wasser   → #3b82f6 (Blau)
Limo     → #f97316 (Orange)
Schorle  → #ec4899 (Pink)
```

### Sichere Passwörter:

```yaml
# Gut ✓
ADMIN_PASSWORD=Vereinskasse2025!XyZ

# Schlecht ✗
ADMIN_PASSWORD=admin
ADMIN_PASSWORD=123456
```

---

## 🐛 Bugfixes

- Datenbank-Pfad jetzt korrekt in Docker-Volume
- Bessere Fehlerbehandlung bei API-Requests
- Mobile-optimierte Passwort-Dialoge

---

## 🔜 Geplante Features (v2.1)

- [ ] Dunkelmodus
- [ ] Mitglieder-Accounts mit Guthaben
- [ ] Barcode-Scanner Integration
- [ ] Inventar-Verwaltung
- [ ] Export als PDF
- [ ] Multi-Language Support

---

## 📞 Support

Bei Fragen zu den neuen Features:
- Siehe README.md für Grundlagen
- Siehe DOCKER.md für Docker-spezifische Fragen
- Prüfe Logs: `docker-compose logs -f`

---

**Viel Spaß mit den neuen Features! 🍻**

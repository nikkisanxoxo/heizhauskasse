# Vereinskasse - Installationsanleitung

Ein einfaches, selbst-gehostetes Kassensystem für Vereinsgetränke.

## 📋 Voraussetzungen

- Ein Computer oder Raspberry Pi (läuft 24/7 oder bei Bedarf)
- Node.js (Version 16 oder höher)
- Tablets oder Smartphones mit Webbrowser (Chrome, Firefox, Safari)

## 🚀 Installation

### Schritt 1: Node.js installieren

#### Auf Windows:
1. Gehe zu https://nodejs.org/
2. Lade die LTS-Version herunter
3. Installiere mit Doppelklick

#### Auf Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm
```

#### Auf Raspberry Pi:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Schritt 2: Projekt einrichten

1. Lade den Ordner `vereinskasse` auf deinen Computer/Server
2. Öffne ein Terminal/Kommandozeile im Projektordner
3. Installiere die Abhängigkeiten:

```bash
npm install
```

### Schritt 3: Server starten

```bash
npm start
```

Du solltest sehen:
```
🍺 Vereinskasse läuft auf http://localhost:3000
📊 Statistiken: http://localhost:3000/statistics.html
```

### Schritt 4: Auf Tablets zugreifen

1. Finde die IP-Adresse deines Servers:
   - Windows: `ipconfig` im Terminal
   - Linux/Mac: `ip addr` oder `ifconfig`
   - Beispiel: `192.168.1.100`

2. Öffne auf deinem Tablet den Browser und gehe zu:
   ```
   http://192.168.1.100:3000
   ```

3. Erstelle ein Lesezeichen für schnellen Zugriff

## 📱 Verwendung

### Kassenmodus (Hauptseite)
- **URL:** `http://[SERVER-IP]:3000`
- Wähle einen Raum (Raum 1 oder Raum 2)
- Klicke auf Getränke, um sie zum Warenkorb hinzuzufügen
- Passe Mengen mit +/- Buttons an
- Klicke "Bezahlt" wenn Kunde bezahlt hat
- Klicke "Abbrechen" um Warenkorb zu leeren

### Statistiken ansehen
- **URL:** `http://[SERVER-IP]:3000/statistics.html`
- Filter nach Datum oder Raum
- Sieh Gesamtumsatz und verkaufte Mengen
- Grafische Darstellung der beliebtesten Getränke

### Getränke verwalten
- **URL:** `http://[SERVER-IP]:3000/admin.html`
- Neue Getränke hinzufügen
- Preise ändern
- Getränke aktivieren/deaktivieren

## 🔧 Konfiguration

### Andere Räume hinzufügen
Bearbeite `server.js` Zeile 33-36 und füge weitere Räume hinzu:
```javascript
insertRoom.run('Raum 3');
insertRoom.run('Keller');
```

### Port ändern
Bearbeite `server.js` Zeile 6:
```javascript
const PORT = 8080; // Statt 3000
```

## 🔄 Automatischer Start beim Systemstart

### Windows (Task Scheduler):
1. Erstelle `start-kasse.bat`:
   ```batch
   cd C:\Pfad\zu\vereinskasse
   node server.js
   ```
2. Füge zum Task Scheduler hinzu

### Linux (systemd):
1. Erstelle `/etc/systemd/system/vereinskasse.service`:
   ```ini
   [Unit]
   Description=Vereinskasse
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/vereinskasse
   ExecStart=/usr/bin/node server.js
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```

2. Aktiviere den Service:
   ```bash
   sudo systemctl enable vereinskasse
   sudo systemctl start vereinskasse
   ```

## 💾 Backup

Die Datenbank ist in der Datei `vereinskasse.db` gespeichert.

**Regelmäßiges Backup:**
```bash
# Kopiere die Datenbank
cp vereinskasse.db vereinskasse_backup_$(date +%Y%m%d).db
```

**Automatisches Backup (Linux/Cron):**
```bash
# Crontab öffnen
crontab -e

# Füge hinzu (täglich um 2 Uhr nachts):
0 2 * * * cp /home/pi/vereinskasse/vereinskasse.db /home/pi/backups/vereinskasse_$(date +\%Y\%m\%d).db
```

## 🌐 Zugriff von außerhalb des Netzwerks

**⚠️ WICHTIG:** Öffentlicher Zugriff birgt Sicherheitsrisiken!

Für sicheren Zugriff empfehlen wir:
1. **VPN** (z.B. WireGuard oder Tailscale)
2. **Cloudflare Tunnel** (kostenlos)
3. **Reverse Proxy mit Passwort** (nginx + BasicAuth)

## 🛠️ Problemlösung

### Server startet nicht:
```bash
# Prüfe ob Port bereits belegt ist
netstat -ano | grep 3000  # Linux/Mac
netstat -ano | findstr 3000  # Windows
```

### Tablets können nicht verbinden:
1. Prüfe Firewall-Einstellungen
2. Stelle sicher, dass alle Geräte im gleichen Netzwerk sind
3. Prüfe die Server-IP mit `ipconfig` oder `ip addr`

### Datenbank zurücksetzen:
```bash
# VORSICHT: Löscht alle Daten!
rm vereinskasse.db
# Server neu starten - Datenbank wird neu erstellt
```

## 📊 Daten exportieren

Die Datenbank ist SQLite. Zum Exportieren:

```bash
# Als CSV exportieren
sqlite3 vereinskasse.db "SELECT * FROM transactions" -csv > export.csv
```

## 🔐 Sicherheit

Für den internen Vereinsgebrauch ist das System ausreichend. Für öffentlichen Zugriff solltest du:

1. **HTTPS einrichten** (Let's Encrypt)
2. **Passwortschutz hinzufügen** (BasicAuth oder Login-System)
3. **Regelmäßige Backups** machen
4. **Updates** einspielen

## 📞 Support

Bei Problemen:
1. Prüfe die Logs im Terminal
2. Prüfe die Browser-Console (F12)
3. Kontaktiere das Vereinsmitglied, das das System eingerichtet hat

## 📜 Lizenz

MIT License - Frei verwendbar für private und kommerzielle Zwecke.

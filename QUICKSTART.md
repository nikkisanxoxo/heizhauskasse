# 🚀 Vereinskasse - Quick Start Guide

## Komplette Einrichtung in 5 Minuten

### Voraussetzungen
- Docker Desktop installiert (Windows/Mac) oder Docker Engine (Linux)
- Server/PC mit fester IP-Adresse im Netzwerk

---

## ⚡ Installation

### Schritt 1: Projekt entpacken
```bash
# Entpacke vereinskasse-docker.tar.gz
tar -xzf vereinskasse-docker.tar.gz
cd vereinskasse
```

### Schritt 2: Passwort ändern
Bearbeite `docker-compose.yml`:
```yaml
environment:
  - ADMIN_PASSWORD=DeinSicheresPasswort123  # ← ÄNDERN!
```

### Schritt 3: Container starten
```bash
docker-compose up -d
```

Das wars! Container laufen. ✅

---

## 🌐 DNS/Netzwerk einrichten

### Schritt 4: Server-IP finden
```bash
# Linux/Mac
hostname -I

# Windows
ipconfig

# Beispiel-Ergebnis: 192.168.1.100
```

### Schritt 5: DNS konfigurieren

**Option A - Router (Empfohlen):**
1. Router-Oberfläche öffnen (z.B. http://192.168.1.1)
2. Gehe zu: Netzwerk → Hostnamen / DNS
3. Eintrag hinzufügen:
   - Hostname: `kasse.internal`
   - IP: `192.168.1.100` (deine Server-IP)
4. Speichern

**Option B - Hosts-Datei (Schnell, für Tests):**

Auf **jedem Tablet/PC** die Hosts-Datei bearbeiten:

Windows: `C:\Windows\System32\drivers\etc\hosts`
```
192.168.1.100  kasse.internal
```

Linux/Mac: `/etc/hosts`
```
192.168.1.100  kasse.internal
```

---

## 🧪 Testen

### Schritt 6: DNS testen
```bash
ping kasse.internal
```

Sollte antworten mit: `64 bytes from 192.168.1.100...` ✅

### Schritt 7: Browser öffnen
```
http://kasse.internal
```

Du solltest die Vereinskasse sehen! 🎉

---

## 📱 Tablets einrichten

### Auf jedem Tablet:

1. **DNS/Hosts konfigurieren** (siehe Schritt 5)
2. **Browser öffnen:** Chrome, Firefox oder Safari
3. **URL eingeben:** `http://kasse.internal`
4. **Lesezeichen erstellen:**
   - Chrome: ⋮ → ⭐ zu Lesezeichen
   - Safari: Share → Zum Home-Bildschirm
5. **Optional:** Kiosk-Modus aktivieren

### Empfohlene Tablet-Apps:
- **Android:** "Fully Kiosk Browser" (Vollbild-Modus)
- **iOS:** Safari + Geführter Zugriff

---

## 🍺 Erste Schritte

### 1. Admin-Passwort merken
Das Passwort aus `docker-compose.yml` brauchst du für:
- Statistiken (`/statistics.html`)
- Verwaltung (`/admin.html`)

### 2. Räume verstehen
Es gibt 3 Räume:
- **Rolltore** - Erste Bar
- **Brücke** - Zweite Bar
- **Eigenverbrauch** - Interner Verbrauch

### 3. Getränke prüfen
Die folgenden 12 Getränke sind vorinstalliert:

| Getränk | Preis |
|---------|-------|
| Pils 0,33 | 3,00 € |
| Bier | 3,50 € |
| Weinschorle | 3,50 € |
| Radler | 3,50 € |
| Alkoholfrei Bier | 3,00 € |
| Club Mate | 3,50 € |
| Spezi | 3,00 € |
| Schorle | 2,50 € |
| Wasser | 1,50 € |
| Shot | 2,00 € |
| Sekt | 6,00 € |
| Longdrink | 7,00 € |

Anpassen unter: `http://kasse.internal/admin.html`

---

## 🎯 Typischer Arbeitsablauf

### Bar-Mitarbeiter (Kasse):
1. Tablet entsperren
2. Browser öffnen → `kasse.internal`
3. **Raum wählen** (Rolltore / Brücke)
4. **Getränke antippen** (z.B. 2× Bier, 1× Mate)
5. Kunde zahlt → **"Bezahlt"** klicken
6. Fertig! Transaktion gespeichert

### Trinkgeld erfassen:
1. **Raum wählen**
2. **"💰 Trinkgeld"** klicken
3. Betrag eingeben (Numpad oder Schnellauswahl)
4. **"Speichern"** klicken

### Monats-Abrechnung (Vorstand):
1. Browser öffnen → `kasse.internal/statistics.html`
2. **Passwort eingeben**
3. Zeitraum wählen (z.B. 01.02.2025 - 28.02.2025)
4. **"📥 Export CSV"** klicken
5. Datei in Excel öffnen
6. Abrechnung prüfen:
   - Rolltore: X Getränke, Y€ Umsatz, Z€ Trinkgeld
   - Brücke: X Getränke, Y€ Umsatz, Z€ Trinkgeld
   - Eigenverbrauch: X Getränke
   - **Gesamt: X Getränke, Y€ Einnahmen**

---

## 🔧 Verwaltung

### Getränke hinzufügen:
```
http://kasse.internal/admin.html
→ Passwort eingeben
→ Name, Preis, Farbe eintragen
→ "+ Hinzufügen"
```

### Preise ändern:
```
http://kasse.internal/admin.html
→ Preis ändern
→ "Speichern"
```

### Reihenfolge ändern:
```
http://kasse.internal/admin.html
→ Getränk am ☰ Symbol greifen
→ An neue Position ziehen
→ Automatisch gespeichert
```

---

## 📊 URLs im Überblick

| URL | Funktion | Passwort? |
|-----|----------|-----------|
| `http://kasse.internal` | Hauptkasse | ❌ Nein |
| `http://kasse.internal/statistics.html` | Statistiken & Export | ✅ Ja |
| `http://kasse.internal/admin.html` | Getränke-Verwaltung | ✅ Ja |

---

## 💾 Backup

### Datenbank sichern:
```bash
# Einfaches Backup
cp -r data data_backup_$(date +%Y%m%d)

# Als Archiv
tar -czf backup_$(date +%Y%m%d).tar.gz data/
```

### Automatisches Backup (Linux/Cron):
```bash
crontab -e

# Täglich um 2 Uhr nachts
0 2 * * * cd /pfad/zu/vereinskasse && cp -r data data_backup_$(date +\%Y\%m\%d)
```

---

## 🐛 Probleme?

### "kasse.internal nicht gefunden"
→ DNS/Hosts nicht konfiguriert
→ Siehe Schritt 5

### "502 Bad Gateway"
→ Container läuft nicht
```bash
docker-compose ps
docker-compose restart
```

### "Passwort falsch"
→ Prüfe `docker-compose.yml`
→ Groß-/Kleinschreibung beachten

### Container startet nicht
```bash
docker-compose logs
```

---

## 🔄 Updates

### Version aktualisieren:
```bash
# 1. Stoppen
docker-compose down

# 2. Backup
cp -r data data_backup_$(date +%Y%m%d)

# 3. Neue Version deployen
docker-compose up -d --build
```

---

## 📞 Checkliste für Produktiv-Start

- [ ] Docker installiert und läuft
- [ ] Passwort in `docker-compose.yml` geändert
- [ ] Container gestartet (`docker-compose up -d`)
- [ ] Server-IP ermittelt
- [ ] DNS/Hosts konfiguriert (Router oder Hosts-Datei)
- [ ] Browser-Test: `http://kasse.internal` erreichbar
- [ ] Admin-Passwort getestet (`/admin.html`)
- [ ] Getränkeliste geprüft und angepasst
- [ ] Tablets eingerichtet (Hosts + Lesezeichen)
- [ ] Test-Verkauf durchgeführt
- [ ] Statistik-Export getestet
- [ ] Backup-Strategie festgelegt

---

## 🎓 Schulung für Bar-Personal

### 5-Minuten Einweisung:

1. **Tablet entsperren**
2. **Lesezeichen "Kasse" öffnen**
3. **Raum wählen** (z.B. "Rolltore")
4. **Getränke antippen** für Bestellung
5. **Menge anpassen** mit +/- falls nötig
6. **"Bezahlt"** klicken nach Zahlung
7. **"Abbrechen"** bei Fehler
8. **"💰 Trinkgeld"** für Trinkgeld-Erfassung

**Wichtig:**
- Immer richtigen Raum wählen!
- Bei Problemen: Seite neu laden (F5)
- Bei technischen Problemen: Vorstand kontaktieren

---

## 💡 Tipps & Best Practices

### Für Bar-Betrieb:
✅ Tablets in Tablet-Halterungen montieren
✅ Ladekabel permanent angeschlossen
✅ Bildschirm-Timeout deaktivieren
✅ Kiosk-Modus aktivieren (verhindert versehentliches Schließen)

### Für Buchhaltung:
✅ Monatlicher Export als CSV
✅ Backup vor Jahreswechsel
✅ Eigenverbrauch separat prüfen
✅ Trinkgeld-Abrechnung mit Mitarbeitern

### Für IT/Wartung:
✅ Wöchentliches Backup
✅ Logs bei Problemen prüfen
✅ Updates außerhalb der Öffnungszeiten
✅ Test-System für neue Features

---

**Viel Erfolg mit eurer Vereinskasse! 🍻**

Bei Fragen: Siehe `README.md`, `DOCKER.md` oder `CADDY-SETUP.md`

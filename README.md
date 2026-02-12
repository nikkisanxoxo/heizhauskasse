# 🍺 Vereinskasse - Einfaches Getränke-Kassensystem

Ein selbst-gehostetes, browserbasiertes Kassensystem für Vereinsgetränke mit integrierter Statistik.

## ✨ Features

- ✅ **Einfache Bedienung**: Touch-optimierte Oberfläche für Tablets
- ✅ **Multi-Room**: Separate Erfassung für mehrere Räume/Bars
- ✅ **Erweiterbar**: Getränke einfach hinzufügen/bearbeiten
- ✅ **Statistiken**: Detaillierte Auswertungen nach Datum, Raum und Getränk
- ✅ **Offline-fähig**: Funktioniert im lokalen Netzwerk ohne Internet
- ✅ **Keine Cloud**: Alle Daten bleiben bei euch
- ✅ **Kostenlos**: Open Source, keine laufenden Kosten

## 🖥️ Technologie

- **Backend**: Node.js + Express + SQLite
- **Frontend**: Vanilla HTML/CSS/JavaScript (keine Frameworks)
- **Datenbank**: SQLite (eine einzige Datei, einfach zu sichern)
- **Hosting**: Läuft auf PC, Raspberry Pi oder beliebigem Linux-Server

## 📸 Screenshots

### Kassenmodus
Einfaches Interface zum Erfassen von Getränkeverkäufen:
- Raumauswahl (Raum 1 / Raum 2)
- Getränke-Buttons mit Preisen
- Warenkorb mit Mengenanpassung
- Gesamtbetrag-Anzeige

### Statistiken
Detaillierte Auswertungen:
- Verkaufte Getränke nach Menge
- Umsatz nach Getränk
- Filterbar nach Datum und Raum
- Visuelle Diagramme

### Verwaltung
Getränke-Management:
- Neue Getränke hinzufügen
- Preise ändern
- Getränke aktivieren/deaktivieren

## 🚀 Schnellstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Server starten
npm start

# 3. Browser öffnen
# http://localhost:3000
```

Detaillierte Anleitung → siehe [INSTALLATION.md](INSTALLATION.md)

## 📁 Projektstruktur

```
vereinskasse/
├── server.js              # Backend (API + Datenbank)
├── package.json           # Node.js Abhängigkeiten
├── public/                # Frontend-Dateien
│   ├── index.html         # Kassenmodus
│   ├── statistics.html    # Statistiken
│   └── admin.html         # Verwaltung
├── vereinskasse.db        # SQLite Datenbank (wird automatisch erstellt)
├── INSTALLATION.md        # Installations- und Nutzungsanleitung
└── README.md             # Diese Datei
```

## 🔧 API-Endpunkte

### Räume
- `GET /api/rooms` - Alle Räume abrufen

### Getränke
- `GET /api/drinks` - Aktive Getränke abrufen
- `POST /api/drinks` - Neues Getränk hinzufügen
- `PUT /api/drinks/:id` - Getränk bearbeiten

### Transaktionen
- `POST /api/transactions` - Verkauf erfassen
- `GET /api/transactions` - Letzte Transaktionen abrufen

### Statistiken
- `GET /api/statistics?start_date=&end_date=&room_id=` - Statistiken abrufen

## 💾 Datenbank-Schema

### Tabelle: `rooms`
```sql
id INTEGER PRIMARY KEY
name TEXT UNIQUE NOT NULL
```

### Tabelle: `drinks`
```sql
id INTEGER PRIMARY KEY
name TEXT UNIQUE NOT NULL
price REAL NOT NULL
active INTEGER DEFAULT 1
```

### Tabelle: `transactions`
```sql
id INTEGER PRIMARY KEY
room_id INTEGER NOT NULL
drink_id INTEGER NOT NULL
quantity INTEGER NOT NULL
total_price REAL NOT NULL
timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
```

## 🔒 Sicherheit

**Für den internen Vereinsgebrauch im lokalen Netzwerk** ist dieses System gedacht. Es enthält:

- ✅ Keine Passwörter (für schnelle Bedienung)
- ✅ Keine Verschlüsselung (HTTP statt HTTPS)
- ✅ Keine Benutzerrollen

**Das ist bewusst so, für einfache Bedienung!**

Für öffentlichen Zugriff müsst ihr zusätzliche Sicherheitsmaßnahmen implementieren.

## 🛠️ Anpassungen

### Weitere Räume hinzufügen
Bearbeite `server.js` und füge in der `initData()` Funktion weitere Räume hinzu.

### Andere Getränke vorbelegen
Ändere die Standardgetränke in `server.js` in der `initData()` Funktion.

### Design anpassen
Alle CSS-Styles sind inline in den HTML-Dateien. Ändere Farben und Layouts nach Belieben.

### Port ändern
Ändere `const PORT = 3000;` in `server.js` zu einem anderen Port.

## 📊 Verwendung im Verein

### Empfohlenes Setup:
1. **Server**: Alter PC oder Raspberry Pi 4
2. **Tablets**: 2x gebrauchte Android-Tablets (ab 50€/Stück)
3. **Netzwerk**: WLAN im Vereinsheim
4. **Zugriff**: Tablets mit Browser-Lesezeichen auf Startseite

### Workflow:
1. Tablets im Kiosk-Modus betreiben (Vollbild-Browser)
2. Server läuft dauerhaft (oder bei Bedarf einschalten)
3. Getränkeverkauf über Touch-Interface
4. Statistiken monatlich auswerten
5. Wöchentliches Backup der Datenbank

## 🤝 Beitragen

Das ist ein Community-Projekt. Verbesserungsvorschläge willkommen!

Mögliche Erweiterungen:
- [ ] Barcode-Scanner Integration
- [ ] Kassenbuch-Export für Finanzamt
- [ ] Mitglieder-Accounts mit Guthaben
- [ ] Inventar-Verwaltung
- [ ] Mobile App (React Native / Flutter)
- [ ] Multi-Language Support

## 📝 Lizenz

MIT License - Nutzt es wie ihr wollt, kommerziell oder privat.

## 💡 Warum selbst erstellt?

- Fertige Kassensysteme sind oft überdimensioniert
- Monatliche Kosten für Cloud-Services
- Ihr wollt volle Kontrolle über eure Daten
- Anpassungen nach euren Wünschen
- Lernprojekt für Vereinsmitglieder

## 🆘 Support

Bei Fragen oder Problemen:
1. Lest die [INSTALLATION.md](INSTALLATION.md)
2. Prüft die Browser-Console auf Fehler (F12)
3. Schaut in die Server-Logs

---

**Viel Erfolg mit eurem Kassensystem! 🍻**

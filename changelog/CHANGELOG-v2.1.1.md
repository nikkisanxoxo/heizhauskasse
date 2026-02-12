# Vereinskasse - Version 2.1.1 Hotfix

## 🐛 Kritischer Bugfix

### Trinkgeld-Zuordnung zu Räumen korrigiert

**Problem:** Trinkgeld wurde anteilig nach Umsatz auf Räume verteilt, anstatt dem tatsächlichen Raum zugeordnet zu werden, in dem es erfasst wurde.

**Lösung:** Trinkgeld wird jetzt korrekt dem Raum zugeordnet, in dem es eingegeben wurde.

**Details:**
- Trinkgeld wird beim Erfassen immer mit `room_id` gespeichert
- API liefert jetzt `tips_per_room` Array mit korrekten Zuordnungen
- CSV-Export verwendet echte Daten statt Schätzungen
- Statistiken zeigen korrekte Trinkgeld-Beträge pro Raum

**Beispiel:**
```
Vorher (FALSCH):
- Rolltore: 80€ Umsatz → 12€ Trinkgeld (60% von 20€)
- Brücke: 40€ Umsatz → 8€ Trinkgeld (40% von 20€)

Nachher (KORREKT):
- Rolltore: 80€ Umsatz → 15€ Trinkgeld (tatsächlich erfasst)
- Brücke: 40€ Umsatz → 5€ Trinkgeld (tatsächlich erfasst)
```

---

## ➕ Neue Features

### Dritter Raum: "Eigenverbrauch"

**Neuer Raum für internen Verbrauch hinzugefügt!**

Die Vereinskasse hat jetzt drei Räume:
1. **Rolltore** - Bar 1
2. **Brücke** - Bar 2
3. **Eigenverbrauch** - Für internen Verbrauch (Vorstand, Helfer, etc.)

**Verwendung:**
- Getränke für Vorstandsmitglieder
- Verbrauch bei Veranstaltungen
- Helfer-Bewirtung
- Kostenlose/vergünstigte Ausgaben

**In Statistiken:**
- Eigenverbrauch wird separat ausgewiesen
- Kann zur Kostenkontrolle genutzt werden
- Im CSV-Export mit eigener Abrechnung

---

## 🔧 API-Änderungen

### Neue Response-Struktur für Statistiken

```javascript
GET /api/statistics

Response:
{
  statistics: [...],  // Wie vorher
  summary: {
    total_items: 123,
    total_revenue: 456.78,
    total_tips: 50.00,
    tip_count: 15
  },
  tips_per_room: [    // NEU!
    {
      room_name: "Rolltore",
      room_id: 1,
      total_tips: 30.00
    },
    {
      room_name: "Brücke",
      room_id: 2,
      total_tips: 15.00
    },
    {
      room_name: "Eigenverbrauch",
      room_id: 3,
      total_tips: 5.00
    }
  ]
}
```

---

## 📝 Migrations-Anleitung

### Für bestehende Installationen:

**WICHTIG:** Dieser Fix betrifft nur neue Daten. Bereits exportierte CSV-Dateien mit falschen Trinkgeld-Zuordnungen können nicht automatisch korrigiert werden.

```bash
# 1. Container neu starten
docker-compose restart

# 2. Testen
# - Trinkgeld in verschiedenen Räumen erfassen
# - Statistiken prüfen
# - CSV exportieren und Trinkgeld-Zuordnung verifizieren
```

**Manueller Test:**
```
1. Öffne Kasse → Wähle "Rolltore" → Trinkgeld 5€ erfassen
2. Öffne Kasse → Wähle "Brücke" → Trinkgeld 3€ erfassen
3. Öffne Statistiken → Export CSV
4. Prüfe CSV:
   - Rolltore → Trinkgeld: 5.00
   - Brücke → Trinkgeld: 3.00
   ✓ Korrekt!
```

---

## 🗄️ Datenbank-Änderungen

### Neuer Raum hinzugefügt

```sql
-- Wird automatisch beim ersten Start eingefügt
INSERT INTO rooms (name) VALUES ('Eigenverbrauch');
```

**Hinweis:** Wenn du bereits eine Datenbank hast, wird der dritte Raum automatisch beim nächsten Start hinzugefügt (falls noch nicht vorhanden).

---

## 📊 CSV-Export Beispiel (Korrigiert)

```csv
=== ABRECHNUNG PRO RAUM ===

Rolltore
Getränke,45
Einnahmen Getränke,89.50
Trinkgeld,15.00          ← Tatsächlich erfasst in Rolltore
Gesamt Rolltore,104.50

Brücke
Getränke,38
Einnahmen Getränke,76.00
Trinkgeld,5.00           ← Tatsächlich erfasst in Brücke
Gesamt Brücke,81.00

Eigenverbrauch
Getränke,12
Einnahmen Getränke,0.00  ← Meist kostenlos
Trinkgeld,0.00
Gesamt Eigenverbrauch,0.00

=== GESAMT ===
Gesamt Getränke,95
Gesamt Einnahmen Getränke,165.50
Gesamt Trinkgeld,20.00
Gesamt Einnahmen,185.50
```

---

## ✅ Was wurde getestet

- [x] Trinkgeld in Raum 1 erfassen → CSV zeigt korrekt in Raum 1
- [x] Trinkgeld in Raum 2 erfassen → CSV zeigt korrekt in Raum 2
- [x] Trinkgeld in Raum 3 erfassen → CSV zeigt korrekt in Raum 3
- [x] Gemischtes Trinkgeld → Jeder Raum zeigt nur sein Trinkgeld
- [x] Raum-Filter in Statistiken → Zeigt nur Trinkgeld des gewählten Raums
- [x] Dritter Raum erscheint in Raumauswahl
- [x] Export mit allen drei Räumen funktioniert

---

## 💡 Best Practices mit Eigenverbrauch

### Verwendung des Eigenverbrauch-Raums:

**DO ✓**
- Getränke für Vorstand buchen
- Helfer-Bewirtung bei Events
- Testverkostungen
- Inventur-Schwund erfassen

**DON'T ✗**
- Nicht für reguläre Verkäufe nutzen
- Nicht mit anderen Räumen verwechseln
- Nicht für fehlerhafte Buchungen missbrauchen

### Buchhaltung:
- Eigenverbrauch regelmäßig prüfen
- Bei zu hohem Eigenverbrauch → Ursachen analysieren
- Kann steuerlich relevant sein (Sachbezug)
- In Jahresabrechnung separat ausweisen

---

## 🔄 Upgrade-Pfad

### Von v2.0 oder v2.1:
```bash
docker-compose down
docker-compose up -d --build
```

### Neue Installation:
```bash
docker-compose up -d
```

Der dritte Raum wird automatisch angelegt.

---

## 📞 Support

Bei Fragen zur Trinkgeld-Zuordnung:
1. Prüfe CSV-Export nach Test-Erfassung
2. Vergleiche mit tatsächlich erfassten Beträgen
3. Bei Abweichungen: Logs prüfen (`docker-compose logs -f`)

---

**Version 2.1.1 - Kritischer Bugfix für korrekte Abrechnungen! 🍻**

_Veröffentlicht: ${new Date().toLocaleDateString('de-DE')}_

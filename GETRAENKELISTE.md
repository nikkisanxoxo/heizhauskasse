# 🍺 Vereinskasse - Finale Getränkeliste

## Übersicht aller Getränke

Diese Liste wird automatisch beim **ersten Start** in die Datenbank eingefügt.

| # | Getränk | Preis | Farbe | Hex-Code |
|---|---------|-------|-------|----------|
| 1 | Pils 0,33 | 3,00 € | 🟡 Gelb | #fbbf24 |
| 2 | Bier | 3,50 € | 🟠 Orange | #f59e0b |
| 3 | Weinschorle | 3,50 € | 🌸 Pink | #ec4899 |
| 4 | Radler | 3,50 € | 🍋 Hellgrün | #a3e635 |
| 5 | Alkoholfrei Bier | 3,00 € | 🟡 Gelb | #fbbf24 |
| 6 | Club Mate | 3,50 € | 🟢 Grün | #10b981 |
| 7 | Spezi | 3,00 € | 🟠 Orange | #f97316 |
| 8 | Schorle | 2,50 € | 🌸 Pink | #ec4899 |
| 9 | Wasser | 1,50 € | 🔵 Blau | #3b82f6 |
| 10 | Shot | 2,00 € | 🔴 Rot | #dc2626 |
| 11 | Sekt | 6,00 € | 🟡 Gelb | #fbbf24 |
| 12 | Longdrink | 7,00 € | 🟣 Lila | #8b5cf6 |

## Kategorien

### 🍺 Bier & Biermixgetränke (3,00 - 3,50 €)
- Pils 0,33 - 3,00 €
- Bier - 3,50 €
- Radler - 3,50 €
- Alkoholfrei Bier - 3,00 €

### 🍷 Wein & Schorlen (2,50 - 3,50 €)
- Weinschorle - 3,50 €
- Schorle - 2,50 €

### 🥤 Softdrinks (1,50 - 3,50 €)
- Club Mate - 3,50 €
- Spezi - 3,00 €
- Wasser - 1,50 €

### 🍸 Spirituosen (2,00 - 7,00 €)
- Shot - 2,00 €
- Sekt - 6,00 €
- Longdrink - 7,00 €

## Preiskategorien

| Preisklasse | Getränke | Anzahl |
|-------------|----------|--------|
| 1,50 € | Wasser | 1 |
| 2,00 € | Shot | 1 |
| 2,50 € | Schorle | 1 |
| 3,00 € | Pils 0,33, Alkoholfrei Bier, Spezi | 3 |
| 3,50 € | Bier, Weinschorle, Radler, Club Mate | 4 |
| 6,00 € | Sekt | 1 |
| 7,00 € | Longdrink | 1 |

**Durchschnittspreis:** 3,54 €  
**Günstigstes:** Wasser (1,50 €)  
**Teuerstes:** Longdrink (7,00 €)

## Farbschema

Die Farben sind so gewählt, dass sie:
- ✅ Gut unterscheidbar sind
- ✅ Zum Getränk passen (z.B. Blau = Wasser)
- ✅ Touch-freundlich sind (hoher Kontrast)

### Farb-Zuordnung:

**Gelb/Gold (#fbbf24):**
- Pils 0,33
- Alkoholfrei Bier
- Sekt

**Orange (#f59e0b / #f97316):**
- Bier
- Spezi

**Grün (#10b981 / #a3e635):**
- Club Mate (dunkelgrün)
- Radler (hellgrün)

**Pink (#ec4899):**
- Weinschorle
- Schorle

**Blau (#3b82f6):**
- Wasser

**Rot (#dc2626):**
- Shot

**Lila (#8b5cf6):**
- Longdrink

## Anpassungen

### Preise ändern:
1. Gehe zu: `http://kasse.internal/admin.html`
2. Passwort eingeben
3. Preis ändern
4. "Speichern" klicken

### Farben ändern:
1. Gehe zu: `http://kasse.internal/admin.html`
2. Klicke auf Farb-Icon 🎨
3. Neue Farbe wählen
4. "Speichern" klicken

### Reihenfolge ändern:
1. Gehe zu: `http://kasse.internal/admin.html`
2. Greife Getränk am ☰ Symbol
3. Ziehe an gewünschte Position
4. Wird automatisch gespeichert

### Getränke hinzufügen:
1. Gehe zu: `http://kasse.internal/admin.html`
2. Name, Preis und Farbe eingeben
3. "+ Hinzufügen" klicken

### Getränke deaktivieren:
1. Gehe zu: `http://kasse.internal/admin.html`
2. "Deaktivieren" klicken
3. Getränk erscheint nicht mehr in Kasse
4. Bleibt in Statistik erhalten

## Für neue Installation

Bei einer **neuen Installation** (leere Datenbank) werden diese 12 Getränke automatisch angelegt.

Bei einer **bestehenden Installation** bleiben deine aktuellen Getränke erhalten. Du kannst die neuen manuell hinzufügen oder die Datenbank zurücksetzen:

### Datenbank zurücksetzen (ACHTUNG: Löscht alle Daten!):

```bash
# Container stoppen
docker-compose down

# Datenbank löschen
rm -rf data/

# Container neu starten (legt neue Datenbank mit dieser Liste an)
docker-compose up -d
```

## Empfohlene Reihenfolge in der Kasse

Die aktuelle Reihenfolge ist nach **Beliebtheit/Häufigkeit** sortiert:

1. Pils 0,33 (meist verkauft)
2. Bier
3. Weinschorle
4. Radler
5. Alkoholfrei Bier
6. Club Mate
7. Spezi
8. Schorle
9. Wasser
10. Shot
11. Sekt
12. Longdrink

**Alternative Sortierungen:**
- Nach Preis (günstig → teuer)
- Nach Kategorie (Bier, Softdrinks, Spirituosen)
- Nach Farbe (optisch ansprechend)

→ Einfach per Drag & Drop im Admin-Bereich ändern!

---

**Diese Liste ist optimiert für einen Vereins-Bar-Betrieb mit typischem Sortiment.** 🍻

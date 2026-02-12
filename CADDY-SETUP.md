# Caddy Reverse Proxy Setup - Anleitung

## 🌐 Übersicht

Die Vereinskasse läuft jetzt hinter einem Caddy Reverse Proxy und ist unter **http://kasse.internal** erreichbar.

### Architektur:
```
Tablets/Browser
    ↓
http://kasse.internal
    ↓
Caddy Reverse Proxy (Port 80)
    ↓
Vereinskasse Container (Port 3000, intern)
```

---

## 📝 Einrichtung

### 1. Container starten

```bash
docker-compose up -d
```

Dies startet zwei Container:
- `vereinskasse` - Die Hauptanwendung
- `vereinskasse-caddy` - Der Reverse Proxy

### 2. DNS/Hosts-Datei konfigurieren

Damit `kasse.internal` funktioniert, muss der Hostname aufgelöst werden können.

#### **Option A: Hosts-Datei (Einfach, für Testzwecke)**

**Auf jedem Gerät (Tablets, PCs) die Hosts-Datei bearbeiten:**

**Windows:**
1. Als Administrator: `notepad C:\Windows\System32\drivers\etc\hosts`
2. Folgende Zeile hinzufügen:
   ```
   192.168.1.100  kasse.internal
   ```
   (IP durch die IP deines Servers ersetzen!)

**Linux/Mac:**
1. Terminal: `sudo nano /etc/hosts`
2. Folgende Zeile hinzufügen:
   ```
   192.168.1.100  kasse.internal
   ```

**Android (benötigt Root oder Apps):**
- App: "Hosts Editor" aus Play Store
- Oder: Via ADB mit Root-Zugriff

**iOS:**
- Ohne Jailbreak schwierig
- Besser: Option B (DNS) verwenden

#### **Option B: Lokaler DNS-Server (Empfohlen für Netzwerk)**

**Mit Pi-hole, AdGuard Home oder Router-DNS:**

1. **Pi-hole/AdGuard Home:**
   - Gehe zu: Local DNS Records / DNS Records
   - Füge hinzu:
     ```
     kasse.internal → 192.168.1.100
     ```

2. **Router (z.B. FritzBox, UniFi):**
   - Gehe zu: Netzwerk → Hostnamen
   - Füge hinzu:
     ```
     kasse.internal → 192.168.1.100
     ```

3. **Dnsmasq (Linux):**
   ```bash
   echo "address=/kasse.internal/192.168.1.100" >> /etc/dnsmasq.conf
   sudo systemctl restart dnsmasq
   ```

#### **Option C: Wildcard DNS (Für .local Domain)**

Wenn dein Netzwerk mDNS/Bonjour unterstützt:

1. Benenne deinen Server um:
   ```bash
   sudo hostnamectl set-hostname kasse
   ```

2. Zugriff dann via:
   - `http://kasse.local` (funktioniert automatisch in vielen Netzwerken)

---

## 🧪 Testen

### DNS-Auflösung prüfen:

**Windows:**
```cmd
nslookup kasse.internal
ping kasse.internal
```

**Linux/Mac:**
```bash
nslookup kasse.internal
ping kasse.internal
```

Erwartete Antwort:
```
Name:    kasse.internal
Address: 192.168.1.100
```

### Webzugriff testen:

**Im Browser öffnen:**
```
http://kasse.internal
```

Du solltest die Vereinskasse sehen! 🎉

---

## 🔧 Konfiguration anpassen

### Andere Domain verwenden:

Bearbeite `Caddyfile`:

```caddyfile
# Statt kasse.internal:
meine-kasse.local {
    reverse_proxy vereinskasse:3000
}
```

Container neu starten:
```bash
docker-compose restart caddy
```

### Mehrere Domains:

```caddyfile
kasse.internal, bar.local, getraenke.internal {
    reverse_proxy vereinskasse:3000
}
```

### IP-basierter Zugriff:

Uncomment in `Caddyfile`:
```caddyfile
192.168.1.100 {
    reverse_proxy vereinskasse:3000
}
```

Dann ist Zugriff möglich via:
- `http://kasse.internal`
- `http://192.168.1.100`

---

## 🔒 HTTPS aktivieren (Optional)

### Für öffentliche Domains:

Wenn du eine echte Domain hast (z.B. `kasse.meinverein.de`):

```caddyfile
kasse.meinverein.de {
    reverse_proxy vereinskasse:3000
    
    # Caddy holt automatisch Let's Encrypt Zertifikat!
}
```

### Für .internal/.local (Self-Signed):

```caddyfile
kasse.internal {
    reverse_proxy vereinskasse:3000
    
    tls internal  # Self-signed Zertifikat
}
```

⚠️ Browser zeigen Warnung bei Self-Signed Zertifikaten!

---

## 📊 Logs anzeigen

### Caddy Logs:
```bash
docker-compose logs -f caddy
```

### Vereinskasse Logs:
```bash
docker-compose logs -f vereinskasse
```

### Beide gleichzeitig:
```bash
docker-compose logs -f
```

---

## 🐛 Troubleshooting

### "Seite nicht erreichbar"

1. **DNS prüfen:**
   ```bash
   ping kasse.internal
   ```
   Wenn nicht erreichbar → Hosts-Datei oder DNS falsch konfiguriert

2. **Container prüfen:**
   ```bash
   docker-compose ps
   ```
   Beide Container müssen "Up" sein

3. **Caddy Status:**
   ```bash
   docker-compose logs caddy | tail -n 50
   ```

### "502 Bad Gateway"

Vereinskasse Container läuft nicht:
```bash
docker-compose logs vereinskasse
docker-compose restart vereinskasse
```

### Ports bereits belegt

Wenn Port 80 bereits verwendet:
```yaml
# In docker-compose.yml:
caddy:
  ports:
    - "8080:80"  # Statt Port 80 → Port 8080
```

Dann Zugriff via: `http://kasse.internal:8080`

---

## 🎯 Tablet-Konfiguration

### Empfohlene Setup-Schritte:

1. **Hosts-Datei konfigurieren** (siehe oben)
   ODER DNS-Server im Netzwerk einrichten

2. **Browser öffnen** (Chrome, Firefox, Safari)

3. **URL eingeben:** `http://kasse.internal`

4. **Lesezeichen erstellen:**
   - Chrome: ⋮ → ⭐ Lesezeichen hinzufügen
   - Safari: Share → Zum Home-Bildschirm
   - Firefox: ⋮ → ⭐ Lesezeichen

5. **Optional: Kiosk-Modus**
   - Android: "Fully Kiosk Browser" App
   - iOS: Geführter Zugriff aktivieren

---

## 🌟 Vorteile des Reverse Proxy

✅ **Einheitliche URL** - `kasse.internal` statt IP-Adressen  
✅ **Einfacher Zugriff** - Leichter zu merken  
✅ **Flexibilität** - Backend-Server ändern ohne Client-Anpassung  
✅ **Logs** - Zentrale Zugriffsprotokolle  
✅ **Load Balancing** - Später mehrere Backends möglich  
✅ **HTTPS** - Einfach aktivierbar bei Bedarf  
✅ **Caching** - Performance-Optimierung möglich  

---

## 📝 Beispiel-Netzwerk-Setup

```
Router/Switch (192.168.1.1)
    │
    ├─── Server (192.168.1.100)
    │    └─── Docker: Caddy + Vereinskasse
    │
    ├─── Tablet 1 (192.168.1.101)
    │    └─── Browser: http://kasse.internal → Rolltore
    │
    └─── Tablet 2 (192.168.1.102)
         └─── Browser: http://kasse.internal → Brücke
```

**DNS-Konfiguration:**
- Router oder Pi-hole: `kasse.internal → 192.168.1.100`
- Alle Geräte nutzen Router/Pi-hole als DNS
- Kein manueller Hosts-Eintrag nötig ✓

---

## 🔄 Updates

Nach Änderungen an `Caddyfile`:

```bash
# Caddy neu laden (ohne Downtime)
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile

# Oder Container neu starten
docker-compose restart caddy
```

---

## 📞 Support

Bei Problemen:
1. DNS-Auflösung testen (`ping kasse.internal`)
2. Container-Status prüfen (`docker-compose ps`)
3. Logs prüfen (`docker-compose logs -f`)
4. Browser-Cache leeren

---

**Viel Erfolg mit eurem Reverse Proxy Setup! 🍻**

_Für Produktiv-Umgebungen empfehlen wir HTTPS mit echten Zertifikaten._

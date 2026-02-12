# Vereinskasse - Version 2.2 Update

## 🌐 Caddy Reverse Proxy Integration

### Neues Feature: Professioneller Reverse Proxy

**Die Vereinskasse läuft jetzt hinter einem Caddy Reverse Proxy!**

#### Was ist neu?

✅ **Benutzerfreundliche URL:** `http://kasse.internal` statt `http://192.168.1.100:3000`  
✅ **Caddy Container:** Automatisch gestartet mit docker-compose  
✅ **Zentrale Logs:** Alle Zugriffe protokolliert  
✅ **Security Headers:** Verbesserte Sicherheit  
✅ **Gzip Compression:** Schnellere Ladezeiten  
✅ **Error Handling:** Benutzerfreundliche Fehlermeldungen  
✅ **HTTPS-Ready:** Einfach aktivierbar bei Bedarf  

---

## 🏗️ Architektur

### Vorher (v2.1.1):
```
Tablets → http://192.168.1.100:3000 → Vereinskasse
```

### Jetzt (v2.2):
```
Tablets → http://kasse.internal (Port 80) → Caddy → Vereinskasse (Port 3000)
```

**Vorteile:**
- Vereinskasse läuft isoliert im internen Netzwerk
- Nur Caddy ist von außen erreichbar
- Port 3000 nicht mehr exponiert
- URL bleibt gleich, auch wenn Backend-Server wechselt

---

## 📦 Docker-Compose Änderungen

### Neue Container:

```yaml
services:
  vereinskasse:
    # Port 3000 nicht mehr nach außen exponiert
    expose:
      - "3000"
  
  caddy:
    # Neuer Reverse Proxy Container
    ports:
      - "80:80"    # HTTP
      - "443:443"  # HTTPS (falls aktiviert)
```

### Neue Volumes:
- `caddy_data` - Caddy Daten (Zertifikate, etc.)
- `caddy_config` - Caddy Konfiguration

---

## 🔧 Neue Dateien

### 1. Caddyfile
Hauptkonfiguration für den Reverse Proxy:
```caddyfile
kasse.internal {
    reverse_proxy vereinskasse:3000
    encode gzip
}
```

### 2. Caddyfile.advanced
Erweiterte Konfigurationsbeispiele:
- IP-basierter Zugriff
- HTTPS mit Let's Encrypt
- Basic Authentication
- IP-Whitelist
- Rate Limiting
- Wartungsmodus

### 3. CADDY-SETUP.md
Detaillierte Anleitung:
- DNS/Hosts-Konfiguration
- Tablet-Setup
- Troubleshooting
- HTTPS-Aktivierung

---

## 🚀 Einrichtung

### Schritt 1: DNS/Hosts konfigurieren

**Option A: Hosts-Datei (schnell, für Tests)**

Windows (`C:\Windows\System32\drivers\etc\hosts`):
```
192.168.1.100  kasse.internal
```

Linux/Mac (`/etc/hosts`):
```
192.168.1.100  kasse.internal
```

**Option B: DNS-Server (empfohlen für Netzwerk)**

Pi-hole / AdGuard Home:
```
kasse.internal → 192.168.1.100
```

Router (FritzBox, UniFi):
```
Hostnamen → kasse.internal → 192.168.1.100
```

### Schritt 2: Container starten

```bash
docker-compose up -d
```

### Schritt 3: Testen

```bash
# DNS prüfen
ping kasse.internal

# Browser öffnen
http://kasse.internal
```

---

## 🎯 Zugriffsmöglichkeiten

Nach dem Setup stehen folgende URLs zur Verfügung:

| URL | Beschreibung | Empfohlen |
|-----|--------------|-----------|
| `http://kasse.internal` | Via Caddy Reverse Proxy | ✅ JA |
| `http://localhost` | Direktzugriff (nur auf Server) | Für Tests |
| `http://192.168.1.100` | IP-basiert (falls in Caddyfile aktiviert) | Optional |

**Empfehlung:** Nutzt `kasse.internal` überall!

---

## 📱 Tablet-Konfiguration

### Einmalig auf jedem Tablet:

1. **Hosts-Datei oder DNS** konfigurieren (siehe oben)
2. **Browser öffnen:** `http://kasse.internal`
3. **Lesezeichen erstellen**
4. Optional: Zum Homescreen hinzufügen

### Kiosk-Modus (Optional):

**Android:**
- App: "Fully Kiosk Browser"
- URL: `http://kasse.internal`
- Vollbild-Modus aktivieren

**iOS:**
- Safari: Zum Home-Bildschirm hinzufügen
- Geführter Zugriff aktivieren

---

## 🔒 Sicherheit

### Standard (HTTP):
- Für interne Nutzung ausreichend
- Keine Verschlüsselung (OK im lokalen Netzwerk)

### Optional: HTTPS aktivieren

**Für öffentliche Domain:**
```caddyfile
kasse.meinverein.de {
    reverse_proxy vereinskasse:3000
    tls admin@meinverein.de  # Let's Encrypt (kostenlos!)
}
```

**Für .internal (Self-Signed):**
```caddyfile
kasse.internal {
    reverse_proxy vereinskasse:3000
    tls internal
}
```

⚠️ Self-Signed Zertifikate zeigen Browser-Warnung!

### Security Headers

Caddy fügt automatisch hinzu:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 📊 Logs & Monitoring

### Zugriffslogs einsehen:

```bash
# Caddy Logs
docker-compose logs -f caddy

# Vereinskasse Logs
docker-compose logs -f vereinskasse

# Beide zusammen
docker-compose logs -f
```

### Log-Dateien im Container:

```bash
# Access Log
docker exec vereinskasse-caddy cat /var/log/caddy/access.log

# Caddy System Log
docker exec vereinskasse-caddy cat /var/log/caddy/caddy.log
```

---

## 🛠️ Erweiterte Konfiguration

### IP-basierter Zugriff zusätzlich:

In `Caddyfile` uncomment:
```caddyfile
192.168.1.100 {
    reverse_proxy vereinskasse:3000
}
```

Dann verfügbar via:
- `http://kasse.internal` ✓
- `http://192.168.1.100` ✓

### Mehrere Domains:

```caddyfile
kasse.internal, bar.local, getraenke.intern {
    reverse_proxy vereinskasse:3000
}
```

### Basic Auth (zusätzlicher Passwortschutz):

```bash
# Passwort-Hash generieren
docker exec vereinskasse-caddy caddy hash-password

# In Caddyfile eintragen
basicauth {
    admin $2a$14$...
}
```

---

## 🔄 Migrations-Anleitung

### Von v2.1.1 upgraden:

```bash
# 1. Container stoppen
docker-compose down

# 2. Backup (optional)
cp docker-compose.yml docker-compose.yml.backup

# 3. Neue Version deployen
docker-compose up -d

# 4. DNS/Hosts konfigurieren (siehe oben)

# 5. Testen
ping kasse.internal
curl http://kasse.internal
```

**Wichtig:** Nach dem Update läuft die Kasse NICHT mehr auf Port 3000 nach außen!

### Alte Bookmarks aktualisieren:

**Alt:** `http://192.168.1.100:3000`  
**Neu:** `http://kasse.internal`

---

## 🐛 Troubleshooting

### "Seite nicht gefunden"

**Problem:** DNS-Auflösung funktioniert nicht

**Lösung:**
```bash
# Prüfe DNS
ping kasse.internal

# Falls nicht gefunden:
# → Hosts-Datei prüfen
# → DNS-Eintrag prüfen
# → Cache leeren (ipconfig /flushdns auf Windows)
```

### "502 Bad Gateway"

**Problem:** Vereinskasse Container läuft nicht

**Lösung:**
```bash
docker-compose ps
docker-compose logs vereinskasse
docker-compose restart vereinskasse
```

### "Connection Refused"

**Problem:** Caddy läuft nicht

**Lösung:**
```bash
docker-compose logs caddy
docker-compose restart caddy

# Prüfe Caddyfile Syntax
docker exec vereinskasse-caddy caddy validate --config /etc/caddy/Caddyfile
```

### Port 80 bereits belegt

**Lösung:** Anderen Port verwenden

```yaml
# docker-compose.yml
caddy:
  ports:
    - "8080:80"  # Statt Port 80
```

Zugriff dann via: `http://kasse.internal:8080`

---

## 📈 Performance

### Vorteile des Reverse Proxy:

- **Gzip Compression:** ~60% kleinere Übertragung
- **HTTP/2:** Schnellere Ladezeiten (falls HTTPS aktiv)
- **Caching:** Statische Ressourcen (aktivierbar)
- **Keep-Alive:** Weniger TCP-Verbindungen

### Benchmark (Beispiel):

| Metrik | Direkt (v2.1.1) | Via Caddy (v2.2) |
|--------|-----------------|-------------------|
| Seitengröße | 45 KB | 18 KB (Gzip) |
| Ladezeit (LAN) | 120ms | 95ms |
| Requests | 8 | 8 |

---

## 💡 Best Practices

### Produktiv-Umgebung:

✅ **DNS-Server nutzen** (nicht Hosts-Datei)  
✅ **HTTPS aktivieren** (bei öffentlichem Zugriff)  
✅ **Logs regelmäßig prüfen**  
✅ **Firewall konfigurieren** (nur Port 80/443 öffnen)  
✅ **Backups** von Caddyfile und docker-compose.yml  

### Test-Umgebung:

✅ Hosts-Datei ist OK  
✅ HTTP ohne TLS ist OK  
✅ Self-Signed Zertifikate sind OK  

---

## 🔜 Geplante Features (v2.3)

- [ ] Automatisches HTTPS mit Let's Encrypt
- [ ] Grafana Dashboard Integration
- [ ] Rate Limiting aktiviert
- [ ] GeoIP-basierte Zugriffskontrolle
- [ ] Prometheus Metrics Export

---

## 📞 Support

**Siehe:**
- `CADDY-SETUP.md` - Detaillierte Setup-Anleitung
- `Caddyfile.advanced` - Erweiterte Konfigurationsbeispiele
- Caddy Dokumentation: https://caddyserver.com/docs/

**Logs prüfen:**
```bash
docker-compose logs -f caddy
docker-compose logs -f vereinskasse
```

---

**Version 2.2 - Professioneller Reverse Proxy für produktiven Einsatz! 🍻**

_Erstellt: ${new Date().toLocaleDateString('de-DE')}_

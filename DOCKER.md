# Vereinskasse - Docker Installation

Einfaches, containerisiertes Kassensystem für Vereinsgetränke.

## 🐳 Voraussetzungen

- Docker Desktop (Windows/Mac) oder Docker Engine (Linux)
- Docker Compose (meist in Docker Desktop enthalten)

### Docker installieren:

#### Windows/Mac:
1. Docker Desktop herunterladen: https://www.docker.com/products/docker-desktop
2. Installieren und starten

#### Linux (Ubuntu/Debian):
```bash
# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose installieren
sudo apt-get update
sudo apt-get install docker-compose-plugin

# User zur Docker-Gruppe hinzufügen
sudo usermod -aG docker $USER
# Neu anmelden damit Änderungen wirksam werden
```

## 🚀 Installation & Start

### Variante 1: Mit Docker Compose (Empfohlen)

```bash
# 1. In den Projektordner wechseln
cd vereinskasse

# 2. Container bauen und starten
docker-compose up -d

# Fertig! Kasse läuft auf http://localhost:3000
```

### Variante 2: Mit Docker direkt

```bash
# 1. Image bauen
docker build -t vereinskasse .

# 2. Container starten
docker run -d \
  --name vereinskasse \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  vereinskasse

# Fertig! Kasse läuft auf http://localhost:3000
```

## 📱 Zugriff

### Lokal:
```
http://localhost:3000
```

### Von Tablets im Netzwerk:

1. IP-Adresse des Servers finden:
   - Windows: `ipconfig`
   - Linux/Mac: `ip addr` oder `hostname -I`
   
2. Im Tablet-Browser öffnen:
   ```
   http://[SERVER-IP]:3000
   ```
   Beispiel: `http://192.168.1.100:3000`

## 🛠️ Container verwalten

### Status prüfen
```bash
docker-compose ps
# oder
docker ps
```

### Logs anzeigen
```bash
docker-compose logs -f
# oder
docker logs -f vereinskasse
```

### Container stoppen
```bash
docker-compose down
# oder
docker stop vereinskasse
```

### Container neustarten
```bash
docker-compose restart
# oder
docker restart vereinskasse
```

### Container aktualisieren (nach Änderungen)
```bash
docker-compose down
docker-compose up -d --build
```

## 💾 Datenbank & Backups

Die Datenbank wird im `data/` Ordner gespeichert und bleibt auch nach Container-Neustarts erhalten.

### Backup erstellen
```bash
# Einfach den data-Ordner kopieren
cp -r data data_backup_$(date +%Y%m%d)

# Oder als tar.gz
tar -czf backup_$(date +%Y%m%d).tar.gz data/
```

### Backup wiederherstellen
```bash
# Container stoppen
docker-compose down

# Backup zurückkopieren
cp data_backup_20250210/vereinskasse.db data/

# Container starten
docker-compose up -d
```

### Automatisches Backup (Linux/Cron)
```bash
# Crontab öffnen
crontab -e

# Täglich um 2 Uhr nachts Backup erstellen
0 2 * * * tar -czf ~/backups/vereinskasse_$(date +\%Y\%m\%d).tar.gz -C /pfad/zu/vereinskasse data/
```

## 🔧 Konfiguration

### Port ändern

Bearbeite `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Statt Port 3000 → Port 8080
```

Dann:
```bash
docker-compose down
docker-compose up -d
```

### Andere Räume hinzufügen

1. Container stoppen: `docker-compose down`
2. Datenbank löschen oder anpassen
3. `server.js` bearbeiten (Zeile 33-36)
4. Neu bauen: `docker-compose up -d --build`

## 🌐 Reverse Proxy (für HTTPS)

### Mit Nginx

```nginx
server {
    listen 80;
    server_name kasse.meinverein.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Mit Traefik (docker-compose.yml erweitern)

```yaml
services:
  vereinskasse:
    # ... bestehende Config ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.kasse.rule=Host(`kasse.meinverein.de`)"
      - "traefik.http.routers.kasse.entrypoints=websecure"
      - "traefik.http.routers.kasse.tls.certresolver=letsencrypt"
```

## 📊 Ressourcen-Limits

Falls euer Server begrenzte Ressourcen hat:

```yaml
services:
  vereinskasse:
    # ... bestehende Config ...
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## 🔄 Automatischer Start

Docker Container starten automatisch nach System-Neustart (dank `restart: unless-stopped`).

### Systemd Service (optional, falls Docker nicht automatisch startet)

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

## 🐛 Problemlösung

### Container startet nicht
```bash
# Logs prüfen
docker-compose logs

# Container Status
docker-compose ps
```

### Port bereits belegt
```bash
# Prüfen welcher Prozess Port 3000 nutzt
sudo lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Anderen Port in docker-compose.yml verwenden
```

### Datenbank zurücksetzen
```bash
# Container stoppen
docker-compose down

# Datenbank löschen
rm -rf data/

# Container neu starten (erstellt neue DB)
docker-compose up -d
```

### Alle Container und Images entfernen (Neustart)
```bash
docker-compose down -v
docker rmi vereinskasse
docker-compose up -d --build
```

## 📈 Performance

Der Container ist sehr leichtgewichtig:
- **Image-Größe:** ~120 MB
- **RAM-Nutzung:** ~50-100 MB
- **CPU:** Minimal (meist <1%)

Läuft problemlos auf:
- Raspberry Pi 3/4
- Alte PCs/Laptops
- NAS-Systeme (Synology, QNAP)
- Cloud-VPS (kleinste Instanzen)

## 🔒 Sicherheit

### Für lokales Netzwerk
Der Standard-Setup ist sicher genug für interne Nutzung.

### Für öffentlichen Zugriff

1. **HTTPS einrichten** (Let's Encrypt + Nginx/Traefik)
2. **Basic Auth hinzufügen:**
   ```yaml
   services:
     vereinskasse:
       environment:
         - BASIC_AUTH=user:password
   ```
3. **Firewall konfigurieren**
4. **Regelmäßige Updates**

## 📦 Vorgefertigte Images

Falls ihr das Image nicht selbst bauen wollt, könnt ihr es auch von Docker Hub ziehen (wenn vorhanden):

```bash
docker pull vereinskasse/kassensystem:latest
docker run -d -p 3000:3000 -v ./data:/app/data vereinskasse/kassensystem
```

## 🎯 Verwendung

Nach dem Start:

1. **Kasse:** http://localhost:3000
2. **Statistiken:** http://localhost:3000/statistics.html
3. **Verwaltung:** http://localhost:3000/admin.html

## 💡 Tipps

- **Bookmarks:** Erstellt Browser-Lesezeichen auf den Tablets
- **Kiosk-Modus:** Tablets im Vollbild-Browser-Modus betreiben
- **Autostart:** Docker Container starten automatisch
- **Backups:** Automatisiert mit Cron oder Windows Task Scheduler

## 📞 Support

Bei Problemen:
1. `docker-compose logs` prüfen
2. Browser-Console (F12) prüfen
3. README.md und INSTALLATION.md lesen

---

**Viel Erfolg mit eurer containerisierten Vereinskasse! 🍻**

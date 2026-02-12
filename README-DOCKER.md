# 🐳 Vereinskasse - Docker Edition

Containerisiertes Kassensystem für Vereinsgetränke - einfach, sicher, portabel.

## ⚡ Quick Start

```bash
# 1. Docker Desktop installieren (falls noch nicht vorhanden)
# Windows/Mac: https://www.docker.com/products/docker-desktop

# 2. Container starten
docker-compose up -d

# 3. Öffne im Browser
# http://localhost:3000
```

**Das war's!** 🎉

## 🎯 Warum Docker?

✅ **Einfache Installation** - Kein Node.js, keine Abhängigkeiten  
✅ **Konsistente Umgebung** - Läuft überall gleich  
✅ **Isoliert** - Beeinflusst nicht dein System  
✅ **Updates einfach** - Image neu bauen und starten  
✅ **Portabel** - Von Windows zu Linux zu Raspberry Pi  
✅ **Automatischer Neustart** - Nach System-Reboot  

## 📁 Projektstruktur

```
vereinskasse/
├── Dockerfile              # Container-Definition
├── docker-compose.yml      # Orchestrierung
├── .dockerignore          # Nicht ins Image kopieren
├── server.js              # Backend
├── public/                # Frontend
│   ├── index.html
│   ├── statistics.html
│   └── admin.html
├── data/                  # Persistente Datenbank (wird erstellt)
│   └── vereinskasse.db
└── DOCKER.md             # Ausführliche Docker-Anleitung
```

## 🚀 Verwendung

### Container starten
```bash
docker-compose up -d
```

### Container stoppen
```bash
docker-compose down
```

### Logs ansehen
```bash
docker-compose logs -f
```

### Container neustarten
```bash
docker-compose restart
```

### Status prüfen
```bash
docker-compose ps
```

## 📱 Von Tablets zugreifen

1. **IP-Adresse finden:**
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   hostname -I
   ```

2. **Im Tablet-Browser öffnen:**
   ```
   http://[DEINE-IP]:3000
   ```
   Beispiel: `http://192.168.1.100:3000`

## 🔧 Anpassungen

### Port ändern

Bearbeite `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Statt 3000 → Port 8080
```

### Umgebungsvariablen

```yaml
environment:
  - TZ=Europe/Berlin        # Zeitzone
  - NODE_ENV=production     # Umgebung
```

## 💾 Datenbank & Backups

Die Datenbank liegt in `./data/vereinskasse.db` und bleibt nach Container-Neustarts erhalten.

### Backup erstellen
```bash
cp -r data data_backup_$(date +%Y%m%d)
```

### Backup wiederherstellen
```bash
docker-compose down
cp data_backup_20250210/* data/
docker-compose up -d
```

## 🔄 Updates

```bash
# Code geändert? Neu bauen:
docker-compose down
docker-compose up -d --build
```

## 🛠️ Für verschiedene Plattformen

### Raspberry Pi
```bash
# ARM-kompatibel - läuft out-of-the-box
docker-compose up -d
```

### Synology/QNAP NAS
1. Docker-Paket installieren
2. Container Registry öffnen
3. Image bauen oder importieren
4. Container starten

### Cloud (AWS/Azure/GCP)
```bash
# SSH auf Server
git clone <repo>
cd vereinskasse
docker-compose up -d
```

## 📊 Ressourcen

- **Image-Größe:** ~120 MB
- **RAM:** ~50-100 MB
- **CPU:** Minimal
- **Disk:** Datenbank wächst mit Transaktionen

## 🐛 Troubleshooting

### Container startet nicht
```bash
docker-compose logs
```

### Port bereits belegt
Ändere Port in `docker-compose.yml`

### Datenbank beschädigt
```bash
docker-compose down
rm -rf data/
docker-compose up -d
```

### Kompletter Neustart
```bash
docker-compose down -v
docker rmi vereinskasse
docker-compose up -d --build
```

## 🔒 Sicherheit

**Für lokales Netzwerk:** Standard-Setup ist ausreichend

**Für öffentlichen Zugriff:**
- HTTPS via Reverse Proxy (Nginx/Traefik)
- Basic Authentication
- Firewall konfigurieren

## 📚 Weitere Dokumentation

- **DOCKER.md** - Ausführliche Docker-Anleitung
- **INSTALLATION.md** - Alternative Installation (ohne Docker)
- **README.md** - Allgemeine Projekt-Dokumentation

## ⚙️ Systemd Service (Linux)

Für automatischen Start bei System-Boot:

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

Docker-Compose Service:
```ini
# /etc/systemd/system/vereinskasse.service
[Unit]
Description=Vereinskasse Docker
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/pfad/zu/vereinskasse
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Aktivieren:
```bash
sudo systemctl enable vereinskasse
sudo systemctl start vereinskasse
```

## 🎯 Best Practices

1. **Regelmäßige Backups** (täglich/wöchentlich)
2. **Docker Updates** installieren
3. **Logs überwachen** bei Problemen
4. **Ressourcen-Limits** setzen bei begrenztem RAM
5. **Netzwerk-Sicherheit** beachten

## 💡 Tipps

- **Watchtower** für automatische Updates:
  ```yaml
  services:
    watchtower:
      image: containrrr/watchtower
      volumes:
        - /var/run/docker.sock:/var/run/docker.sock
  ```

- **Portainer** für GUI-Management:
  ```bash
  docker run -d -p 9000:9000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    portainer/portainer-ce
  ```

---

**Containerisierte Grüße! 🐳🍻**

Bei Fragen: Siehe DOCKER.md für ausführliche Anleitung.

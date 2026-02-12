# Multi-stage build für kleineres Image
FROM node:18-alpine AS builder

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm install --production

# Production stage
FROM node:18-alpine

# Metadata
LABEL maintainer="vereinskasse"
LABEL description="Einfaches Kassensystem für Vereinsgetränke"

# Arbeitsverzeichnis
WORKDIR /app

# Non-root User erstellen
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Dependencies von builder kopieren
COPY --from=builder /app/node_modules ./node_modules

# Application files kopieren
COPY --chown=nodejs:nodejs server.js ./
COPY --chown=nodejs:nodejs public ./public

# Datenbank-Verzeichnis erstellen
RUN mkdir -p /app/data && chown nodejs:nodejs /app/data

# Volume für persistente Datenbank
VOLUME ["/app/data"]

# User wechseln
USER nodejs

# Port freigeben
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/rooms', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Server starten
CMD ["node", "server.js"]

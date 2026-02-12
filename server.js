const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Datenbank initialisieren
// Prüfe ob in Docker (Volume-Mount in /app/data)
const dbPath = process.env.DB_PATH || (
  require('fs').existsSync('/app/data') ? '/app/data/vereinskasse.db' : 'vereinskasse.db'
);
const db = new Database(dbPath);
console.log(`📁 Datenbank: ${dbPath}`);

// Tabellen erstellen
db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS drinks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    active INTEGER DEFAULT 1,
    color TEXT DEFAULT '#667eea',
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    drink_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (drink_id) REFERENCES drinks(id)
  );

  CREATE TABLE IF NOT EXISTS tips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );
`);

// Initiale Daten einfügen (falls noch nicht vorhanden)
const initData = () => {
  const roomCount = db.prepare('SELECT COUNT(*) as count FROM rooms').get();
  
  if (roomCount.count === 0) {
    const insertRoom = db.prepare('INSERT INTO rooms (name) VALUES (?)');
    insertRoom.run('Rolltore');
    insertRoom.run('Brücke');
    insertRoom.run('Eigenverbrauch');
    
    const insertDrink = db.prepare('INSERT INTO drinks (name, price, color, sort_order) VALUES (?, ?, ?, ?)');
    insertDrink.run('Pils 0,33', 3.00, '#fbbf24', 0);
    insertDrink.run('Bier', 3.50, '#f59e0b', 1);
    insertDrink.run('Weinschorle', 3.50, '#ec4899', 2);
    insertDrink.run('Radler', 3.50, '#a3e635', 3);
    insertDrink.run('Alkoholfrei Bier', 3.00, '#fbbf24', 4);
    insertDrink.run('Club Mate', 3.50, '#10b981', 5);
    insertDrink.run('Spezi', 3.00, '#f97316', 6);
    insertDrink.run('Schorle', 2.50, '#ec4899', 7);
    insertDrink.run('Wasser', 1.50, '#3b82f6', 8);
    insertDrink.run('Shot', 2.00, '#dc2626', 9);
    insertDrink.run('Sekt', 6.00, '#fbbf24', 10);
    insertDrink.run('Longdrink', 7.00, '#8b5cf6', 11);
    
    console.log('Initiale Getränkeliste eingefügt');
  }
};

initData();

// API Endpoints

// Räume abrufen
app.get('/api/rooms', (req, res) => {
  const rooms = db.prepare('SELECT * FROM rooms').all();
  res.json(rooms);
});

// Getränke abrufen
app.get('/api/drinks', (req, res) => {
  const drinks = db.prepare('SELECT * FROM drinks WHERE active = 1 ORDER BY sort_order ASC, name ASC').all();
  res.json(drinks);
});

// Alle Getränke abrufen (auch inaktive) - für Admin
app.get('/api/drinks/all', (req, res) => {
  const drinks = db.prepare('SELECT * FROM drinks ORDER BY sort_order ASC, name ASC').all();
  res.json(drinks);
});

// Transaktion erstellen
app.post('/api/transactions', (req, res) => {
  const { room_id, items } = req.body;
  
  if (!room_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Raum-ID und Artikel erforderlich' });
  }
  
  try {
    const insertTransaction = db.prepare(
      'INSERT INTO transactions (room_id, drink_id, quantity, total_price) VALUES (?, ?, ?, ?)'
    );
    
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertTransaction.run(room_id, item.drink_id, item.quantity, item.total_price);
      }
    });
    
    insertMany(items);
    res.json({ success: true, message: 'Transaktion erfolgreich' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Erstellen der Transaktion' });
  }
});

// Statistiken abrufen
app.get('/api/statistics', (req, res) => {
  const { start_date, end_date, room_id } = req.query;
  
  let query = `
    SELECT 
      r.name as room_name,
      d.name as drink_name,
      SUM(t.quantity) as total_quantity,
      SUM(t.total_price) as total_revenue
    FROM transactions t
    JOIN rooms r ON t.room_id = r.id
    JOIN drinks d ON t.drink_id = d.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (start_date) {
    query += ' AND DATE(t.timestamp) >= ?';
    params.push(start_date);
  }
  
  if (end_date) {
    query += ' AND DATE(t.timestamp) <= ?';
    params.push(end_date);
  }
  
  if (room_id) {
    query += ' AND t.room_id = ?';
    params.push(room_id);
  }
  
  query += ' GROUP BY r.name, d.name ORDER BY r.name, total_quantity DESC';
  
  const stats = db.prepare(query).all(...params);
  
  // Zusammenfassung
  const summaryQuery = `
    SELECT 
      SUM(t.quantity) as total_items,
      SUM(t.total_price) as total_revenue,
      COUNT(DISTINCT t.id) as transaction_count
    FROM transactions t
    WHERE 1=1
  `;
  
  let summaryQueryFinal = summaryQuery;
  const summaryParams = [];
  
  if (start_date) {
    summaryQueryFinal += ' AND DATE(t.timestamp) >= ?';
    summaryParams.push(start_date);
  }
  
  if (end_date) {
    summaryQueryFinal += ' AND DATE(t.timestamp) <= ?';
    summaryParams.push(end_date);
  }
  
  if (room_id) {
    summaryQueryFinal += ' AND t.room_id = ?';
    summaryParams.push(room_id);
  }
  
  const summary = db.prepare(summaryQueryFinal).get(...summaryParams);
  
  // Trinkgeld GESAMT abrufen
  let tipsQuery = 'SELECT SUM(amount) as total_tips, COUNT(*) as tip_count FROM tips WHERE 1=1';
  const tipsParams = [];
  
  if (start_date) {
    tipsQuery += ' AND DATE(timestamp) >= ?';
    tipsParams.push(start_date);
  }
  
  if (end_date) {
    tipsQuery += ' AND DATE(timestamp) <= ?';
    tipsParams.push(end_date);
  }
  
  if (room_id) {
    tipsQuery += ' AND room_id = ?';
    tipsParams.push(room_id);
  }
  
  const tips = db.prepare(tipsQuery).get(...tipsParams);
  
  // Trinkgeld PRO RAUM abrufen
  let tipsPerRoomQuery = `
    SELECT 
      r.name as room_name,
      r.id as room_id,
      SUM(ti.amount) as total_tips
    FROM tips ti
    JOIN rooms r ON ti.room_id = r.id
    WHERE 1=1
  `;
  const tipsPerRoomParams = [];
  
  if (start_date) {
    tipsPerRoomQuery += ' AND DATE(ti.timestamp) >= ?';
    tipsPerRoomParams.push(start_date);
  }
  
  if (end_date) {
    tipsPerRoomQuery += ' AND DATE(ti.timestamp) <= ?';
    tipsPerRoomParams.push(end_date);
  }
  
  if (room_id) {
    tipsPerRoomQuery += ' AND ti.room_id = ?';
    tipsPerRoomParams.push(room_id);
  }
  
  tipsPerRoomQuery += ' GROUP BY r.name, r.id';
  
  const tipsPerRoom = db.prepare(tipsPerRoomQuery).all(...tipsPerRoomParams);
  
  res.json({ 
    statistics: stats, 
    summary: {
      ...summary,
      total_tips: tips.total_tips || 0,
      tip_count: tips.tip_count || 0
    },
    tips_per_room: tipsPerRoom
  });
});

// Trinkgeld hinzufügen
app.post('/api/tips', (req, res) => {
  const { room_id, amount } = req.body;
  
  if (!room_id || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Raum-ID und Betrag erforderlich' });
  }
  
  try {
    const insert = db.prepare('INSERT INTO tips (room_id, amount) VALUES (?, ?)');
    insert.run(room_id, amount);
    res.json({ success: true, message: 'Trinkgeld gespeichert' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Speichern des Trinkgelds' });
  }
});

// Passwort-Authentifizierung Middleware
const authMiddleware = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const providedPassword = req.headers['x-admin-password'];
  
  if (providedPassword === adminPassword) {
    next();
  } else {
    res.status(401).json({ error: 'Ungültiges Passwort' });
  }
};

// Geschützte Routen - nur mit Passwort
app.post('/api/drinks', authMiddleware, (req, res) => {
  const { name, price, color } = req.body;
  
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name und Preis erforderlich' });
  }
  
  try {
    const insert = db.prepare('INSERT INTO drinks (name, price, color) VALUES (?, ?, ?)');
    const result = insert.run(name, price, color || '#667eea');
    res.json({ id: result.lastInsertRowid, name, price, color: color || '#667eea', active: 1 });
  } catch (error) {
    res.status(400).json({ error: 'Getränk existiert bereits oder ungültige Daten' });
  }
});

app.put('/api/drinks/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, price, active, color, sort_order } = req.body;
  
  try {
    const update = db.prepare('UPDATE drinks SET name = ?, price = ?, active = ?, color = ?, sort_order = ? WHERE id = ?');
    update.run(name, price, active !== undefined ? active : 1, color || '#667eea', sort_order !== undefined ? sort_order : 0, id);
    res.json({ id, name, price, active, color, sort_order });
  } catch (error) {
    res.status(400).json({ error: 'Fehler beim Aktualisieren' });
  }
});

// Passwort-Validierung Endpoint
app.post('/api/auth/validate', (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const { password } = req.body;
  
  if (password === adminPassword) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Alle Transaktionen (für detaillierte Ansicht)
app.get('/api/transactions', (req, res) => {
  const { limit = 100 } = req.query;
  
  const transactions = db.prepare(`
    SELECT 
      t.id,
      r.name as room_name,
      d.name as drink_name,
      t.quantity,
      t.total_price,
      t.timestamp
    FROM transactions t
    JOIN rooms r ON t.room_id = r.id
    JOIN drinks d ON t.drink_id = d.id
    ORDER BY t.timestamp DESC
    LIMIT ?
  `).all(limit);
  
  res.json(transactions);
});

// Server starten
app.listen(PORT, () => {
  console.log(`🍺 Vereinskasse läuft auf http://localhost:${PORT}`);
  console.log(`📊 Statistiken: http://localhost:${PORT}/statistics.html`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('\nDatenbank geschlossen. Server beendet.');
  process.exit(0);
});

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('madarun.db');

export const initDB = () => {
  // Table Utilisateurs
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  // Table Produits (Nouveau)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      min_stock INTEGER DEFAULT 0,
      stock_actuel INTEGER DEFAULT 0,
      unite TEXT,
      image_uri TEXT
    );
  `);

  db.execSync(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    message TEXT,
    type TEXT, -- 'info', 'warning', 'success'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
};

export default db;
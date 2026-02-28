import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('madarun.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);
};

export default db;
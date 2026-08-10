/**
 * db/init.js — Initialize SQLite database with schema and default admin user
 */
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname);
const DB_PATH = path.join(DB_DIR, 'mangalam.db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS destinations (
    destination_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    destination_name TEXT    NOT NULL,
    slug_url         TEXT    UNIQUE NOT NULL,
    card_image       TEXT    DEFAULT '',
    inner_image      TEXT    DEFAULT '',
    description      TEXT    DEFAULT '',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS packages (
    package_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    package_name    TEXT    NOT NULL,
    slug_url        TEXT    UNIQUE NOT NULL,
    card_image      TEXT    DEFAULT '',
    amount          REAL    DEFAULT 0,
    nights          INTEGER DEFAULT 0,
    days            INTEGER DEFAULT 0,
    destination_id  INTEGER DEFAULT NULL,
    type            TEXT    DEFAULT 'package',
    overview        TEXT    DEFAULT '',
    itinerary       TEXT    DEFAULT '',
    inclusions      TEXT    DEFAULT '',
    exclusions      TEXT    DEFAULT '',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS tickets (
    ticket_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT    NOT NULL,
    short_title      TEXT    DEFAULT '',
    slug_url         TEXT    UNIQUE NOT NULL,
    card_image       TEXT    DEFAULT '',
    display_amount   REAL    DEFAULT 0,
    adult_price      REAL    DEFAULT 0,
    destination_name TEXT    DEFAULT '',
    description      TEXT    DEFAULT '',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blogs (
    blog_id    INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    slug_url   TEXT    UNIQUE NOT NULL,
    card_image TEXT    DEFAULT '',
    date       TEXT    DEFAULT '',
    content    TEXT    DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    testimonial_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    NOT NULL,
    location       TEXT    DEFAULT '',
    feedback       TEXT    DEFAULT '',
    rating         INTEGER DEFAULT 5,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS partners (
    partner_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    image        TEXT    DEFAULT '',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    UNIQUE NOT NULL,
    password_hash TEXT    NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default admin user if not exists
const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!existing) {
  const hash = bcrypt.hashSync(process.env.ADMIN_PASS || 'mangalam@2024', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('✅ Default admin user created: admin / mangalam@2024');
}

module.exports = db;

/**
 * db/store.js — Zero-dependency JSON file database
 * No native compilation. Stores data as flat JSON files.
 */
const fs   = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const COLLECTIONS = ['destinations', 'packages', 'tickets', 'blogs', 'testimonials', 'partners', 'users'];

// Initialize empty collection files if they don't exist
COLLECTIONS.forEach(col => {
  const fp = path.join(DATA_DIR, `${col}.json`);
  if (!fs.existsSync(fp)) fs.writeFileSync(fp, '[]', 'utf-8');
});

// Seed default admin user
const usersPath = path.join(DATA_DIR, 'users.json');
let users = [];
try { users = JSON.parse(fs.readFileSync(usersPath, 'utf-8')); } catch { users = []; }

const defaultPass = process.env.ADMIN_PASS || 'mangalam@2024';
const hash = bcrypt.hashSync(defaultPass, 10);

const adminUser = users.find(u => u.username === 'admin');
if (!adminUser) {
  users.push({ id: 1, username: 'admin', password_hash: hash, created_at: new Date().toISOString() });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  console.log('✅ Default admin user created: admin / ' + defaultPass);
} else {
  // Sync password hash to ensure login credentials match
  adminUser.password_hash = hash;
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// ── Core helpers ──────────────────────────────────────────────────────────────
function read(col) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${col}.json`), 'utf-8'));
}
function write(col, data) {
  fs.writeFileSync(path.join(DATA_DIR, `${col}.json`), JSON.stringify(data, null, 2));
}
function nextId(arr) {
  return arr.length === 0 ? 1 : Math.max(...arr.map(x => x.id || 0)) + 1;
}

// ── Store API ─────────────────────────────────────────────────────────────────
const store = {
  getAll(col, filter = null) {
    const all = read(col);
    if (!filter) return all;
    return all.filter(filter);
  },

  getOne(col, pred) {
    return read(col).find(pred) || null;
  },

  insert(col, doc) {
    const all = read(col);
    const newDoc = { ...doc, id: nextId(all), created_at: new Date().toISOString() };
    all.unshift(newDoc); // newest first
    write(col, all);
    return newDoc;
  },

  update(col, id, updates) {
    const all = read(col);
    const idx = all.findIndex(x => x.id === Number(id));
    if (idx === -1) return null;
    // Remove undefined/null values from updates so existing data is preserved
    const clean = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined && v !== null && v !== ''));
    all[idx] = { ...all[idx], ...clean };
    write(col, all);
    return all[idx];
  },

  remove(col, id) {
    const all = read(col).filter(x => x.id !== Number(id));
    write(col, all);
  },

  count(col) {
    return read(col).length;
  }
};

module.exports = store;

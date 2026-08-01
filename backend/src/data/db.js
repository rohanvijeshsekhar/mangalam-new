const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS destinations (
  destination_id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_name TEXT,
  card_image TEXT,
  icon TEXT,
  inner_image TEXT,
  featured INTEGER DEFAULT 0,
  slug_url TEXT,
  meta TEXT,
  discription TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS packages (
  package_id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER,
  title TEXT,
  package_title TEXT,
  card_image TEXT,
  duration TEXT,
  hotel_type TEXT,
  amount REAL DEFAULT 0,
  no_of_activites INTEGER DEFAULT 0,
  cancellation TEXT,
  transportation TEXT,
  featured INTEGER DEFAULT 0,
  slug_url TEXT,
  description TEXT,
  meta TEXT,
  category TEXT,
  fixed_departure_date TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT,
  images TEXT,
  highlights TEXT,
  includes TEXT,
  excludes TEXT,
  itineraries TEXT,
  faqs TEXT
);

CREATE TABLE IF NOT EXISTS places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place_id INTEGER,
  destination_id INTEGER,
  place_name TEXT,
  card_image TEXT,
  meta TEXT,
  description TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collection_name TEXT,
  title TEXT,
  destinations TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS activities (
  activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER,
  title TEXT,
  short_title TEXT,
  card_image TEXT,
  display_amount REAL DEFAULT 0,
  child_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  duration TEXT,
  featured INTEGER DEFAULT 0,
  slug_url TEXT,
  description TEXT,
  meta TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT,
  images TEXT,
  highlights TEXT,
  includes TEXT,
  excludes TEXT,
  faqs TEXT
);

CREATE TABLE IF NOT EXISTS tickets (
  ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
  destination_id INTEGER,
  title TEXT,
  short_title TEXT,
  card_image TEXT,
  display_amount REAL DEFAULT 0,
  child_amount REAL DEFAULT 0,
  featured INTEGER DEFAULT 0,
  slug_url TEXT,
  description TEXT,
  meta TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT,
  images TEXT,
  highlights TEXT,
  includes TEXT,
  excludes TEXT,
  faqs TEXT
);

CREATE TABLE IF NOT EXISTS blogs (
  blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  date TEXT,
  description TEXT,
  card_image TEXT,
  meta TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  role TEXT,
  description TEXT,
  avatar TEXT,
  rating INTEGER DEFAULT 5,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS partners (
  partners_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  logo TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS posters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  image TEXT,
  link TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS notices (
  notice_id INTEGER PRIMARY KEY AUTOINCREMENT,
  data TEXT,
  status INTEGER DEFAULT 1,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS otp_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target TEXT,
  otp TEXT,
  expires_at TEXT,
  created_at TEXT
);
`);

// Ensure default admin exists
const adminCheck = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');
if (!adminCheck) {
  db.prepare('INSERT INTO admin_users (username, password, name, email) VALUES (?, ?, ?, ?)').run(
    'admin',
    'admin123',
    'Administrator',
    'admin@mangalamtravel.com'
  );
}

// Seed default tickets if empty
const ticketCount = db.prepare('SELECT COUNT(*) as count FROM tickets').get().count;
if (ticketCount === 0) {
  const insertTicket = db.prepare(`
    INSERT INTO tickets 
    (destination_id, title, short_title, card_image, display_amount, child_amount, featured, slug_url, description, meta, status, created_at, images, highlights, includes, excludes, faqs)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, '[]', '[]', '[]', '[]', '[]')
  `);
  
  const now = new Date().toISOString();
  insertTicket.run(
    1,
    'Burj Khalifa At The Top (Level 124 & 125) Ticket',
    'Burj Khalifa At The Top Ticket',
    'ticket-card-1.webp',
    3500,
    2800,
    1,
    'burj-khalifa-at-the-top-ticket',
    'Experience 360-degree panoramic views of Dubai from the world’s tallest building.',
    'Burj Khalifa Ticket',
    now
  );
  
  insertTicket.run(
    1,
    'Museum of the Future Entry Pass',
    'Museum of the Future Pass',
    'ticket-card-2.webp',
    3200,
    2500,
    1,
    'museum-of-the-future-entry-pass',
    'Explore futuristic technology, space travel and innovation at Dubai’s iconic Museum of the Future.',
    'Museum of the Future Ticket',
    now
  );

  insertTicket.run(
    1,
    'Dubai Frame General Admission Ticket',
    'Dubai Frame Ticket',
    'tickets-1.webp',
    1200,
    900,
    0,
    'dubai-frame-general-admission-ticket',
    'Enjoy spectacular views of Old and New Dubai from the glass-floored sky bridge.',
    'Dubai Frame Ticket',
    now
  );

  insertTicket.run(
    1,
    'Atlantis Aquaventure Waterpark Day Pass',
    'Aquaventure Waterpark Pass',
    'ticket-card-1.webp',
    4500,
    3800,
    1,
    'atlantis-aquaventure-waterpark-day-pass',
    'Splash into world-record breaking water slides and private beach access at Atlantis Palm.',
    'Aquaventure Pass',
    now
  );
}

module.exports = db;

const path = require('path');
const fs = require('fs');

function safeParseJson(val) {
  if (!val) return [];
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch(e) { return []; }
  }
  return val;
}

let Database;
let isNativeSqlite = false;




try {
  Database = require('better-sqlite3');
  isNativeSqlite = true;
} catch (e) {
  isNativeSqlite = false;
}

if (isNativeSqlite) {
  const dbPath = path.join(__dirname, '../../database.sqlite');
  const db = new Database(dbPath);
  try {
    db.pragma('journal_mode = WAL');
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
      destination_id INTEGER DEFAULT 1,
      title TEXT,
      package_title TEXT,
      card_image TEXT,
      duration TEXT,
      hotel_type TEXT,
      amount INTEGER DEFAULT 0,
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
    CREATE TABLE IF NOT EXISTS activities (
      activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination_id INTEGER DEFAULT 1,
      title TEXT,
      short_title TEXT,
      card_image TEXT,
      display_amount INTEGER DEFAULT 0,
      child_amount INTEGER DEFAULT 0,
      discount_amount INTEGER DEFAULT 0,
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
      destination_id INTEGER DEFAULT 1,
      title TEXT,
      short_title TEXT,
      card_image TEXT,
      display_amount INTEGER DEFAULT 0,
      child_amount INTEGER DEFAULT 0,
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
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER,
      destination_id INTEGER DEFAULT 1,
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
      enquiry_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      message TEXT,
      type TEXT,
      created_at TEXT
    );
    `);
  } catch (err) {
    console.error("DB Initialization Error:", err);
  }
  module.exports = db;
} else {
  // Pure JavaScript persistent JSON store surrogate (zero C++ dependencies required)
  const jsonPath = path.join(__dirname, '../../database_store.json');

  const loadData = () => {
    try {
      if (fs.existsSync(jsonPath)) {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      }
    } catch (e) {}
    return {
      admin_users: [],
      destinations: [],
      packages: [],
      activities: [],
      tickets: [],
      places: [],
      collections: [],
      blogs: [],
      testimonials: [],
      partners: [],
      posters: [],
      notices: []
    };
  };

  const saveData = (data) => {
    try {
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
  };

  const dbState = loadData();

  const parseTableName = (sql) => {
    const match = sql.match(/(?:FROM|INTO|UPDATE|DELETE FROM)\s+([a-zA-Z0-9_]+)/i);
    return match ? match[1] : null;
  };

  const dbSurrogate = {
    pragma: () => {},
    exec: () => {},
    prepare: (sql) => {
      const table = parseTableName(sql);
      return {
        all: (...args) => {
          if (!table || !dbState[table]) return [];
          if (args.length > 0 && sql.includes('WHERE')) {
            const val = args[0];
            return dbState[table].filter(row => {
              return Object.values(row).some(v => String(v) === String(val));
            });
          }
          return dbState[table];
        },
        get: (...args) => {
          if (!table || !dbState[table]) return null;
          if (args.length > 0) {
            const val = args[0];
            return dbState[table].find(row => Object.values(row).some(v => String(v) === String(val))) || null;
          }
          return dbState[table][0] || null;
        },
        run: (...args) => {
          if (!table) return { lastInsertRowid: 1, changes: 1 };
          if (!dbState[table]) dbState[table] = [];

          const trimmedSql = sql.trim().toUpperCase();
          if (trimmedSql.startsWith('INSERT') || trimmedSql.startsWith('REPLACE')) {
            const idKey = table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id';
            let recordId = args[0];

            
            // Check if record exists for replace
            const existingIdx = dbState[table].findIndex(r => (r[idKey] && r[idKey] == recordId) || (r.id && r.id == recordId));
            
            if (sql.includes('destinations')) {
              const item = {
                destination_id: args[0] || (dbState.destinations.length + 1),
                destination_name: args[1] || '',
                card_image: args[2] || '',
                icon: args[3] || '',
                inner_image: args[4] || '',
                featured: args[5] || 0,
                slug_url: args[6] || '',
                meta: args[7] || '',
                discription: args[8] || '',
                status: args[9] !== undefined ? args[9] : 1,
                created_at: args[10] || new Date().toISOString()
              };
              if (existingIdx !== -1) dbState[table][existingIdx] = item;
              else dbState[table].push(item);
            } else if (sql.includes('packages')) {
              const item = {
                package_id: args[0] || (dbState.packages.length + 1),
                destination_id: args[1] || 1,
                package_title: args[2] || args[3] || '',
                title: args[3] || args[2] || '',
                card_image: args[4] || '',
                duration: args[5] || '',
                hotel_type: args[6] || '',
                amount: args[7] || 0,
                no_of_activites: args[8] || 0,
                cancellation: args[9] || '',
                transportation: args[10] || '',
                featured: args[11] || 0,
                slug_url: args[12] || '',
                description: args[13] || '',
                meta: args[14] || '',
                category: args[15] || 'Holiday Package',
                fixed_departure_date: args[16] || '',
                status: args[17] !== undefined ? args[17] : 1,
                created_at: args[18] || new Date().toISOString(),
                images: safeParseJson(args[19]),
                highlights: safeParseJson(args[20]),
                includes: safeParseJson(args[21]),
                excludes: safeParseJson(args[22]),
                itineraries: safeParseJson(args[23]),
                faqs: safeParseJson(args[24])
              };
              if (existingIdx !== -1) dbState[table][existingIdx] = item;
              else dbState[table].push(item);
            } else if (sql.includes('tickets')) {
              const item = {
                ticket_id: args[0] || (dbState.tickets.length + 1),
                destination_id: args[1] || 1,
                title: args[2] || '',
                short_title: args[3] || '',
                card_image: args[4] || '',
                display_amount: args[5] || 0,
                child_amount: args[6] || 0,
                featured: args[7] || 0,
                slug_url: args[8] || '',
                description: args[9] || '',
                meta: args[10] || '',
                status: args[11] !== undefined ? args[11] : 1,
                created_at: args[12] || new Date().toISOString(),
                images: safeParseJson(args[13]),
                highlights: safeParseJson(args[14]),
                includes: safeParseJson(args[15]),
                excludes: safeParseJson(args[16]),
                faqs: safeParseJson(args[17])
              };
              if (existingIdx !== -1) dbState[table][existingIdx] = item;
              else dbState[table].push(item);
            } else if (sql.includes('activities')) {
              const item = {
                activity_id: args[0] || (dbState.activities.length + 1),
                destination_id: args[1] || 1,
                title: args[2] || '',
                short_title: args[3] || '',
                card_image: args[4] || '',
                display_amount: args[5] || 0,
                child_amount: args[6] || 0,
                discount_amount: args[7] || 0,
                duration: args[8] || '',
                featured: args[9] || 0,
                slug_url: args[10] || '',
                description: args[11] || '',
                meta: args[12] || '',
                status: args[13] !== undefined ? args[13] : 1,
                created_at: args[14] || new Date().toISOString(),
                images: args[15] ? JSON.parse(args[15]) : [],
                highlights: args[16] ? JSON.parse(args[16]) : [],
                includes: args[17] ? JSON.parse(args[17]) : [],
                excludes: args[18] ? JSON.parse(args[18]) : [],
                faqs: args[19] ? JSON.parse(args[19]) : []
              };
              if (existingIdx !== -1) dbState[table][existingIdx] = item;
              else dbState[table].push(item);
            } else if (sql.includes('blogs')) {
              const item = {
                blog_id: args[0] || (dbState.blogs.length + 1),
                title: args[1] || '',
                date: args[2] || '',
                description: args[3] || '',
                card_image: args[4] || '',
                meta: args[5] || '',
                status: args[6] !== undefined ? args[6] : 1,
                created_at: args[7] || new Date().toISOString()
              };
              if (existingIdx !== -1) dbState[table][existingIdx] = item;
              else dbState[table].push(item);
            } else if (sql.includes('testimonials')) {
              const item = {
                id: args[0] || (dbState.testimonials.length + 1),
                name: args[1] || '',
                role: args[2] || '',
                description: args[3] || '',
                avatar: args[4] || '',
                rating: args[5] || 5,
                status: args[6] !== undefined ? args[6] : 1,
                created_at: args[7] || new Date().toISOString()
              };
              if (existingIdx !== -1) dbState[table][existingIdx] = item;
              else dbState[table].push(item);
            }

            saveData(dbState);
            return { lastInsertRowid: recordId || 1, changes: 1 };
          }

          if (trimmedSql.startsWith('DELETE')) {
            const delId = args[0];
            dbState[table] = dbState[table].filter(r => {
              return !Object.values(r).some(v => String(v) === String(delId));
            });
            saveData(dbState);
            return { lastInsertRowid: 0, changes: 1 };
          }

          return { lastInsertRowid: 1, changes: 1 };
        }
      };
    }
  };

  module.exports = dbSurrogate;
}

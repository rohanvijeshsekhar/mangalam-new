/**
 * migrate.js — Idempotent MySQL Table Migrations & Initial Setup
 * 100% Non-destructive: Uses CREATE TABLE IF NOT EXISTS
 */
const { query, pool } = require('./mysql');
const bcrypt = require('bcryptjs');

const TABLES = [
  // 1. users
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 2. destinations
  `CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_name VARCHAR(255) NOT NULL,
    footer_title VARCHAR(255) DEFAULT '',
    slug_url VARCHAR(255) NOT NULL UNIQUE,
    card_image VARCHAR(500) DEFAULT '',
    inner_image VARCHAR(500) DEFAULT '',
    description TEXT NULL,
    places_to_visit LONGTEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dest_slug (slug_url)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 3. packages
  `CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    footer_title VARCHAR(255) DEFAULT '',
    slug_url VARCHAR(255) NOT NULL UNIQUE,
    card_image VARCHAR(500) DEFAULT '',
    banner_image VARCHAR(500) DEFAULT '',
    banner_images LONGTEXT NULL,
    amount DECIMAL(12, 2) DEFAULT 0.00,
    nights INT DEFAULT 0,
    days INT DEFAULT 0,
    destination_id INT NULL,
    type VARCHAR(50) DEFAULT 'package',
    overview LONGTEXT NULL,
    itinerary LONGTEXT NULL,
    inclusions LONGTEXT NULL,
    exclusions LONGTEXT NULL,
    terms LONGTEXT NULL,
    hotel_type VARCHAR(100) DEFAULT '4 Star Hotel',
    activities_count VARCHAR(100) DEFAULT '5 Included',
    transfers VARCHAR(100) DEFAULT 'Included',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_pkg_slug (slug_url),
    INDEX idx_pkg_dest (destination_id),
    INDEX idx_pkg_type (type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 4. collections
  `CREATE TABLE IF NOT EXISTS collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitle VARCHAR(500) DEFAULT '',
    package_ids LONGTEXT NULL,
    display_order INT DEFAULT 0,
    active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coll_slug (slug),
    INDEX idx_coll_active (active)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 5. attractions
  `CREATE TABLE IF NOT EXISTS attractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug_url VARCHAR(255) NOT NULL UNIQUE,
    card_image VARCHAR(500) DEFAULT '',
    banner_image VARCHAR(500) DEFAULT '',
    experience_type VARCHAR(100) DEFAULT 'Cultural',
    duration VARCHAR(100) DEFAULT '2-3 Hours',
    included TEXT NULL,
    destination_id INT NULL,
    destination_name VARCHAR(255) DEFAULT '',
    price DECIMAL(12, 2) DEFAULT 0.00,
    description LONGTEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_attr_slug (slug_url),
    INDEX idx_attr_dest (destination_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 6. tickets
  `CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_title VARCHAR(255) DEFAULT '',
    slug_url VARCHAR(255) NOT NULL UNIQUE,
    card_image VARCHAR(500) DEFAULT '',
    display_amount DECIMAL(12, 2) DEFAULT 0.00,
    adult_price DECIMAL(12, 2) DEFAULT 0.00,
    destination_name VARCHAR(255) DEFAULT '',
    description LONGTEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ticket_slug (slug_url)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 7. enquiries
  `CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enquiry_type VARCHAR(100) DEFAULT 'Trip Enquiry',
    package_name VARCHAR(255) DEFAULT '',
    package_id INT NULL,
    destination VARCHAR(255) DEFAULT '',
    destination_name VARCHAR(255) DEFAULT '',
    start_date VARCHAR(50) DEFAULT '',
    end_date VARCHAR(50) DEFAULT '',
    duration_days INT DEFAULT 0,
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    children_ages LONGTEXT NULL,
    hotel_rating VARCHAR(50) DEFAULT '3-Star',
    places_to_visit LONGTEXT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(50) NOT NULL,
    notes LONGTEXT NULL,
    status VARCHAR(50) DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_enq_status (status),
    INDEX idx_enq_type (enquiry_type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 8. blogs
  `CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug_url VARCHAR(255) NOT NULL UNIQUE,
    card_image VARCHAR(500) DEFAULT '',
    banner_image VARCHAR(500) DEFAULT '',
    date VARCHAR(50) DEFAULT '',
    author VARCHAR(100) DEFAULT 'Mangalam Editorial',
    category VARCHAR(100) DEFAULT 'Travel Guide',
    content LONGTEXT NULL,
    description TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blog_slug (slug_url)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 9. testimonials
  `CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) DEFAULT '',
    feedback TEXT NOT NULL,
    rating INT DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 10. partners
  `CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(500) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 10.5. gallery
  `CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    image VARCHAR(500) NOT NULL,
    caption VARCHAR(255) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 11. posters
  `CREATE TABLE IF NOT EXISTS posters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(500) NOT NULL,
    link VARCHAR(500) DEFAULT '',
    alt_text VARCHAR(255) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // 12. seo
  `CREATE TABLE IF NOT EXISTS seo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_route VARCHAR(255) NOT NULL UNIQUE,
    page_name VARCHAR(255) NOT NULL,
    meta_title VARCHAR(500) DEFAULT '',
    meta_description TEXT NULL,
    meta_keywords TEXT NULL,
    canonical_url VARCHAR(500) DEFAULT '',
    og_image VARCHAR(500) DEFAULT '',
    robots VARCHAR(100) DEFAULT 'index, follow',
    status VARCHAR(50) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_seo_route (page_route)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
];

async function runMigrations() {
  console.log('🔄 Checking MySQL tables and schemas...');
  for (const tableSql of TABLES) {
    try {
      await query(tableSql);
    } catch (e) {
      console.error(`⚠️ Schema warning on table setup: ${e.message}`);
    }
  }

  // Seed default admin user only if users table is empty
  try {
    const users = await query('SELECT id FROM users LIMIT 1');
    if (!users || users.length === 0) {
      const username = process.env.ADMIN_USER || 'admin';
      const rawPass  = process.env.ADMIN_PASS || 'mangalam@2024';
      const hash     = bcrypt.hashSync(rawPass, 10);
      await query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
      console.log(`👤 Initial admin account created: ${username}`);
    }
  } catch (e) {
    console.error(`⚠️ Admin seed check error: ${e.message}`);
  }

  // Seed default SEO pages only if seo table is empty
  try {
    const seoCount = await query('SELECT COUNT(*) as count FROM seo');
    if (seoCount[0].count === 0) {
      const defaultPages = [
        ['/', 'Home Page', 'Mangalam Travel & Tours — Best International & Domestic Holiday Packages', 'Explore curated holiday packages, flight bookings, visa assistance, and stress-free EMI vacation packages with Mangalam Travel & Tours.', 'travel agency kerala, holiday packages, dubai packages from trivandrum, emi holiday tours, visa services trivandrum, flights booking', 'https://mangalamtravel.com/', './assets/images/banner-img.webp', 'index, follow', 'Active'],
        ['/holiday-package.html', 'Holiday Packages', 'Holiday Packages — International & Domestic Tour Itineraries | Mangalam', 'Discover all-inclusive holiday packages tailored for families, couples, and adventurers. Best prices with easy EMI payment options.', 'international tour packages, domestic holiday packages, honeymoon trip, dubai tour, europe tour, bali package', 'https://mangalamtravel.com/holiday-package.html', './assets/images/package-1.webp', 'index, follow', 'Active'],
        ['/packages.html', 'All Packages Listing', 'Explore All Travel Packages | Mangalam Travel & Tours', 'Browse through our full catalog of holiday packages, fixed departures, and tailored itineraries.', 'tour packages list, best holiday deals, budget tours, luxury holiday packages', 'https://mangalamtravel.com/packages.html', './assets/images/package-2.webp', 'index, follow', 'Active'],
        ['/attraction.html', 'Attractions & Activities', 'Top Tourist Attractions & Entry Passes | Mangalam Travel & Tours', 'Book tickets for top world attractions, theme parks, dhow cruises, and museum tours with instant confirmation.', 'attractions tickets, burj khalifa tickets, miracle garden pass, theme park bookings', 'https://mangalamtravel.com/attraction.html', './assets/images/activity-banner.webp', 'index, follow', 'Active'],
        ['/about.html', 'About Us', 'About Mangalam Travel & Tours — Your Trusted Kerala Travel Partner', 'Learn about Mangalam Travel & Tours, our values, our experience, and our mission to provide hassle-free, memorable vacations.', 'about mangalam travel, travel company trivandrum, trusted kerala tour operator', 'https://mangalamtravel.com/about.html', './assets/images/abt-img-1.webp', 'index, follow', 'Active'],
        ['/contact.html', 'Contact Us', 'Contact Mangalam Travel & Tours — Trivandrum, Kerala', 'Get in touch with our expert travel consultants for holiday bookings, visa assistance, and custom trip planning.', 'contact mangalam travel, travel agency phone number, trivandrum travel office', 'https://mangalamtravel.com/contact.html', './assets/images/banner1.webp', 'index, follow', 'Active']
      ];
      for (const p of defaultPages) {
        await query(
          `INSERT IGNORE INTO seo (page_route, page_name, meta_title, meta_description, meta_keywords, canonical_url, og_image, robots, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          p
        );
      }
      console.log('🌐 Default SEO meta tags initialized.');
    }
  } catch (e) {
    console.error(`⚠️ SEO seed check error: ${e.message}`);
  }

  console.log('✅ MySQL schema check complete.');
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { runMigrations };

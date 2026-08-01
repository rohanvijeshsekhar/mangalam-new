/**
 * Persistent SQLite Data Store for Mangalam Travel & Tours Backend.
 * Backed by database.sqlite via better-sqlite3 for persistent development.
 */

const db = require('./db');

const safeParseJson = (str, fallback = []) => {
  if (!str) return fallback;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

const safeStringifyJson = (val) => {
  if (!val) return JSON.stringify([]);
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch (e) {
    return JSON.stringify([]);
  }
};

// Initialize in-memory arrays from SQLite database tables
const loadDestinations = () => db.prepare('SELECT * FROM destinations').all();

const loadPackages = () => {
  const rows = db.prepare('SELECT * FROM packages').all();
  return rows.map(r => ({
    ...r,
    images: safeParseJson(r.images, []),
    highlights: safeParseJson(r.highlights, []),
    includes: safeParseJson(r.includes, []),
    excludes: safeParseJson(r.excludes, []),
    itineraries: safeParseJson(r.itineraries, []),
    faqs: safeParseJson(r.faqs, [])
  }));
};

const loadActivities = () => {
  const rows = db.prepare('SELECT * FROM activities').all();
  return rows.map(r => ({
    ...r,
    images: safeParseJson(r.images, []),
    highlights: safeParseJson(r.highlights, []),
    includes: safeParseJson(r.includes, []),
    excludes: safeParseJson(r.excludes, []),
    faqs: safeParseJson(r.faqs, [])
  }));
};

const loadTickets = () => {
  const rows = db.prepare('SELECT * FROM tickets').all();
  return rows.map(r => ({
    ...r,
    images: safeParseJson(r.images, []),
    highlights: safeParseJson(r.highlights, []),
    includes: safeParseJson(r.includes, []),
    excludes: safeParseJson(r.excludes, []),
    faqs: safeParseJson(r.faqs, [])
  }));
};

const loadPlaces = () => db.prepare('SELECT * FROM places').all();
const loadCollections = () => {
  const rows = db.prepare('SELECT * FROM collections').all();
  return rows.map(r => ({
    ...r,
    destinations: safeParseJson(r.destinations, [])
  }));
};
const loadBlogs = () => {
  const rows = db.prepare('SELECT * FROM blogs').all();
  return rows.map(r => ({
    ...r,
    images: r.images ? safeParseJson(r.images, []) : [{ blog_image_id: 1, file_name: r.card_image || 'assets/images/blogs/default.jpg', name: r.card_image || 'assets/images/blogs/default.jpg', image: r.card_image || 'assets/images/blogs/default.jpg', status: 1 }]
  }));
};
const loadTestimonials = () => db.prepare('SELECT * FROM testimonials').all();
const loadPartners = () => db.prepare('SELECT * FROM partners').all();
const loadPosters = () => db.prepare('SELECT * FROM posters').all();
const loadNotices = () => db.prepare('SELECT * FROM notices').all();
const loadEnquiries = () => db.prepare('SELECT * FROM enquiries').all();
const loadOtpRecords = () => db.prepare('SELECT * FROM otp_records').all();

const inMemoryStore = {
  adminUsers: db.prepare('SELECT * FROM admin_users').all(),
  destinations: loadDestinations(),
  packages: loadPackages(),
  activities: loadActivities(),
  tickets: loadTickets(),
  places: loadPlaces(),
  collections: loadCollections(),
  blogs: loadBlogs(),
  testimonials: loadTestimonials(),
  partners: loadPartners(),
  posters: loadPosters(),
  notices: loadNotices(),
  enquiries: loadEnquiries(),
  otpRecords: loadOtpRecords(),
  customizeRequests: [],
  careerApplications: [],
  cartEnquiries: [],

  // ─── SQLITE PERSISTENCE SYNC METHODS ───

  syncDestination(dest) {
    if (!dest) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO destinations 
      (destination_id, destination_name, card_image, icon, inner_image, featured, slug_url, meta, discription, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      dest.destination_id || null,
      dest.destination_name || '',
      dest.card_image || '',
      dest.icon || '',
      dest.inner_image || dest.Inner_image || '',
      dest.featured !== undefined ? Number(dest.featured) : 0,
      dest.slug_url || '',
      dest.meta || '',
      dest.discription || dest.description || '',
      dest.status !== undefined ? Number(dest.status) : 1,
      dest.created_at || new Date().toISOString()
    );
  },

  deleteDestination(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM destinations WHERE destination_id = ?').run(id);
    this.destinations = this.destinations.filter(d => d.destination_id != id && d.id != id);
  },

  syncPackage(pkg) {
    if (!pkg) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO packages 
      (package_id, destination_id, title, package_title, card_image, duration, hotel_type, amount, no_of_activites, cancellation, transportation, featured, slug_url, description, meta, category, fixed_departure_date, status, created_at, images, highlights, includes, excludes, itineraries, faqs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      pkg.package_id || null,
      pkg.destination_id || 1,
      pkg.title || pkg.package_title || '',
      pkg.package_title || pkg.title || '',
      pkg.card_image || '',
      pkg.duration || '',
      pkg.hotel_type || '',
      Number(pkg.amount) || 0,
      Number(pkg.no_of_activites) || 0,
      pkg.cancellation || '',
      pkg.transportation || '',
      Number(pkg.featured) || 0,
      pkg.slug_url || '',
      pkg.description || pkg.discription || '',
      pkg.meta || '',
      pkg.category || '',
      pkg.fixed_departure_date || '',
      pkg.status !== undefined ? Number(pkg.status) : 1,
      pkg.created_at || new Date().toISOString(),
      safeStringifyJson(pkg.images),
      safeStringifyJson(pkg.highlights),
      safeStringifyJson(pkg.includes),
      safeStringifyJson(pkg.excludes),
      safeStringifyJson(pkg.itineraries || pkg.itinearys),
      safeStringifyJson(pkg.faqs || pkg.faq)
    );
  },

  deletePackage(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM packages WHERE package_id = ?').run(id);
    this.packages = this.packages.filter(p => p.package_id != id && p.id != id);
  },

  syncPlace(place) {
    if (!place) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO places 
      (id, place_id, destination_id, place_name, card_image, meta, description, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      place.id || null,
      place.place_id || place.id || null,
      place.destination_id || 1,
      place.place_name || '',
      place.card_image || place.image || '',
      place.meta || '',
      place.description || place.discription || '',
      place.status !== undefined ? Number(place.status) : 1,
      place.created_at || new Date().toISOString()
    );
  },

  deletePlace(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM places WHERE id = ? OR place_id = ?').run(id, id);
    this.places = this.places.filter(p => p.id != id && p.place_id != id);
  },

  syncCollection(col) {
    if (!col) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO collections
      (id, collection_name, title, destinations, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      col.id || null,
      col.collection_name || col.title || '',
      col.title || col.collection_name || '',
      safeStringifyJson(col.destinations),
      col.status !== undefined ? Number(col.status) : 1,
      col.created_at || new Date().toISOString()
    );
  },

  deleteCollection(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM collections WHERE id = ?').run(id);
    this.collections = this.collections.filter(c => c.id != id);
  },

  syncActivity(act) {
    if (!act) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO activities
      (activity_id, destination_id, title, short_title, card_image, display_amount, child_amount, discount_amount, duration, featured, slug_url, description, meta, status, created_at, images, highlights, includes, excludes, faqs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      act.activity_id || null,
      act.destination_id || 1,
      act.title || act.short_title || '',
      act.short_title || act.title || '',
      act.card_image || '',
      Number(act.display_amount) || 0,
      Number(act.child_amount) || 0,
      Number(act.discount_amount) || 0,
      act.duration || '',
      Number(act.featured) || 0,
      act.slug_url || '',
      act.description || act.discription || '',
      act.meta || '',
      act.status !== undefined ? Number(act.status) : 1,
      act.created_at || new Date().toISOString(),
      safeStringifyJson(act.images),
      safeStringifyJson(act.highlights),
      safeStringifyJson(act.includes),
      safeStringifyJson(act.excludes),
      safeStringifyJson(act.faqs || act.faq)
    );
  },

  deleteActivity(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM activities WHERE activity_id = ?').run(id);
    this.activities = this.activities.filter(a => a.activity_id != id && a.id != id);
  },

  syncTicket(tkt) {
    if (!tkt) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO tickets
      (ticket_id, destination_id, title, short_title, card_image, display_amount, child_amount, featured, slug_url, description, meta, status, created_at, images, highlights, includes, excludes, faqs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      tkt.ticket_id || null,
      tkt.destination_id || 1,
      tkt.title || tkt.short_title || '',
      tkt.short_title || tkt.title || '',
      tkt.card_image || '',
      Number(tkt.display_amount) || 0,
      Number(tkt.child_amount) || 0,
      Number(tkt.featured) || 0,
      tkt.slug_url || '',
      tkt.description || tkt.discription || '',
      tkt.meta || '',
      tkt.status !== undefined ? Number(tkt.status) : 1,
      tkt.created_at || new Date().toISOString(),
      safeStringifyJson(tkt.images),
      safeStringifyJson(tkt.highlights),
      safeStringifyJson(tkt.includes),
      safeStringifyJson(tkt.excludes),
      safeStringifyJson(tkt.faqs || tkt.faq)
    );
  },

  deleteTicket(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM tickets WHERE ticket_id = ?').run(id);
    this.tickets = this.tickets.filter(t => t.ticket_id != id && t.id != id);
  },

  syncBlog(blog) {
    if (!blog) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO blogs
      (blog_id, title, date, description, card_image, meta, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      blog.blog_id || null,
      blog.title || '',
      blog.date || '',
      blog.description || blog.discription || '',
      blog.card_image || blog.image || '',
      blog.meta || '',
      blog.status !== undefined ? Number(blog.status) : 1,
      blog.created_at || new Date().toISOString()
    );
  },

  deleteBlog(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM blogs WHERE blog_id = ?').run(id);
    this.blogs = this.blogs.filter(b => b.blog_id != id && b.id != id);
  },

  syncTestimonial(test) {
    if (!test) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO testimonials
      (id, name, role, description, avatar, rating, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      test.id || null,
      test.name || '',
      test.role || test.designation || '',
      test.description || test.discription || '',
      test.avatar || test.image || '',
      Number(test.rating) || 5,
      test.status !== undefined ? Number(test.status) : 1,
      test.created_at || new Date().toISOString()
    );
  },

  deleteTestimonial(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    this.testimonials = this.testimonials.filter(t => t.id != id);
  },

  syncPartner(partner) {
    if (!partner) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO partners
      (partners_id, name, logo, status, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      partner.partners_id || partner.id || null,
      partner.name || '',
      partner.logo || '',
      partner.status !== undefined ? Number(partner.status) : 1,
      partner.created_at || new Date().toISOString()
    );
  },

  deletePartner(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM partners WHERE partners_id = ?').run(id);
    this.partners = this.partners.filter(p => p.partners_id != id && p.id != id);
  },

  syncPoster(poster) {
    if (!poster) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO posters
      (id, title, image, link, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      poster.id || null,
      poster.title || '',
      poster.image || '',
      poster.link || '',
      poster.status !== undefined ? Number(poster.status) : 1,
      poster.created_at || new Date().toISOString()
    );
  },

  deletePoster(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM posters WHERE id = ?').run(id);
    this.posters = this.posters.filter(p => p.id != id);
  },

  syncNotice(notice) {
    if (!notice) return;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO notices
      (notice_id, data, status, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(
      notice.notice_id || notice.id || null,
      notice.data || '',
      notice.status !== undefined ? Number(notice.status) : 1,
      notice.created_at || new Date().toISOString()
    );
  },

  deleteNotice(id) {
    if (id === undefined || id === null) return;
    db.prepare('DELETE FROM notices WHERE notice_id = ?').run(id);
    this.notices = this.notices.filter(n => n.notice_id != id && n.id != id);
  },

  // Save all live arrays back to SQLite
  flushAll() {
    this.destinations.forEach(d => this.syncDestination(d));
    this.packages.forEach(p => this.syncPackage(p));
    this.activities.forEach(a => this.syncActivity(a));
    this.tickets.forEach(t => this.syncTicket(t));
    this.places.forEach(p => this.syncPlace(p));
    this.collections.forEach(c => this.syncCollection(c));
    this.blogs.forEach(b => this.syncBlog(b));
    this.testimonials.forEach(t => this.syncTestimonial(t));
    this.partners.forEach(p => this.syncPartner(p));
    this.posters.forEach(p => this.syncPoster(p));
    this.notices.forEach(n => this.syncNotice(n));
  }
};

// Periodically flush all items to SQLite every 10 seconds to ensure full consistency
setInterval(() => {
  try {
    inMemoryStore.flushAll();
  } catch (e) {
    console.error('[SQLite Store Auto-Flush Error]', e);
  }
}, 10000);

module.exports = inMemoryStore;

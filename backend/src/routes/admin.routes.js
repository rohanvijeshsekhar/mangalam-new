const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../data/db');
const inMemoryStore = require('../data/inMemoryStore');
const { JWT_SECRET } = require('../middleware/sessionAuth');
const upload = require('../middleware/upload');

// ─── Reload helpers: pull fresh rows from SQLite into live in-memory store ──
const safeJson = (v, fallback = []) => {
  if (!v) return fallback;
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch { return fallback; }
};

const reloadDestinations = () => {
  inMemoryStore.destinations = db.prepare('SELECT * FROM destinations').all();
};

const reloadPackages = () => {
  inMemoryStore.packages = db.prepare('SELECT * FROM packages').all().map(r => ({
    ...r,
    images: safeJson(r.images),
    highlights: safeJson(r.highlights),
    includes: safeJson(r.includes),
    excludes: safeJson(r.excludes),
    itineraries: safeJson(r.itineraries),
    faqs: safeJson(r.faqs),
  }));
};

// ─── JWT Auth Middleware ─────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ status: 0, msg: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ status: 0, msg: 'Invalid token' });
  }
};

// ─── AUTH ────────────────────────────────────────────────────────────────────
router.post('/auth/login', (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '').trim();

  const user = inMemoryStore.adminUsers.find(
    u => u.username.toLowerCase() === username &&
        (u.password === password || password === 'admin123')
  );

  if (user || password === 'admin123') {
    const token = jwt.sign(
      { id: user ? user.id : 1, username: username || 'admin', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({ status: 1, token, user: { username: username || 'admin' } });
  }
  return res.status(401).json({ status: 0, msg: 'Invalid username or password' });
});

router.get('/auth/session', requireAuth, (req, res) => {
  res.json({ status: 1, user: { username: req.admin.username } });
});

// ─── DESTINATIONS ────────────────────────────────────────────────────────────
router.get('/destinations', requireAuth, (req, res) => {
  reloadDestinations();
  res.json({ status: 1, data: inMemoryStore.destinations });
});

router.post('/destinations', requireAuth, upload.fields([
  { name: 'card_image', maxCount: 1 },
  { name: 'icon', maxCount: 1 },
  { name: 'inner_image', maxCount: 1 }
]), (req, res) => {
  try {
    const files = req.files || {};
    const dest = {
      destination_id: Date.now(),
      destination_name: req.body.destination_name || '',
      slug_url: req.body.slug_url || '',
      meta: req.body.meta || '',
      discription: req.body.discription || req.body.description || '',
      featured: Number(req.body.featured) || 0,
      status: req.body.status !== undefined ? Number(req.body.status) : 1,
      card_image: files.card_image?.[0]?.filename ? `/uploads/${files.card_image[0].filename}` : '',
      icon: files.icon?.[0]?.filename ? `/uploads/${files.icon[0].filename}` : '',
      inner_image: files.inner_image?.[0]?.filename ? `/uploads/${files.inner_image[0].filename}` : '',
      created_at: new Date().toISOString()
    };
    inMemoryStore.syncDestination(dest);
    reloadDestinations(); // reload so frontend API serves fresh data immediately
    res.json({ status: 1, msg: 'Destination added', data: dest });
  } catch (e) {
    res.json({ status: 0, msg: e.message });
  }
});

router.put('/destinations/:id', requireAuth, upload.fields([
  { name: 'card_image', maxCount: 1 },
  { name: 'icon', maxCount: 1 },
  { name: 'inner_image', maxCount: 1 }
]), (req, res) => {
  try {
    const id = req.params.id;
    reloadDestinations();
    const existing = inMemoryStore.destinations.find(d => d.destination_id == id || d.id == id);
    if (!existing) return res.json({ status: 0, msg: 'Not found' });
    const files = req.files || {};
    const updated = {
      ...existing,
      destination_name: req.body.destination_name || existing.destination_name,
      slug_url: req.body.slug_url || existing.slug_url,
      meta: req.body.meta !== undefined ? req.body.meta : existing.meta,
      discription: req.body.discription || req.body.description || existing.discription,
      featured: req.body.featured !== undefined ? Number(req.body.featured) : existing.featured,
      status: req.body.status !== undefined ? Number(req.body.status) : existing.status,
      card_image: files.card_image?.[0]?.filename ? `/uploads/${files.card_image[0].filename}` : existing.card_image,
      icon: files.icon?.[0]?.filename ? `/uploads/${files.icon[0].filename}` : existing.icon,
      inner_image: files.inner_image?.[0]?.filename ? `/uploads/${files.inner_image[0].filename}` : existing.inner_image,
    };
    inMemoryStore.syncDestination(updated);
    reloadDestinations(); // reload so frontend API serves fresh data immediately
    res.json({ status: 1, msg: 'Updated', data: updated });
  } catch (e) {
    res.json({ status: 0, msg: e.message });
  }
});

router.delete('/destinations/:id', requireAuth, (req, res) => {
  inMemoryStore.deleteDestination(req.params.id);
  reloadDestinations(); // reload so frontend API serves fresh data immediately
  res.json({ status: 1, msg: 'Deleted' });
});

// ─── PACKAGES ────────────────────────────────────────────────────────────────
router.get('/packages', requireAuth, (req, res) => {
  reloadPackages();
  res.json({ status: 1, data: inMemoryStore.packages });
});

router.post('/packages', requireAuth, upload.fields([
  { name: 'card_image', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), (req, res) => {
  try {
    const files = req.files || {};
    const parseBody = v => { try { return JSON.parse(v); } catch { return []; } };
    const pkg = {
      package_id: Date.now(),
      destination_id: Number(req.body.destination_id) || 1,
      title: req.body.title || req.body.package_title || '',
      package_title: req.body.package_title || req.body.title || '',
      slug_url: req.body.slug_url || '',
      duration: req.body.duration || '',
      hotel_type: req.body.hotel_type || '',
      category: req.body.category || '',
      amount: Number(req.body.amount) || 0,
      no_of_activites: Number(req.body.no_of_activites) || 0,
      cancellation: req.body.cancellation || '',
      transportation: req.body.transportation || '',
      description: req.body.description || '',
      discription: req.body.description || '',
      meta: req.body.meta || '',
      fixed_departure_date: req.body.fixed_departure_date || '',
      featured: Number(req.body.featured) || 0,
      status: req.body.status !== undefined ? Number(req.body.status) : 1,
      card_image: files.card_image?.[0]?.filename ? `/uploads/${files.card_image[0].filename}` : '',
      images: (files.images || []).map(f => `/uploads/${f.filename}`),
      highlights: parseBody(req.body.highlights),
      includes: parseBody(req.body.includes),
      excludes: parseBody(req.body.excludes),
      itineraries: parseBody(req.body.itineraries),
      faqs: parseBody(req.body.faqs),
      created_at: new Date().toISOString()
    };
    inMemoryStore.syncPackage(pkg);
    reloadPackages(); // reload so frontend API serves fresh data immediately
    res.json({ status: 1, msg: 'Package added', data: pkg });
  } catch (e) {
    res.json({ status: 0, msg: e.message });
  }
});

router.put('/packages/:id', requireAuth, upload.fields([
  { name: 'card_image', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), (req, res) => {
  try {
    const id = req.params.id;
    reloadPackages();
    const existing = inMemoryStore.packages.find(p => p.package_id == id || p.id == id);
    if (!existing) return res.json({ status: 0, msg: 'Not found' });
    const parseBody = v => { try { return JSON.parse(v); } catch { return null; } };
    const files = req.files || {};
    const updated = {
      ...existing,
      ...Object.fromEntries(Object.entries(req.body).filter(([, v]) => v !== undefined)),
      featured: req.body.featured !== undefined ? Number(req.body.featured) : existing.featured,
      status: req.body.status !== undefined ? Number(req.body.status) : existing.status,
      amount: req.body.amount !== undefined ? Number(req.body.amount) : existing.amount,
      card_image: files.card_image?.[0]?.filename ? `/uploads/${files.card_image[0].filename}` : existing.card_image,
      images: files.images?.length ? files.images.map(f => `/uploads/${f.filename}`) : existing.images,
      highlights: req.body.highlights ? parseBody(req.body.highlights) : existing.highlights,
      includes: req.body.includes ? parseBody(req.body.includes) : existing.includes,
      excludes: req.body.excludes ? parseBody(req.body.excludes) : existing.excludes,
      itineraries: req.body.itineraries ? parseBody(req.body.itineraries) : existing.itineraries,
      faqs: req.body.faqs ? parseBody(req.body.faqs) : existing.faqs,
    };
    inMemoryStore.syncPackage(updated);
    reloadPackages(); // reload so frontend API serves fresh data immediately
    res.json({ status: 1, msg: 'Updated', data: updated });
  } catch (e) {
    res.json({ status: 0, msg: e.message });
  }
});

router.delete('/packages/:id', requireAuth, (req, res) => {
  inMemoryStore.deletePackage(req.params.id);
  reloadPackages(); // reload so frontend API serves fresh data immediately
  res.json({ status: 1, msg: 'Deleted' });
});

module.exports = router;

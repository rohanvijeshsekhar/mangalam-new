/**
 * server.js — Mangalam Travel & Tours Admin Backend
 * Node.js + Express + SQLite
 * Port: 4000
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Handle preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files ────────────────────────────────────────────────────────────
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── API Routes ──────────────────────────────────────────────────────────────
const { router: authRouter } = require('./routes/auth');
app.use('/api/auth',         authRouter);
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/packages',     require('./routes/packages'));
app.use('/api/tickets',      require('./routes/tickets'));
app.use('/api/blogs',        require('./routes/blogs'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/partners',     require('./routes/partners'));
app.use('/api/upload',       require('./routes/upload'));

// ── Stats endpoint for dashboard ───────────────────────────────────────────
const store = require('./db/store');
app.get('/api/stats', (req, res) => {
  res.json({
    destinations: store.count('destinations'),
    packages:     store.count('packages'),
    tickets:      store.count('tickets'),
    blogs:        store.count('blogs'),
    testimonials: store.count('testimonials'),
    partners:     store.count('partners'),
  });
});

// ── Redirect root → admin ───────────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/admin'));

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Mangalam Admin Backend running at http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`🔗 API Base:    http://localhost:${PORT}/api\n`);
});

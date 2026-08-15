/**
 * server.js — Mangalam Travel & Tours Admin Backend
 * Node.js + Express + Hostinger MySQL
 * Port: 4000
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { testConnection } = require('./db/mysql');
const { runMigrations } = require('./db/migrate');
const store = require('./db/store');

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

// Disable caching for dynamic assets
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// ── API Routes ──────────────────────────────────────────────────────────────
const { router: authRouter } = require('./routes/auth');
app.use('/api/auth',         authRouter);
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/packages',     require('./routes/packages'));
app.use('/api/attractions',  require('./routes/attractions'));
app.use('/api/tickets',      require('./routes/tickets'));
app.use('/api/blogs',        require('./routes/blogs'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/partners',     require('./routes/partners'));
app.use('/api/posters',      require('./routes/posters'));
app.use('/api/banners',      require('./routes/posters'));
const enquiriesRouter = require('./routes/enquiries');
app.use('/api/enquiries',    enquiriesRouter);
app.use('/api/enquiry',      enquiriesRouter);
app.use('/api/collections',  require('./routes/collections'));
app.use('/api/seo',          require('./routes/seo'));
app.use('/api/otp',          require('./routes/otp'));
app.use('/api/upload',       require('./routes/upload'));

// ── Action / Form Submission Fallback Handlers ────────────────────────────────
app.post(['/action/submitCareerEnquiry.html', '/action/submitCareerEnquiry'], enquiriesRouter.uploadResume.single('resume'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.resume_url = `/uploads/${req.file.filename}`;
      body.resume = req.file.originalname;
    }
    await enquiriesRouter.createEnquiryDoc(body, 'Career Application');
    res.redirect('/thankyou.html');
  } catch (e) {
    res.redirect('/thankyou.html');
  }
});

app.post(['/action/submitContactEnquiry.html', '/action/submitContactEnquiry'], async (req, res) => {
  try {
    await enquiriesRouter.createEnquiryDoc(req.body, 'Contact Message');
    res.redirect('/thankyou.html');
  } catch (e) {
    res.redirect('/thankyou.html');
  }
});

app.post(['/action/submitTripEnquiry.html', '/action/submitTripEnquiry'], async (req, res) => {
  try {
    await enquiriesRouter.createEnquiryDoc(req.body, 'Trip Enquiry');
    res.redirect('/thankyou.html');
  } catch (e) {
    res.redirect('/thankyou.html');
  }
});

// ── Static Files ────────────────────────────────────────────────────────────
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));
// Serve main website static files (HTML, CSS, JS, Assets)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '../public')));

// ── Stats endpoint for dashboard ───────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [
      destinations, packages, collections, attractions, tickets,
      blogs, testimonials, partners, posters, enquiries, seo
    ] = await Promise.all([
      store.count('destinations'), store.count('packages'), store.count('collections'),
      store.count('attractions'), store.count('tickets'), store.count('blogs'),
      store.count('testimonials'), store.count('partners'), store.count('posters'),
      store.count('enquiries'), store.count('seo')
    ]);
    res.json({ destinations, packages, collections, attractions, tickets, blogs, testimonials, partners, posters, enquiries, seo });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// ── Debug: Check environment config (non-sensitive) ────────────────────────
app.get('/api/debug/env', (req, res) => {
  res.json({
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
    cloudinary_api_key:    process.env.CLOUDINARY_API_KEY    ? '✅ set' : '❌ missing',
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing',
    db_host:               process.env.DB_HOST || '❌ missing',
    node_env:              process.env.NODE_ENV || 'not set',
  });
});


// ── Serve Main Website Homepage (index.html) ────────────────────────────────
app.get('/', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, '..', 'index.html'),
    path.join(__dirname, '../public', 'index.html'),
    path.join(__dirname, 'index.html')
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  res.status(404).send('index.html not found');
});

// ── Fallback HTML Page Router ────────────────────────────────────────────────
app.get('/:page.html', (req, res, next) => {
  const pageName = `${req.params.page}.html`;
  const possiblePaths = [
    path.join(__dirname, 'public', pageName),
    path.join(__dirname, '..', pageName),
    path.join(__dirname, '../public', pageName)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  next();
});

// ── Start Server & Initialize Database ──────────────────────────────────────
async function start() {
  await testConnection();
  await runMigrations();

  app.listen(PORT, () => {
    console.log(`\n🚀 Mangalam Admin Backend running at http://localhost:${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🔗 API Base:    http://localhost:${PORT}/api\n`);
  });
}

start().catch(err => {
  console.error('❌ Server startup failure:', err.message);
});

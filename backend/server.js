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

// Disable caching for HTML and dynamic assets to prevent stale browser cache
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
app.post(['/action/submitCareerEnquiry.html', '/action/submitCareerEnquiry'], enquiriesRouter.uploadResume.single('resume'), (req, res) => {
  const body = { ...req.body };
  if (req.file) {
    body.resume_url = `/uploads/${req.file.filename}`;
    body.resume = req.file.originalname;
  }
  enquiriesRouter.createEnquiryDoc(body, 'Career Application');
  res.redirect('/thankyou.html');
});

app.post(['/action/submitContactEnquiry.html', '/action/submitContactEnquiry'], (req, res) => {
  enquiriesRouter.createEnquiryDoc(req.body, 'Contact Message');
  res.redirect('/thankyou.html');
});

app.post(['/action/submitTripEnquiry.html', '/action/submitTripEnquiry'], (req, res) => {
  enquiriesRouter.createEnquiryDoc(req.body, 'Trip Enquiry');
  res.redirect('/thankyou.html');
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
const store = require('./db/store');
app.get('/api/stats', (req, res) => {
  res.json({
    destinations: store.count('destinations'),
    packages:     store.count('packages'),
    collections:  store.count('collections'),
    attractions:  store.count('attractions'),
    tickets:      store.count('tickets'),
    blogs:        store.count('blogs'),
    testimonials: store.count('testimonials'),
    partners:     store.count('partners'),
    posters:      store.count('posters'),
    enquiries:    store.count('enquiries'),
    seo:          store.count('seo'),
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


// ── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Mangalam Admin Backend running at http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`🔗 API Base:    http://localhost:${PORT}/api\n`);
});

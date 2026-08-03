const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Route modules
const apiRoutes   = require('./routes/api.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS headers ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') { res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); return res.status(200).json({}); }
  next();
});

// ─── REST APIs (/api/* and legacy /action/* compat) ─────────────────────────
app.use('/action',       apiRoutes);
app.use('/admin/action', adminRoutes);
app.use('/',             apiRoutes);   // exposes /api/* routes at root level

// ─── Static assets (images, css, js, uploads) ────────────────────────────────
const projectRoot  = path.join(__dirname, '../..');
const uploadsPath  = path.join(__dirname, '../uploads');
const adminPath    = path.join(projectRoot, 'admin');

app.use('/uploads',       express.static(uploadsPath));
app.use('/assets',        express.static(path.join(projectRoot, 'assets')));
app.use('/js',            express.static(path.join(projectRoot, 'js')));
app.use('/css',           express.static(path.join(projectRoot, 'css')));
app.use('/public',        express.static(path.join(projectRoot, 'public')));

// Admin uploads compat paths
const uploadsAlias = [
  '/admin/files/destinations/uploads', '/admin/files/packages/uploads',
  '/admin/files/activities/uploads',   '/admin/files/tickets/uploads',
  '/admin/files/place/uploads',        '/admin/files/blog/uploads',
  '/admin/files/testimonials/uploads', '/admin/files/uploads',
];
uploadsAlias.forEach(p => app.use(p, express.static(uploadsPath)));

const adminFilesPath = path.join(adminPath, 'files');
const adminAssetFallbacks = [
  express.static(path.join(projectRoot, 'assets/images')),
  express.static(path.join(projectRoot, 'assets/icons')),
  express.static(adminFilesPath),
  express.static(path.join(projectRoot, 'assets')),
  express.static(uploadsPath),
];
const adminSubPaths = [
  '/admin/files/destinations', '/admin/files/packages', '/admin/files/activities',
  '/admin/files/tickets',      '/admin/files/place',    '/admin/files/posters',
  '/admin/files/partners',     '/admin/files/blog',     '/admin/files/testimonials',
  '/admin/files',              '/admin/uploads',
];
adminSubPaths.forEach(p => adminAssetFallbacks.forEach(mw => app.use(p, mw)));

// ─── Serve admin panel (JS SPA under /admin/) ────────────────────────────────
app.use('/admin', express.static(adminPath));

// ─── Serve public/ static HTML site ──────────────────────────────────────────
const publicPath = path.join(projectRoot, 'public');
app.use(express.static(publicPath));  // index.html served at /

// ─── URL -> HTML page mapping (clean URLs & legacy PHP URLs) ────────────────
const htmlPages = {
  '/about':                    'about.html',
  '/packages':                 'packages.html',
  '/package-details':          'package-details.html',
  '/tickets':                  'tickets.html',
  '/ticket-details':           'ticket-details.html',
  '/activity-details':         'activity-details.html',
  '/blog':                     'blog.html',
  '/blog-details':             'blog-details.html',
  '/contact':                  'contact.html',
  '/career':                   'career.html',
  '/cart':                     'cart.html',
  '/thankyou':                 'thankyou.html',
  '/privacy-policy':           'privacy-policy.html',
  '/terms-and-conditions':     'terms-and-conditions.html',
  '/attraction':               'attraction.html',
  '/holiday-package':          'holiday-package.html',
  '/flight-tickets':           'flight-tickets.html',
  '/global-visa-services':     'global-visa-services.html',
  '/travel-insurance':         'travel-insurance.html',
  '/miscellaneous':            'miscellaneous.html',
  '/mice-tourism':             'mice-tourism.html',
  '/cruises':                  'cruises.html',
  '/honeymoon-packages':       'honeymoon-packages.html',
  '/fixed-departures':         'fixed-departures.html',
  '/fixed-departure-details':  'fixed-departure-details.html',
  '/curated-itineraries':      'curated-itineraries.html',
  // Legacy PHP URLs -> static HTML
  '/about.php':                'about.html',
  '/contact.php':              'contact.html',
  '/career.php':               'career.html',
  '/cart.php':                 'cart.html',
  '/package.php':              'packages.html',
  '/attraction.php':           'attraction.html',
  '/blog.php':                 'blog.html',
  '/blog-details.php':         'blog-details.html',
  '/holiday-package.php':      'holiday-package.html',
  '/flight-tickets.php':       'flight-tickets.html',
  '/global-visa-services.php': 'global-visa-services.html',
  '/travel-insurance.php':     'travel-insurance.html',
  '/miscellaneous.php':        'miscellaneous.html',
  '/mice-tourism.php':         'mice-tourism.html',
  '/cruises.php':              'cruises.html',
  '/honeymoon-packages.php':   'honeymoon-packages.html',
  '/fixed-departures.php':     'fixed-departures.html',
  '/thankyou.php':             'thankyou.html',
  '/privacy-policy.php':       'privacy-policy.html',
  '/terms-and-conditions.php': 'terms-and-conditions.html',
  '/tickets.php':              'tickets.html',
  '/tickets-details.php':      'ticket-details.html',
  '/package-details.php':      'package-details.html',
  '/activity-details.php':     'activity-details.html',
};

Object.entries(htmlPages).forEach(([route, file]) => {
  app.get(route, (req, res) => res.sendFile(path.join(publicPath, file), err => {
    if (err) res.sendFile(path.join(publicPath, 'index.html'));
  }));
});

// ─── Root -> index.html ────────────────────────────────────────────────────────
app.get(['/', '/index', '/index.php'], (req, res) =>
  res.sendFile(path.join(publicPath, 'index.html'))
);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[App Error]', err.stack || err.message || err);
  if (req.path.startsWith('/api/') || req.path.startsWith('/action/') || req.path.startsWith('/admin/action/')) {
    return res.status(200).json([{ status: 0, msg: err.message || 'An error occurred during process' }]);
  }
  res.status(500).send('Internal Server Error');
});

// ─── 404 -> index.html fallback ──────────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/action/') || req.path.startsWith('/admin/action/')) {
    return res.status(404).json([{ status: 0, msg: 'Endpoint not found' }]);
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

module.exports = app;

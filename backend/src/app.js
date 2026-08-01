const express = require('express');
const cors = require('cors');
const path = require('path');

const pagesRoutes = require('./routes/pages.routes');
const apiRoutes = require('./routes/api.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// View Engine Setup (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers for legacy API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

// ─────────────────────────────────────────────
// API & ADMIN ROUTING
// ─────────────────────────────────────────────
app.use('/action', apiRoutes);
app.use('/admin/action', adminRoutes);

// ─────────────────────────────────────────────
// STATIC ASSET ROUTING (Registered BEFORE Page Routes)
// ─────────────────────────────────────────────
const imagesPath = path.join(__dirname, '../../assets/images');
const iconsPath = path.join(__dirname, '../../assets/icons');
const assetsPath = path.join(__dirname, '../../assets');
const jsPath = path.join(__dirname, '../../js');
const uploadsPath = path.join(__dirname, '../uploads');
const adminFilesPath = path.join(__dirname, '../../admin/files');
const adminPath = path.join(__dirname, '../../admin');

app.use('/uploads', express.static(uploadsPath));
app.use('/assets/images', express.static(imagesPath));
app.use('/assets/icons', express.static(iconsPath));
app.use('/assets', express.static(assetsPath));
app.use('/js', express.static(jsPath));

// Uploads subpath static routing
app.use('/admin/files/destinations/uploads', express.static(uploadsPath));
app.use('/admin/files/packages/uploads', express.static(uploadsPath));
app.use('/admin/files/activities/uploads', express.static(uploadsPath));
app.use('/admin/files/tickets/uploads', express.static(uploadsPath));
app.use('/admin/files/place/uploads', express.static(uploadsPath));
app.use('/admin/files/blog/uploads', express.static(uploadsPath));
app.use('/admin/files/testimonials/uploads', express.static(uploadsPath));
app.use('/admin/files/uploads', express.static(uploadsPath));

// Unified static asset fallbacks for all admin files subpaths
const staticAssetFallbacks = [
  express.static(imagesPath),
  express.static(iconsPath),
  express.static(adminFilesPath),
  express.static(assetsPath),
  express.static(uploadsPath)
];

const registerAssetFallbacks = (routePath) => {
  staticAssetFallbacks.forEach(middleware => app.use(routePath, middleware));
};

registerAssetFallbacks('/admin/files/destinations');
registerAssetFallbacks('/admin/files/packages');
registerAssetFallbacks('/admin/files/activities');
registerAssetFallbacks('/admin/files/tickets');
registerAssetFallbacks('/admin/files/place');
registerAssetFallbacks('/admin/files/posters');
registerAssetFallbacks('/admin/files/partners');
registerAssetFallbacks('/admin/files/blog');
registerAssetFallbacks('/admin/files/testimonials');
registerAssetFallbacks('/admin/files');
registerAssetFallbacks('/admin/uploads');
app.use('/admin', express.static(adminPath));

// ─────────────────────────────────────────────
// PAGE ROUTING (Legacy PHP URLs -> Rendered Views)
// ─────────────────────────────────────────────
app.use('/', pagesRoutes);

// 404 Handler
app.use((req, res) => {
  return res.status(404).render('thankyou', {
    pageTitle: 'Page Not Found',
    message: 'The requested page could not be found.',
    destinations: [],
    tickets: [],
    activities: [],
    blogs: [],
    testimonials: [],
    posters: [],
    partners: [],
    latestNotice: '',
    req
  });
});

module.exports = app;

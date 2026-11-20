/**
 * server.js — Mangalam Travel & Tours Admin Backend
 * Node.js + Express + Hostinger MySQL
 * Port: 4000
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const zlib = require('zlib');
const { testConnection } = require('./db/mysql');
const { runMigrations } = require('./db/migrate');
const store = require('./db/store');

const app = express();
const PORT = process.env.PORT || 4000;

// Built-in HTTP compression (Brotli / Gzip) for text assets & API JSON
function compressionMiddleware(req, res, next) {
  if (req.method === 'HEAD' || req.headers.range) return next();
  const accept = String(req.headers['accept-encoding'] || '');
  const useBr = /\bbr\b/i.test(accept);
  const useGzip = !useBr && /\bgzip\b/i.test(accept);
  if (!useBr && !useGzip) return next();

  const origWrite = res.write.bind(res);
  const origEnd = res.end.bind(res);
  let encoder = null;
  let decided = false;

  const isCompressible = () => {
    if (res.headersSent || res.getHeader('Content-Encoding')) return false;
    if (res.statusCode === 204 || res.statusCode === 304) return false;
    const ct = String(res.getHeader('Content-Type') || '');
    return /^(?:text\/|application\/(?:javascript|json|xml|ld\+json)|image\/svg\+xml)/i.test(ct);
  };

  const initEncoder = () => {
    decided = true;
    if (!isCompressible()) return false;
    const enc = useBr ? 'br' : 'gzip';
    res.setHeader('Content-Encoding', enc);
    res.setHeader('Vary', 'Accept-Encoding');
    res.removeHeader('Content-Length');
    encoder = useBr
      ? zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } })
      : zlib.createGzip({ level: 6 });
    encoder.on('data', (chunk) => origWrite(chunk));
    encoder.on('drain', () => res.emit('drain'));
    encoder.on('end', () => origEnd());
    return true;
  };

  res.write = (chunk, encoding, cb) => {
    if (!decided) initEncoder();
    if (encoder) return encoder.write(chunk, encoding, cb);
    return origWrite(chunk, encoding, cb);
  };

  res.end = (chunk, encoding, cb) => {
    if (!decided) {
      if (chunk && Buffer.byteLength(chunk, encoding) < 1024) {
        decided = true;
        return origEnd(chunk, encoding, cb);
      }
      initEncoder();
    }
    if (encoder) {
      if (typeof chunk === 'function') {
        cb = chunk;
        chunk = null;
      }
      if (chunk) encoder.write(chunk, encoding);
      if (cb) encoder.once('end', cb);
      encoder.end();
      return res;
    }
    return origEnd(chunk, encoding, cb);
  };

  next();
}

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(compressionMiddleware);
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // Handle preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable caching ONLY for dynamic API and admin routes
app.use(['/api', '/admin'], (req, res, next) => {
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
app.use('/api/gallery',      require('./routes/gallery'));
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
// Serve uploaded images — check both backend/uploads AND root-level uploads
// (root uploads may exist on Hostinger from legacy or direct File Manager uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── Dynamic SEO & HTML Page Serving ──────────────────────────────────────────
const { findSeoMatch, injectSeoIntoHtml, warmSeoCache } = require('./routes/seo');

// 1. Homepage Router with dynamic SEO injection from database
app.get(['/', '/index.html', '/index.php'], async (req, res) => {
  const possiblePaths = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, '..', 'index.html'),
    path.join(__dirname, '../public', 'index.html'),
    path.join(__dirname, 'index.html')
  ];
  let filePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }
  if (!filePath) {
    return res.status(404).send('index.html not found');
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const seo = await findSeoMatch('/');
    if (seo && seo.status === 'Active' && (seo.meta_title || seo.meta_description || seo.og_image)) {
      content = injectSeoIntoHtml(content, seo);
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(content);
  } catch (err) {
    console.warn('[Server] Error rendering dynamic homepage SEO:', err.message);
    return res.sendFile(filePath);
  }
});

// ── Old Hacked Spam URLs – Permanently Removed (HTTP 410 Gone) ────────────────
const SPAM_URL_PATTERN = /^\/(?:products|category|shop|toyu|hg|reserve|contents)(?:\/.*)?$/i;
app.all(SPAM_URL_PATTERN, (req, res) => {
  res.status(410).type('text/html; charset=utf-8').send(
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>410 Gone</title></head>' +
    '<body><h1>410 Gone</h1><p>The requested resource has been permanently removed.</p></body></html>'
  );
});
app.all(/^\/search(?:\/.*)?$/i, (req, res) => {
  res.status(410).type('text/html; charset=utf-8').send(
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>410 Gone</title></head>' +
    '<body><h1>410 Gone</h1><p>The requested resource has been permanently removed.</p></body></html>'
  );
});

// ── Genuine Legacy Pages – Permanent 301 Redirects ────────────────────────────
app.get('/tickets.php', (req, res) => {
  res.redirect(301, '/flight-tickets.html');
});
app.get('/attraction.php', (req, res) => {
  res.redirect(301, '/attraction.html');
});
app.get('/global-visa-services.php', (req, res) => {
  res.redirect(301, '/global-visa-services.html');
});
app.get('/package.php', (req, res) => {
  // Query string discarded per SEO specification
  res.redirect(301, '/holiday-package.html');
});
app.get('/packages', (req, res) => {
  res.redirect(301, '/holiday-package.html');
});
app.get(['/our-teams', '/our-teams/'], (req, res) => {
  res.redirect(301, '/about.html');
});

// Landing page clean slug redirect to canonical .html
app.get('/best-travel-agency-trivandrum', (req, res) => {
  res.redirect(301, '/best-travel-agency-trivandrum.html');
});

// 2. HTML Page Router with dynamic SEO injection from database
app.get('/:page.html', async (req, res, next) => {
  const pageName = `${req.params.page}.html`;
  const possiblePaths = [
    path.join(__dirname, 'public', pageName),
    path.join(__dirname, '..', pageName),
    path.join(__dirname, '../public', pageName)
  ];
  let filePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }
  if (!filePath) {
    return next();
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const fullRoute = req.originalUrl || `/${pageName}`;
    const seo = await findSeoMatch(fullRoute);
    if (seo && seo.status === 'Active' && (seo.meta_title || seo.meta_description || seo.og_image)) {
      content = injectSeoIntoHtml(content, seo);
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(content);
  } catch (err) {
    console.warn(`[Server] Error rendering dynamic SEO for ${pageName}:`, err.message);
    return res.sendFile(filePath);
  }
});

// Serve main website static files (CSS, JS, Assets) — index: false ensures HTML routes above take priority
const staticOpts = {
  index: false,
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (/\.(webp|avif|png|jpe?g|gif|svg|woff2|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    } else if (/\.css$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    } else if (/\.js$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  }
};
app.use(express.static(path.join(__dirname, 'public'), staticOpts));
app.use(express.static(path.join(__dirname, '..'), staticOpts));
app.use(express.static(path.join(__dirname, '../public'), staticOpts));

// ── Stats endpoint for dashboard ───────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [
      destinations, packages, collections, attractions, tickets,
      blogs, testimonials, partners, posters, gallery, enquiries, seo
    ] = await Promise.all([
      store.count('destinations'), store.count('packages'), store.count('collections'),
      store.count('attractions'), store.count('tickets'), store.count('blogs'),
      store.count('testimonials'), store.count('partners'), store.count('posters'),
      store.count('gallery'), store.count('enquiries'), store.count('seo')
    ]);
    res.json({ destinations, packages, collections, attractions, tickets, blogs, testimonials, partners, posters, gallery, enquiries, seo });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// ── Debug: Check environment config (non-sensitive) ────────────────────────
app.get('/api/debug/env', async (req, res) => {
  let db_status = 'testing';
  let db_error = null;
  try {
    const { pool } = require('./db/mysql');
    const conn = await pool.getConnection();
    await conn.query('SELECT 1');
    conn.release();
    db_status = '✅ connected';
  } catch (err) {
    db_status = '❌ failed';
    db_error = err.message;
  }

  res.json({
    db_status,
    db_error,
    db_host:               process.env.DB_HOST || 'auth-db2210.hstgr.io (fallback)',
    db_name:               process.env.DB_NAME || 'u614850386_mangalam (fallback)',
    db_user:               process.env.DB_USER || 'u614850386_mangalam123 (fallback)',
    db_pass_configured:    Boolean(process.env.DB_PASSWORD),
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
    cloudinary_api_key:    process.env.CLOUDINARY_API_KEY    ? '✅ set' : '❌ missing',
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing',
    node_env:              process.env.NODE_ENV || 'not set',
  });
});


// ── Start Server & Initialize Database ──────────────────────────────────────
async function start() {
  await testConnection();

  // Set SKIP_MIGRATIONS=true in Hostinger Node.js environment variables to bypass
  // schema checks if you want zero write activity at boot. Default is to run checks.
  if (process.env.SKIP_MIGRATIONS !== 'true') {
    await runMigrations();
  } else {
    console.log('⏭️  Skipping migrations (SKIP_MIGRATIONS=true)');
  }

  app.listen(PORT, () => {
    warmSeoCache().catch(() => {});
    console.log(`\n🚀 Mangalam Admin Backend running at http://localhost:${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🔗 API Base:    http://localhost:${PORT}/api\n`);
  });
}

start().catch(err => {
  console.error('❌ Server startup failure:', err.message);
});

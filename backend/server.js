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
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

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
app.get(['/our-teams', '/our-teams/'], (req, res) => {
  res.redirect(301, '/about.html');
});

// Landing page clean slug redirect to canonical .html
app.get('/best-travel-agency-trivandrum', (req, res) => {
  res.redirect(301, '/best-travel-agency-trivandrum.html');
});

// ── Clean SEO-Friendly URL Routing & Permanent Redirects ───────────────────
const dynamicRouteConfig = [
  { prefix: '/package-details', page: 'package-details.html', entity: 'packages', label: 'Package' },
  { prefix: '/packages', page: 'packages.html', entity: 'destinations', label: 'Destination' },
  { prefix: '/attraction-details', page: 'attraction-details.html', entity: 'attractions', label: 'Attraction' },
  { prefix: '/activity-details', page: 'activity-details.html', entity: 'activities', label: 'Activity' },
  { prefix: '/ticket-details', page: 'ticket-details.html', entity: 'tickets', label: 'Ticket' },
  { prefix: '/blog-details', page: 'blog-details.html', entity: 'blogs', label: 'Blog' },
  { prefix: '/fixed-departure-details', page: 'fixed-departure-details.html', entity: 'packages', label: 'Fixed Departure' }
];

// Helper to find HTML file across public directories
function findHtmlFile(pageName) {
  const possiblePaths = [
    path.join(__dirname, 'public', pageName),
    path.join(__dirname, '..', pageName),
    path.join(__dirname, '../public', pageName)
  ];
  return possiblePaths.find(p => fs.existsSync(p)) || null;
}

// 2. HTML Page Router: Permanent 301 Redirects for Old Query URLs + Dynamic SEO Injection
app.get('/:page.html', async (req, res, next) => {
  const pageBase = req.params.page;
  const pageName = `${pageBase}.html`;

  // ── Permanent 301 Redirect for Legacy ?slug= and ?id= Queries ─────────────
  const matchedRoute = dynamicRouteConfig.find(r => r.page === pageName);
  if (matchedRoute && (req.query.slug || req.query.id || req.query.package_id)) {
    const slugVal = String(req.query.slug || req.query.id || req.query.package_id).trim();
    if (slugVal) {
      // Preserve other tracking parameters (e.g. utm_source), strip old slug/id
      const remainingParams = new URLSearchParams();
      for (const [k, v] of Object.entries(req.query)) {
        if (k !== 'slug' && k !== 'id' && k !== 'package_id') {
          remainingParams.append(k, v);
        }
      }
      const qs = remainingParams.toString();
      const redirectUrl = `${matchedRoute.prefix}/${encodeURIComponent(slugVal)}${qs ? '?' + qs : ''}`;
      return res.redirect(301, redirectUrl);
    }
  }

  const filePath = findHtmlFile(pageName);
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
    return res.send(content);
  } catch (err) {
    console.warn(`[Server] Error rendering dynamic SEO for ${pageName}:`, err.message);
    return res.sendFile(filePath);
  }
});

// ── Clean Dynamic Route Handlers (App Router Style URL Paths) ───────────────
for (const route of dynamicRouteConfig) {
  app.get(`${route.prefix}/:slug`, async (req, res, next) => {
    const rawSlug = req.params.slug;
    if (!rawSlug) return next();

    const cleanSlug = decodeURIComponent(rawSlug).trim();
    const filePath = findHtmlFile(route.page);
    if (!filePath) return next();

    try {
      // Validate existence against data store if records exist
      let item = null;
      try {
        const allItems = await store.getAll(route.entity);
        if (Array.isArray(allItems) && allItems.length > 0) {
          const lower = cleanSlug.toLowerCase();
          item = allItems.find(i => 
            String(i.slug_url || i.slug || '').toLowerCase() === lower ||
            String(i.id || i.package_id || i.ticket_id || i.blog_id || i.attraction_id || i.destination_id || '') === cleanSlug ||
            String(i.package_name || i.destination_name || i.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === lower
          );

          // If store has records but no matching slug is found, return proper 404 page
          if (!item && allItems.length > 0) {
            const notFoundPath = findHtmlFile('404.html');
            if (notFoundPath) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              return res.status(404).sendFile(notFoundPath);
            }
            return res.status(404).send(`<h1>404 — ${route.label} Not Found</h1><p>The requested ${route.label.toLowerCase()} slug does not exist.</p>`);
          }
        }
      } catch (dbErr) {
        // Continue if offline or table uninitialized
      }

      let content = fs.readFileSync(filePath, 'utf8');

      // Canonical URL must be clean self-referencing URL
      const canonicalUrl = `https://mangalamtravel.com${route.prefix}/${encodeURIComponent(cleanSlug)}`;

      // Check if admin defined explicit SEO match for this clean route
      const cleanPath = `${route.prefix}/${cleanSlug}`;
      const customSeo = await findSeoMatch(cleanPath);

      if (customSeo && customSeo.status === 'Active') {
        const seoToInject = { ...customSeo, canonical_url: canonicalUrl };
        content = injectSeoIntoHtml(content, seoToInject);
      } else {
        // Build dynamic metadata from item properties
        const itemTitle = item ? (item.package_name || item.destination_name || item.title || item.name || cleanSlug) : cleanSlug;
        const itemDesc = item ? (item.meta_description || item.description || item.overview || `Explore ${itemTitle} with Mangalam Travel & Tours.`).replace(/<[^>]*>?/gm, '').slice(0, 160) : `Explore ${itemTitle} with Mangalam Travel & Tours.`;
        const itemImg = item ? (item.card_image || item.inner_image || item.image || '/assets/images/logo-color.png') : '/assets/images/logo-color.png';

        content = injectSeoIntoHtml(content, {
          meta_title: `${itemTitle} — Mangalam Travel & Tours`,
          meta_description: itemDesc,
          canonical_url: canonicalUrl,
          og_image: itemImg
        });
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(content);
    } catch (err) {
      console.warn(`[Server] Error rendering clean route ${route.prefix}/${cleanSlug}:`, err.message);
      return res.sendFile(filePath);
    }
  });
}


// 2. HTML Page Router: Permanent 301 Redirects for Old Query URLs + Dynamic SEO Injection
app.get('/:page.html', async (req, res, next) => {
  const pageBase = req.params.page;
  const pageName = `${pageBase}.html`;

  // ── Permanent 301 Redirect for Legacy ?slug= and ?id= Queries ─────────────
  const matchedRoute = dynamicRouteConfig.find(r => r.page === pageName);
  if (matchedRoute && (req.query.slug || req.query.id || req.query.package_id)) {
    const slugVal = String(req.query.slug || req.query.id || req.query.package_id).trim();
    if (slugVal) {
      // Preserve other tracking parameters (e.g. utm_source), strip old slug/id
      const remainingParams = new URLSearchParams();
      for (const [k, v] of Object.entries(req.query)) {
        if (k !== 'slug' && k !== 'id' && k !== 'package_id') {
          remainingParams.append(k, v);
        }
      }
      const qs = remainingParams.toString();
      const redirectUrl = `${matchedRoute.prefix}/${encodeURIComponent(slugVal)}${qs ? '?' + qs : ''}`;
      return res.redirect(301, redirectUrl);
    }
  }

  const filePath = findHtmlFile(pageName);
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

// ── Clean Dynamic Route Handlers (App Router Style URL Paths) ───────────────
for (const route of dynamicRouteConfig) {
  app.get(`${route.prefix}/:slug`, async (req, res, next) => {
    const rawSlug = req.params.slug;
    if (!rawSlug) return next();

    const cleanSlug = decodeURIComponent(rawSlug).trim();
    const filePath = findHtmlFile(route.page);
    if (!filePath) return next();

    try {
      // Validate existence against data store if records exist
      let item = null;
      try {
        const allItems = await store.getAll(route.entity);
        if (Array.isArray(allItems) && allItems.length > 0) {
          const lower = cleanSlug.toLowerCase();
          item = allItems.find(i => 
            String(i.slug_url || i.slug || '').toLowerCase() === lower ||
            String(i.id || i.package_id || i.ticket_id || i.blog_id || i.attraction_id || i.destination_id || '') === cleanSlug ||
            String(i.package_name || i.destination_name || i.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === lower
          );

          // If store has records but no matching slug is found, return proper 404 page
          if (!item && allItems.length > 0) {
            const notFoundPath = findHtmlFile('404.html');
            if (notFoundPath) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              return res.status(404).sendFile(notFoundPath);
            }
            return res.status(404).send(`<h1>404 — ${route.label} Not Found</h1><p>The requested ${route.label.toLowerCase()} slug does not exist.</p>`);
          }
        }
      } catch (dbErr) {
        // Continue if offline or table uninitialized
      }

      let content = fs.readFileSync(filePath, 'utf8');

      // Canonical URL must be clean self-referencing URL
      const canonicalUrl = `https://mangalamtravel.com${route.prefix}/${encodeURIComponent(cleanSlug)}`;

      // Check if admin defined explicit SEO match for this clean route
      const cleanPath = `${route.prefix}/${cleanSlug}`;
      const customSeo = await findSeoMatch(cleanPath);

      if (customSeo && customSeo.status === 'Active') {
        const seoToInject = { ...customSeo, canonical_url: canonicalUrl };
        content = injectSeoIntoHtml(content, seoToInject);
      } else {
        // Build dynamic metadata from item properties
        const itemTitle = item ? (item.package_name || item.destination_name || item.title || item.name || cleanSlug) : cleanSlug;
        const itemDesc = item ? (item.meta_description || item.description || item.overview || `Explore ${itemTitle} with Mangalam Travel & Tours.`).replace(/<[^>]*>?/gm, '').slice(0, 160) : `Explore ${itemTitle} with Mangalam Travel & Tours.`;
        const itemImg = item ? (item.card_image || item.inner_image || item.image || '/assets/images/logo-color.png') : '/assets/images/logo-color.png';

        content = injectSeoIntoHtml(content, {
          meta_title: `${itemTitle} — Mangalam Travel & Tours`,
          meta_description: itemDesc,
          canonical_url: canonicalUrl,
          og_image: itemImg
        });
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(content);
    } catch (err) {
      console.warn(`[Server] Error rendering clean route ${route.prefix}/${cleanSlug}:`, err.message);
      return res.sendFile(filePath);
    }
  });
}

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

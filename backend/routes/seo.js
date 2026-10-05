const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const map = s => ({
  id:               s.id,
  page_route:       s.page_route || '/',
  page_name:        s.page_name || 'Home Page',
  meta_title:       s.meta_title || '',
  meta_description: s.meta_description || '',
  meta_keywords:    s.meta_keywords || '',
  canonical_url:    s.canonical_url || '',
  og_image:         s.og_image || '',
  robots:           s.robots || 'index, follow',
  status:           s.status || 'Active',
  created_at:       s.created_at || new Date().toISOString()
});

// GET all SEO configs (Admin)
router.get('/', async (req, res) => {
  try {
    const all = await store.getAll('seo');
    res.json(all.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch SEO configs' });
  }
});

const fs = require('fs');
const path = require('path');

function toAbsoluteUrl(urlStr) {
  if (!urlStr) return '';
  const trimmed = urlStr.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const clean = trimmed.replace(/^\.?\//, '');
  return `https://mangalamtravel.com/${clean}`;
}

function normalizePageRoute(routeStr) {
  if (!routeStr) return '/';
  let r = routeStr.trim();
  try {
    const withoutSlash = r.replace(/^\/+/, '');
    if (withoutSlash.startsWith('http://') || withoutSlash.startsWith('https://')) {
      const u = new URL(withoutSlash);
      r = (u.pathname || '/') + (u.search || '');
    }
  } catch (_) {
    r = r.replace(/^\/?https?:\/\/[^\/]+/, '');
  }
  if (!r.startsWith('/')) r = `/${r}`;
  const lower = r.toLowerCase();
  if (lower === '' || lower === '/' || lower === '/index.html' || lower === '/index.php' || lower === '/home') {
    return '/';
  }
  return r;
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function findSeoMatch(rawRoute) {
  try {
    const normalizedRoute = normalizePageRoute(rawRoute).toLowerCase();
    const all = (await store.getAll('seo')).map(map);

    // 1. Exact match with normalized routes
    let matched = all.find(s => normalizePageRoute(s.page_route).toLowerCase() === normalizedRoute);

    // 2. Query param matching (e.g. /packages.html?slug=dubai or /packages.html?slug=dubai&type=package)
    if (!matched && normalizedRoute.includes('?')) {
      const [pathPart, queryPart] = normalizedRoute.split('?');
      const qParams = new URLSearchParams(queryPart);
      const slug = qParams.get('slug');
      if (slug) {
        const cleanSlug = slug.toLowerCase().trim();
        matched = all.find(s => {
          const sNorm = normalizePageRoute(s.page_route).toLowerCase();
          if (!sNorm.includes('?')) return false;
          const [sPart, sQuery] = sNorm.split('?');
          const sParams = new URLSearchParams(sQuery);
          const sSlug = sParams.get('slug');
          if (sSlug && sSlug.toLowerCase().trim() === cleanSlug) {
            return true;
          }
          return sNorm === `${pathPart}?slug=${cleanSlug}`;
        });
      }
    }

    // 3. Match root / homepage
    if (!matched && normalizedRoute === '/') {
      matched = all.find(s => {
        const r = normalizePageRoute(s.page_route).toLowerCase();
        return r === '/' || (s.page_name && s.page_name.toLowerCase().includes('home page'));
      });
    }

    // 4. Base html extension match (only match static pages WITHOUT query parameters)
    if (!matched) {
      const base = normalizedRoute.split('?')[0].replace(/\.html$/i, '');
      matched = all.find(s => {
        const sNorm = normalizePageRoute(s.page_route).toLowerCase();
        if (sNorm.includes('?')) return false;
        return sNorm.split('?')[0].replace(/\.html$/i, '') === base;
      });
    }

    return matched || null;
  } catch (err) {
    console.warn('[SEO] findSeoMatch error:', err);
    return null;
  }
}

function injectSeoIntoHtml(html, entry) {
  if (!html || !entry) return html;
  let content = html;

  const isHome = entry.page_route === '/' || entry.page_route === '/index.html' || entry.page_route === 'index.html' || entry.page_route === '' || entry.page_route === 'home';
  const title = (entry.meta_title || '').trim();
  const desc = (entry.meta_description || '').trim();
  const keywords = (entry.meta_keywords || '').trim();
  const canonical = entry.canonical_url ? toAbsoluteUrl(entry.canonical_url) : (isHome ? 'https://mangalamtravel.com/' : '');
  const ogImg = entry.og_image ? toAbsoluteUrl(entry.og_image) : (isHome ? 'https://mangalamtravel.com/assets/images/home-hero-desktop.jpg' : '');
  const robots = (entry.robots || 'index, follow').trim();

  // Title
  if (title) {
    if (/<title>[\s\S]*?<\/title>/i.test(content)) {
      content = content.replace(/<title>[\s\S]*?<\/title>/i, () => '<title>' + escapeHtml(title) + '</title>');
    } else {
      content = content.replace(/<head>/i, '<head>\n    <title>' + escapeHtml(title) + '</title>');
    }
    if (/<meta\s+[^>]*name=["']title["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']title["'][^>]*>/i, () => '<meta name="title" content="' + escapeAttr(title) + '">');
    } else {
      content = content.replace(/<\/title>/i, '</title>\n    <meta name="title" content="' + escapeAttr(title) + '">');
    }
    if (/<meta\s+[^>]*property=["']og:title["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*property=["']og:title["'][^>]*>/i, () => '<meta property="og:title" content="' + escapeAttr(title) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta property="og:title" content="' + escapeAttr(title) + '">\n</head>');
    }
    if (/<meta\s+[^>]*name=["']twitter:title["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']twitter:title["'][^>]*>/i, () => '<meta name="twitter:title" content="' + escapeAttr(title) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta name="twitter:title" content="' + escapeAttr(title) + '">\n</head>');
    }
  }

  // Description
  if (desc) {
    if (/<meta\s+[^>]*name=["']description["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/i, () => '<meta name="description" content="' + escapeAttr(desc) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta name="description" content="' + escapeAttr(desc) + '">\n</head>');
    }
    if (/<meta\s+[^>]*property=["']og:description["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*property=["']og:description["'][^>]*>/i, () => '<meta property="og:description" content="' + escapeAttr(desc) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta property="og:description" content="' + escapeAttr(desc) + '">\n</head>');
    }
    if (/<meta\s+[^>]*name=["']twitter:description["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']twitter:description["'][^>]*>/i, () => '<meta name="twitter:description" content="' + escapeAttr(desc) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta name="twitter:description" content="' + escapeAttr(desc) + '">\n</head>');
    }
  }

  // Keywords
  if (keywords) {
    if (/<meta\s+[^>]*name=["']keywords["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']keywords["'][^>]*>/i, () => '<meta name="keywords" content="' + escapeAttr(keywords) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta name="keywords" content="' + escapeAttr(keywords) + '">\n</head>');
    }
  }

  // Canonical
  if (canonical) {
    if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(content)) {
      content = content.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, () => '<link rel="canonical" href="' + escapeAttr(canonical) + '" />');
    } else {
      content = content.replace(/<\/head>/i, '    <link rel="canonical" href="' + escapeAttr(canonical) + '" />\n</head>');
    }
    if (/<meta\s+[^>]*property=["']og:url["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*property=["']og:url["'][^>]*>/i, () => '<meta property="og:url" content="' + escapeAttr(canonical) + '">');
    }
    if (/<meta\s+[^>]*name=["']twitter:url["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']twitter:url["'][^>]*>/i, () => '<meta name="twitter:url" content="' + escapeAttr(canonical) + '">');
    }
  }

  // OG & Twitter Images
  if (ogImg) {
    if (/<meta\s+[^>]*property=["']og:image["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*property=["']og:image["'][^>]*>/i, () => '<meta property="og:image" content="' + escapeAttr(ogImg) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta property="og:image" content="' + escapeAttr(ogImg) + '">\n</head>');
    }
    if (/<meta\s+[^>]*property=["']og:image:secure_url["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*property=["']og:image:secure_url["'][^>]*>/i, () => '<meta property="og:image:secure_url" content="' + escapeAttr(ogImg) + '">');
    } else {
      content = content.replace(/(<meta\s+property=["']og:image["'][^>]*>)/i, '$1\n    <meta property="og:image:secure_url" content="' + escapeAttr(ogImg) + '">');
    }
    if (/<meta\s+[^>]*name=["']twitter:image["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']twitter:image["'][^>]*>/i, () => '<meta name="twitter:image" content="' + escapeAttr(ogImg) + '">');
    } else {
      content = content.replace(/<\/head>/i, '    <meta name="twitter:image" content="' + escapeAttr(ogImg) + '">\n</head>');
    }
  }

  // Robots
  if (robots) {
    if (/<meta\s+[^>]*name=["']robots["'][^>]*>/i.test(content)) {
      content = content.replace(/<meta\s+[^>]*name=["']robots["'][^>]*>/i, () => '<meta name="robots" content="' + escapeAttr(robots) + '" />');
    } else {
      content = content.replace(/<\/head>/i, '    <meta name="robots" content="' + escapeAttr(robots) + '" />\n</head>');
    }
  }

  // Ensure og:type and og:site_name exist
  if (/<meta\s+property=["']og:type["'][^>]*>/i.test(content)) {
    content = content.replace(/<meta\s+property=["']og:type["'][^>]*>/i, '<meta property="og:type" content="website">');
  }
  if (!/<meta\s+property=["']og:site_name["']/i.test(content)) {
    content = content.replace(/<\/head>/i, '    <meta property="og:site_name" content="Mangalam Travel & Tours">\n</head>');
  }

  // Update Schema.org Structured Data description and image if present
  if (desc || ogImg) {
    content = content.replace(/(<script\s+type=["']application\/ld\+json["']>[\s\S]*?"@type"\s*:\s*"TravelAgency"[\s\S]*?<\/script>)/i, (schemaBlock) => {
      let updatedBlock = schemaBlock;
      if (desc) {
        const jsonSafeDesc = desc.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
        updatedBlock = updatedBlock.replace(/"description"\s*:\s*"[^"]*"/, () => `"description": "${jsonSafeDesc}"`);
      }
      if (ogImg) {
        updatedBlock = updatedBlock.replace(/"image"\s*:\s*"[^"]*"/, () => `"image": "${ogImg}"`);
      }
      return updatedBlock;
    });
  }

  return content;
}

function syncSeoToStaticHtml(entry) {
  if (!entry || !entry.page_route) return;
  const normRoute = normalizePageRoute(entry.page_route);
  // Dynamic query-param routes (like /packages.html?slug=...) are handled dynamically by server and api.js
  if (normRoute.includes('?')) return;

  const isHome = normRoute === '/';
  let filename = isHome ? 'index.html' : normRoute.replace(/^\//, '');
  if (!filename.endsWith('.html')) filename += '.html';

  const pathsToCheck = [
    path.join(__dirname, '../../', filename),
    path.join(__dirname, '../public', filename),
    path.join(__dirname, '../../public', filename),
    path.join(process.cwd(), filename),
    path.join(process.cwd(), 'public', filename),
    path.join(process.cwd(), 'backend', 'public', filename)
  ];

  const uniquePaths = [...new Set(pathsToCheck)];
  for (const filePath of uniquePaths) {
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = injectSeoIntoHtml(content, entry);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[SEO Sync] Updated static file: ${filePath}`);
      } catch (err) {
        console.warn(`[SEO Sync] Error updating static HTML: ${filePath}`, err.message);
      }
    }
  }
}

// GET SEO for specific page path (Frontend dynamic meta injection)
router.get('/match', async (req, res) => {
  try {
    const rawRoute = (req.query.route || req.query.path || '/').trim();
    const matched = await findSeoMatch(rawRoute);
    res.json(matched || {});
  } catch (e) {
    res.status(500).json({ error: 'Failed to match SEO config' });
  }
});

// GET single SEO entry by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await store.getById('seo', req.params.id);
    if (!item) return res.status(404).json({ error: 'SEO record not found' });
    res.json(map(item));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch SEO config' });
  }
});

// POST create or upsert SEO entry (Admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { page_route, page_name, meta_title, meta_description, meta_keywords, canonical_url, og_image, robots, status } = req.body;
    if (!page_route || !meta_title) {
      return res.status(400).json({ error: 'Page Route and Meta Title are required.' });
    }

    const cleanRoute = normalizePageRoute(page_route);
    
    // Check if route already exists in SEO table
    let existing = null;
    try {
      existing = await store.getOne('seo', 'WHERE LOWER(page_route) = ?', [cleanRoute.toLowerCase()]);
    } catch (_) {}

    let doc;
    if (existing && existing.id) {
      doc = await store.update('seo', existing.id, {
        page_route: cleanRoute,
        page_name: page_name || existing.page_name || 'Custom Page',
        meta_title: meta_title.trim(),
        meta_description: meta_description?.trim() || '',
        meta_keywords: meta_keywords?.trim() || '',
        canonical_url: canonical_url?.trim() || '',
        og_image: og_image?.trim() || '',
        robots: robots || 'index, follow',
        status: status || 'Active'
      });
    } else {
      doc = await store.insert('seo', {
        page_route: cleanRoute,
        page_name: page_name || 'Custom Page',
        meta_title: meta_title.trim(),
        meta_description: meta_description?.trim() || '',
        meta_keywords: meta_keywords?.trim() || '',
        canonical_url: canonical_url?.trim() || '',
        og_image: og_image?.trim() || '',
        robots: robots || 'index, follow',
        status: status || 'Active'
      });
    }

    const mapped = map(doc);
    try { syncSeoToStaticHtml(mapped); } catch (e) { console.warn('[SEO] sync error:', e); }

    res.status(201).json({ success: true, message: existing ? 'SEO configuration updated!' : 'SEO configuration added!', seo: mapped });
  } catch (e) {
    console.error('[SEO Save Error]:', e);
    res.status(500).json({ error: e.message || 'Failed to save SEO config' });
  }
});

// PUT update SEO entry (Admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { page_route, page_name, meta_title, meta_description, meta_keywords, canonical_url, og_image, robots, status } = req.body;

    const updates = {};
    if (page_route !== undefined) {
      const cleanRoute = normalizePageRoute(page_route);
      // Check if page_route is already used by another record (not this one)
      const existing = await store.getOne('seo', 'WHERE LOWER(page_route) = ? AND id != ?', [cleanRoute.toLowerCase(), Number(req.params.id)]);
      if (existing) {
        return res.status(400).json({ error: `An SEO configuration for route "${cleanRoute}" already exists.` });
      }
      updates.page_route = cleanRoute;
    }
    if (page_name !== undefined) updates.page_name = page_name.trim();
    if (meta_title !== undefined) updates.meta_title = meta_title.trim();
    if (meta_description !== undefined) updates.meta_description = meta_description.trim();
    if (meta_keywords !== undefined) updates.meta_keywords = meta_keywords.trim();
    if (canonical_url !== undefined) updates.canonical_url = canonical_url.trim();
    if (og_image !== undefined) updates.og_image = og_image.trim();
    if (robots !== undefined) updates.robots = robots.trim();
    if (status !== undefined) updates.status = status;

    const doc = await store.update('seo', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'SEO record not found' });

    const mapped = map(doc);
    try { syncSeoToStaticHtml(mapped); } catch (e) { console.warn('[SEO] sync error:', e); }

    res.json({ success: true, message: 'SEO configuration updated!', seo: mapped });
  } catch (e) {
    console.error('[SEO Update Error]:', e);
    res.status(500).json({ error: e.message || 'Failed to update SEO config' });
  }
});

// DELETE SEO entry (Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('seo', req.params.id);
    res.json({ success: true, message: 'SEO record deleted!' });
  } catch (e) {
    console.error('[SEO Delete Error]:', e);
    res.status(500).json({ error: 'Failed to delete SEO config' });
  }
});

router.findSeoMatch = findSeoMatch;
router.injectSeoIntoHtml = injectSeoIntoHtml;
router.toAbsoluteUrl = toAbsoluteUrl;
router.syncSeoToStaticHtml = syncSeoToStaticHtml;

module.exports = router;



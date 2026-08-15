const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function mapPackage(p, allDestinations = null) {
  if (!p) return null;
  const dests = allDestinations || store.getAll('destinations');
  const dest = dests.find(d => String(d.id || d.destination_id) === String(p.destination_id));
  const destName = dest ? (dest.destination_name || dest.name || '') : (p.destination_name || 'Popular Destination');

  return {
    package_id:    p.id,
    package_name:  p.package_name,
    slug_url:      p.slug_url,
    card_image:    p.card_image || '',
    banner_image:  p.banner_image || p.inner_image || p.card_image || '',
    amount:        p.amount || 0,
    nights:        p.nights || 0,
    days:          p.days || 0,
    destination_id:p.destination_id || null,
    destination_name: destName,
    type:          p.type || 'package',
    overview:      p.overview || '',
    hotel_type:    p.hotel_type || '4 Star Hotel',
    activities_count: p.activities_count || '5 Included',
    transfers:     p.transfers || 'Included',
    created_at:    p.created_at
  };
}

function mapCollection(c, allPackages = null, allDestinations = null) {
  if (!c) return null;
  const packagesList = allPackages || store.getAll('packages');
  const destinationsList = allDestinations || store.getAll('destinations');
  const packageIds = Array.isArray(c.package_ids) ? c.package_ids.map(Number) : [];

  // Resolve packages in the selected order
  const resolvedPackages = [];
  packageIds.forEach(pid => {
    const pkg = packagesList.find(p => p.id === pid);
    if (pkg) {
      resolvedPackages.push(mapPackage(pkg, destinationsList));
    }
  });

  return {
    id:          c.id,
    collection_id: c.id,
    title:       c.title || '',
    slug:        c.slug || slugify(c.title),
    subtitle:    c.subtitle || '',
    package_ids: packageIds,
    packages:    resolvedPackages,
    package_count: resolvedPackages.length,
    order:       Number(c.order) || 0,
    active:      c.active !== undefined ? Boolean(c.active) : true,
    created_at:  c.created_at
  };
}

// GET /api/collections — List all collections with populated packages
router.get('/', (req, res) => {
  let items = store.getAll('collections');
  if (req.query.active !== undefined) {
    const isActive = req.query.active === 'true' || req.query.active === '1';
    items = items.filter(c => (c.active !== undefined ? Boolean(c.active) : true) === isActive);
  }

  const allPackages = store.getAll('packages');
  const mapped = items.map(c => mapCollection(c, allPackages));

  // Sort by order ASC, then newest first
  mapped.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  res.json(mapped);
});

// GET /api/collections/:id — Get single collection
router.get('/:id', (req, res) => {
  const c = store.getOne('collections', x => x.id === Number(req.params.id) || x.slug === req.params.id);
  if (!c) return res.status(404).json({ error: 'Collection not found' });
  res.json(mapCollection(c));
});

// POST /api/collections — Create new collection (protected)
router.post('/', verifyToken, (req, res) => {
  const { title, subtitle, package_ids, order, active } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Collection title is required' });
  }

  const cleanPackageIds = Array.isArray(package_ids)
    ? package_ids.map(Number).filter(n => !isNaN(n) && n > 0)
    : [];

  const doc = store.insert('collections', {
    title: title.trim(),
    slug: slugify(title.trim()),
    subtitle: (subtitle || '').trim(),
    package_ids: cleanPackageIds,
    order: Number(order) || 0,
    active: active !== undefined ? Boolean(active) : true
  });

  res.status(201).json(mapCollection(doc));
});

// PUT /api/collections/:id — Update collection (protected)
router.put('/:id', verifyToken, (req, res) => {
  const { title, subtitle, package_ids, order, active } = req.body;
  
  const updates = {};
  if (title !== undefined) {
    updates.title = title.trim();
    updates.slug = slugify(title.trim());
  }
  if (subtitle !== undefined) updates.subtitle = subtitle.trim();
  if (package_ids !== undefined) {
    updates.package_ids = Array.isArray(package_ids)
      ? package_ids.map(Number).filter(n => !isNaN(n) && n > 0)
      : [];
  }
  if (order !== undefined) updates.order = Number(order) || 0;
  if (active !== undefined) updates.active = Boolean(active);

  const doc = store.update('collections', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Collection not found' });

  res.json({ message: 'Collection updated', ...mapCollection(doc) });
});

// DELETE /api/collections/:id — Delete collection (protected)
router.delete('/:id', verifyToken, (req, res) => {
  store.remove('collections', req.params.id);
  res.json({ message: 'Collection deleted' });
});

module.exports = router;

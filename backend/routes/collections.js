const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function mapPackage(p, allDestinations = []) {
  if (!p) return null;
  const dest = allDestinations.find(d => String(d.id || d.destination_id) === String(p.destination_id));
  const destName = dest ? (dest.destination_name || dest.name || '') : (p.destination_name || 'Popular Destination');

  return {
    package_id:    p.id,
    package_name:  p.package_name,
    slug_url:      p.slug_url,
    card_image:    p.card_image || '',
    banner_image:  p.banner_image || p.inner_image || p.card_image || '',
    amount:        Number(p.amount) || 0,
    nights:        Number(p.nights) || 0,
    days:          Number(p.days) || 0,
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

function mapCollection(c, allPackages = [], allDestinations = []) {
  if (!c) return null;
  const packageIds = Array.isArray(c.package_ids) ? c.package_ids.map(Number) : [];

  const resolvedPackages = [];
  packageIds.forEach(pid => {
    const pkg = allPackages.find(p => p.id === pid);
    if (pkg) {
      resolvedPackages.push(mapPackage(pkg, allDestinations));
    }
  });

  const orderVal = c.display_order !== undefined ? Number(c.display_order) : (Number(c.order) || 0);

  return {
    id:          c.id,
    collection_id: c.id,
    title:       c.title || '',
    slug:        c.slug || slugify(c.title),
    subtitle:    c.subtitle || '',
    package_ids: packageIds,
    packages:    resolvedPackages,
    package_count: resolvedPackages.length,
    order:       orderVal,
    display_order: orderVal,
    active:      c.active !== undefined ? Boolean(c.active) : true,
    created_at:  c.created_at
  };
}

// GET /api/collections
router.get('/', async (req, res) => {
  try {
    let whereSql = '';
    let params = [];
    if (req.query.active !== undefined) {
      const isActive = req.query.active === 'true' || req.query.active === '1';
      whereSql = 'WHERE active = ?';
      params.push(isActive ? 1 : 0);
    }

    const [items, allPackages, allDestinations] = await Promise.all([
      store.getAll('collections', whereSql, params, 'ORDER BY display_order ASC, id DESC'),
      store.getAll('packages'),
      store.getAll('destinations')
    ]);

    const mapped = items.map(c => mapCollection(c, allPackages, allDestinations));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// GET /api/collections/:id
router.get('/:id', async (req, res) => {
  try {
    const isNum = !isNaN(Number(req.params.id));
    const c = isNum
      ? await store.getById('collections', req.params.id)
      : await store.getOne('collections', 'WHERE slug = ?', [req.params.id]);

    if (!c) return res.status(404).json({ error: 'Collection not found' });

    const [allPackages, allDestinations] = await Promise.all([
      store.getAll('packages'),
      store.getAll('destinations')
    ]);

    res.json(mapCollection(c, allPackages, allDestinations));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// POST /api/collections
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, subtitle, package_ids, order, display_order, active } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Collection title is required' });
    }

    const cleanPackageIds = Array.isArray(package_ids)
      ? package_ids.map(Number).filter(n => !isNaN(n) && n > 0)
      : [];

    const orderNum = display_order !== undefined ? Number(display_order) : (Number(order) || 0);

    const doc = await store.insert('collections', {
      title: title.trim(),
      slug: slugify(title.trim()),
      subtitle: (subtitle || '').trim(),
      package_ids: cleanPackageIds,
      display_order: orderNum,
      active: active !== undefined ? (Boolean(active) ? 1 : 0) : 1
    });

    const [allPackages, allDestinations] = await Promise.all([
      store.getAll('packages'),
      store.getAll('destinations')
    ]);

    res.status(201).json(mapCollection(doc, allPackages, allDestinations));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// PUT /api/collections/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, subtitle, package_ids, order, display_order, active } = req.body;
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
    if (display_order !== undefined || order !== undefined) {
      updates.display_order = display_order !== undefined ? Number(display_order) : Number(order);
    }
    if (active !== undefined) updates.active = Boolean(active) ? 1 : 0;

    const doc = await store.update('collections', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'Collection not found' });

    const [allPackages, allDestinations] = await Promise.all([
      store.getAll('packages'),
      store.getAll('destinations')
    ]);

    res.json({ message: 'Collection updated', ...mapCollection(doc, allPackages, allDestinations) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// DELETE /api/collections/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('collections', req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

module.exports = router;

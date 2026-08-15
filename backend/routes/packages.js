const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function parseItineraryDays(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    
    const lines = raw.split('\n').map(s => s.trim()).filter(Boolean);
    const days = [];
    let currentDay = null;

    lines.forEach((line, idx) => {
      const dayMatch = line.match(/^(?:Day\s*(\d+)[:\s-]*|(\d+)[\.:\s-]+)(.*)/i);
      if (dayMatch) {
        if (currentDay) days.push(currentDay);
        const dayNum = dayMatch[1] || dayMatch[2] || (days.length + 1);
        const rest = dayMatch[3] ? dayMatch[3].trim() : '';
        currentDay = {
          day: Number(dayNum),
          title: rest ? `Day ${dayNum}: ${rest}` : line,
          description: rest || line
        };
      } else if (currentDay) {
        currentDay.description += '\n' + line;
      } else {
        currentDay = {
          day: idx + 1,
          title: `Day ${idx + 1}`,
          description: line
        };
      }
    });
    if (currentDay) days.push(currentDay);
    return days;
  }
  return [];
}

function parseBannerImages(p) {
  let images = [];
  if (Array.isArray(p.banner_images)) {
    images = p.banner_images.filter(Boolean);
  } else if (typeof p.banner_images === 'string') {
    try {
      const parsed = JSON.parse(p.banner_images);
      if (Array.isArray(parsed)) images = parsed.filter(Boolean);
    } catch {
      if (p.banner_images) images = [p.banner_images];
    }
  }
  if (!images.length) {
    const single = p.banner_image || p.inner_image || p.card_image || '';
    if (single) images = [single];
  }
  return images.slice(0, 4);
}

const map = p => ({
  package_id:    p.id,
  package_name:  p.package_name,
  footer_title:  p.footer_title || '',
  slug_url:      p.slug_url,
  card_image:    p.card_image || '',
  banner_image:  p.banner_image || p.inner_image || p.card_image || '',
  banner_images: parseBannerImages(p),
  amount:        Number(p.amount) || 0,
  nights:        Number(p.nights) || 0,
  days:          Number(p.days) || 0,
  destination_id:p.destination_id || null,
  type:          p.type || 'package',
  overview:      p.overview || '',
  itinerary:     typeof p.itinerary === 'string' ? p.itinerary : JSON.stringify(p.itinerary || ''),
  itinerary_days: parseItineraryDays(p.itinerary),
  inclusions:    p.inclusions || '',
  exclusions:    p.exclusions || '',
  terms:         p.terms || '',
  hotel_type:    p.hotel_type || '4 Star Hotel',
  activities_count: p.activities_count || '5 Included',
  transfers:     p.transfers || 'Included',
  created_at:    p.created_at
});

router.get('/', async (req, res) => {
  try {
    let whereClauses = [];
    let params = [];

    if (req.query.destination_id) {
      whereClauses.push('destination_id = ?');
      params.push(req.query.destination_id);
    }
    if (req.query.type) {
      whereClauses.push('type = ?');
      params.push(req.query.type);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const items = await store.getAll('packages', whereSql, params);
    res.json(items.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const isNum = !isNaN(Number(req.params.id));
    const p = isNum
      ? await store.getById('packages', req.params.id)
      : await store.getOne('packages', 'WHERE slug_url = ?', [req.params.id]);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(map(p));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { package_name, footer_title, card_image, banner_image, banner_images, amount, nights, days, destination_id, type, overview, itinerary, inclusions, exclusions, terms, hotel_type, activities_count, transfers } = req.body;
    if (!package_name) return res.status(400).json({ error: 'package_name is required' });
    const doc = await store.insert('packages', { 
      package_name, 
      footer_title: footer_title || '',
      slug_url: slugify(package_name), 
      card_image: card_image||'', 
      banner_image: banner_image||'', 
      banner_images: banner_images||[], 
      amount: Number(amount)||0, 
      nights: Number(nights)||0, 
      days: Number(days)||0, 
      destination_id: destination_id||null, 
      type: type||'package', 
      overview: overview||'', 
      itinerary: itinerary||'', 
      inclusions: inclusions||'', 
      exclusions: exclusions||'', 
      terms: terms||'', 
      hotel_type: hotel_type||'4 Star Hotel', 
      activities_count: activities_count||'5 Included', 
      transfers: transfers||'Included' 
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create package' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { package_name, footer_title, card_image, banner_image, banner_images, amount, nights, days, destination_id, type, overview, itinerary, inclusions, exclusions, terms, hotel_type, activities_count, transfers } = req.body;
    const updates = { 
      package_name, 
      footer_title: footer_title !== undefined ? footer_title : '',
      card_image, 
      banner_image, 
      banner_images, 
      amount: amount !== undefined ? Number(amount) : undefined, 
      nights: nights !== undefined ? Number(nights) : undefined, 
      days: days !== undefined ? Number(days) : undefined, 
      destination_id, 
      type, 
      overview, 
      itinerary, 
      inclusions, 
      exclusions, 
      terms, 
      hotel_type, 
      activities_count, 
      transfers 
    };
    if (package_name) updates.slug_url = slugify(package_name);
    const doc = await store.update('packages', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', ...map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update package' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('packages', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

module.exports = router;

const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

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

const map = p => ({
  package_id:    p.id,
  package_name:  p.package_name,
  slug_url:      p.slug_url,
  card_image:    p.card_image || '',
  banner_image:  p.banner_image || p.inner_image || p.card_image || '',
  amount:        p.amount || 0,
  nights:        p.nights || 0,
  days:          p.days || 0,
  destination_id:p.destination_id || null,
  type:          p.type || 'package',
  overview:      p.overview || '',
  itinerary:     typeof p.itinerary === 'string' ? p.itinerary : JSON.stringify(p.itinerary || ''),
  itinerary_days: parseItineraryDays(p.itinerary),
  inclusions:    p.inclusions || '',
  exclusions:    p.exclusions || '',
  hotel_type:    p.hotel_type || '4 Star Hotel',
  activities_count: p.activities_count || '5 Included',
  transfers:     p.transfers || 'Included',
  created_at:    p.created_at
});

router.get('/', (req, res) => {
  let items = store.getAll('packages');
  if (req.query.destination_id) items = items.filter(p => String(p.destination_id) === String(req.query.destination_id));
  if (req.query.type)           items = items.filter(p => p.type === req.query.type);
  res.json(items.map(map));
});

router.get('/:id', (req, res) => {
  const p = store.getOne('packages', x => x.id === Number(req.params.id) || x.slug_url === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(map(p));
});

router.post('/', verifyToken, (req, res) => {
  const { package_name, card_image, banner_image, amount, nights, days, destination_id, type, overview, itinerary, inclusions, exclusions, hotel_type, activities_count, transfers } = req.body;
  if (!package_name) return res.status(400).json({ error: 'package_name is required' });
  const doc = store.insert('packages', { package_name, slug_url: slugify(package_name), card_image: card_image||'', banner_image: banner_image||'', amount: Number(amount)||0, nights: Number(nights)||0, days: Number(days)||0, destination_id: destination_id||null, type: type||'package', overview: overview||'', itinerary: itinerary||'', inclusions: inclusions||'', exclusions: exclusions||'', hotel_type: hotel_type||'4 Star Hotel', activities_count: activities_count||'5 Included', transfers: transfers||'Included' });
  res.status(201).json(map(doc));
});

router.put('/:id', verifyToken, (req, res) => {
  const { package_name, card_image, banner_image, amount, nights, days, destination_id, type, overview, itinerary, inclusions, exclusions, hotel_type, activities_count, transfers } = req.body;
  const updates = { package_name, card_image, banner_image, amount: amount !== undefined ? Number(amount) : undefined, nights: nights !== undefined ? Number(nights) : undefined, days: days !== undefined ? Number(days) : undefined, destination_id, type, overview, itinerary, inclusions, exclusions, hotel_type, activities_count, transfers };
  if (package_name) updates.slug_url = slugify(package_name);
  const doc = store.update('packages', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => {
  store.remove('packages', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;

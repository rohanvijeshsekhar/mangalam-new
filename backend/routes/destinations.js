const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = d => ({
  destination_id:   d.id,
  destination_name: d.destination_name,
  footer_title:     d.footer_title || '',
  slug_url:         d.slug_url,
  card_image:       d.card_image || '',
  inner_image:      d.inner_image || '',
  description:      d.description || '',
  places_to_visit:  Array.isArray(d.places_to_visit) ? d.places_to_visit : (typeof d.places_to_visit === 'string' ? d.places_to_visit.split('\n').map(s=>s.trim()).filter(Boolean) : []),
  created_at:       d.created_at
});

router.get('/', async (req, res) => {
  try {
    const items = await store.getAll('destinations');
    res.json(items.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const isNum = !isNaN(Number(req.params.id));
    const d = isNum
      ? await store.getById('destinations', req.params.id)
      : await store.getOne('destinations', 'WHERE slug_url = ?', [req.params.id]);
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json(map(d));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { destination_name, footer_title, card_image, inner_image, description, places_to_visit } = req.body;
    if (!destination_name) return res.status(400).json({ error: 'destination_name is required' });
    const doc = await store.insert('destinations', { 
      destination_name, 
      footer_title: footer_title || '',
      slug_url: slugify(destination_name), 
      card_image: card_image||'', 
      inner_image: inner_image||'', 
      description: description||'',
      places_to_visit: Array.isArray(places_to_visit) ? places_to_visit : (typeof places_to_visit === 'string' ? places_to_visit.split('\n').map(s=>s.trim()).filter(Boolean) : [])
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { destination_name, footer_title, card_image, inner_image, description, places_to_visit } = req.body;
    const updates = { destination_name, footer_title: footer_title !== undefined ? footer_title : '', card_image, inner_image, description };
    if (destination_name) updates.slug_url = slugify(destination_name);
    if (places_to_visit !== undefined) {
      updates.places_to_visit = Array.isArray(places_to_visit) ? places_to_visit : (typeof places_to_visit === 'string' ? places_to_visit.split('\n').map(s=>s.trim()).filter(Boolean) : []);
    }
    const doc = await store.update('destinations', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', ...map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('destinations', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

module.exports = router;

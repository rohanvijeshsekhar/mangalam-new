const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = a => ({
  attraction_id:   a.id,
  destination_id:  a.destination_id || null,
  destination_name:a.destination_name || '',
  name:            a.name || '',
  title:           a.name || '',
  slug_url:        a.slug_url || (a.name ? slugify(a.name) : ''),
  card_image:      a.card_image || '',
  banner_image:    a.banner_image || a.card_image || '',
  experience_type: a.experience_type || 'Cultural',
  duration:        a.duration || '2-3 Hours',
  included:        a.included || 'Entry Ticket & Guide',
  price:           Number(a.price) || 0,
  amount:          Number(a.price) || 0,
  description:     a.description || '',
  overview:        a.description || '',
  created_at:      a.created_at
});

router.get('/', async (req, res) => {
  try {
    const items = await store.getAll('attractions');
    res.json(items.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch attractions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const isNum = !isNaN(Number(req.params.id));
    const a = isNum
      ? await store.getById('attractions', req.params.id)
      : await store.getOne('attractions', 'WHERE slug_url = ?', [req.params.id]);
    if (!a) return res.status(404).json({ error: 'Not found' });
    res.json(map(a));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch attraction' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, card_image, banner_image, experience_type, duration, included, destination_id, destination_name, price, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const doc = await store.insert('attractions', {
      name,
      slug_url: slugify(name),
      card_image: card_image || '',
      banner_image: banner_image || card_image || '',
      experience_type: experience_type || 'Cultural',
      duration: duration || '2-3 Hours',
      included: included || '',
      destination_id: destination_id ? Number(destination_id) : null,
      destination_name: destination_name || '',
      price: Number(price) || 0,
      description: description || ''
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create attraction' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, card_image, banner_image, experience_type, duration, included, destination_id, destination_name, price, description } = req.body;
    const updates = {
      name,
      card_image,
      banner_image,
      experience_type,
      duration,
      included,
      destination_id: destination_id !== undefined ? (destination_id ? Number(destination_id) : null) : undefined,
      destination_name,
      price: price !== undefined ? Number(price) : undefined,
      description
    };
    if (name) updates.slug_url = slugify(name);
    const doc = await store.update('attractions', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', ...map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update attraction' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('attractions', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete attraction' });
  }
});

module.exports = router;

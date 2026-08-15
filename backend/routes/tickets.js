const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = t => ({
  ticket_id: t.id,
  title: t.title,
  short_title: t.short_title || '',
  slug_url: t.slug_url,
  card_image: t.card_image || '',
  display_amount: Number(t.display_amount) || 0,
  adult_price: Number(t.adult_price) || 0,
  destination_name: t.destination_name || '',
  description: t.description || '',
  created_at: t.created_at
});

router.get('/', async (req, res) => {
  try {
    const items = await store.getAll('tickets');
    res.json(items.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const isNum = !isNaN(Number(req.params.id));
    const t = isNum
      ? await store.getById('tickets', req.params.id)
      : await store.getOne('tickets', 'WHERE slug_url = ?', [req.params.id]);
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(map(t));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, short_title, card_image, display_amount, adult_price, destination_name, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const doc = await store.insert('tickets', {
      title,
      short_title: short_title || '',
      slug_url: slugify(title),
      card_image: card_image || '',
      display_amount: Number(display_amount) || 0,
      adult_price: Number(adult_price) || 0,
      destination_name: destination_name || '',
      description: description || ''
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, short_title, card_image, display_amount, adult_price, destination_name, description } = req.body;
    const updates = {
      title,
      short_title,
      card_image,
      display_amount: display_amount !== undefined ? Number(display_amount) : undefined,
      adult_price: adult_price !== undefined ? Number(adult_price) : undefined,
      destination_name,
      description
    };
    if (title) updates.slug_url = slugify(title);
    const doc = await store.update('tickets', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', ...map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('tickets', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router;

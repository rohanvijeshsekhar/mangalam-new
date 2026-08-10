const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Map store items to expected API field names
const map = d => ({
  destination_id:   d.id,
  destination_name: d.destination_name,
  slug_url:         d.slug_url,
  card_image:       d.card_image || '',
  inner_image:      d.inner_image || '',
  description:      d.description || '',
  created_at:       d.created_at
});

router.get('/',    (req, res) => res.json(store.getAll('destinations').map(map)));
router.get('/:id', (req, res) => {
  const d = store.getOne('destinations', x => x.id === Number(req.params.id) || x.slug_url === req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  res.json(map(d));
});

router.post('/', verifyToken, (req, res) => {
  const { destination_name, card_image, inner_image, description } = req.body;
  if (!destination_name) return res.status(400).json({ error: 'destination_name is required' });
  const doc = store.insert('destinations', { destination_name, slug_url: slugify(destination_name), card_image: card_image||'', inner_image: inner_image||'', description: description||'' });
  res.status(201).json(map(doc));
});

router.put('/:id', verifyToken, (req, res) => {
  const { destination_name, card_image, inner_image, description } = req.body;
  const updates = { destination_name, card_image, inner_image, description };
  if (destination_name) updates.slug_url = slugify(destination_name);
  const doc = store.update('destinations', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => {
  store.remove('destinations', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;

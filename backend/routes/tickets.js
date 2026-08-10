const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = t => ({ ticket_id: t.id, title: t.title, short_title: t.short_title||'', slug_url: t.slug_url, card_image: t.card_image||'', display_amount: t.display_amount||0, adult_price: t.adult_price||0, destination_name: t.destination_name||'', description: t.description||'', created_at: t.created_at });

router.get('/',    (req, res) => res.json(store.getAll('tickets').map(map)));
router.get('/:id', (req, res) => { const t = store.getOne('tickets', x => x.id === Number(req.params.id) || x.slug_url === req.params.id); if (!t) return res.status(404).json({ error: 'Not found' }); res.json(map(t)); });

router.post('/', verifyToken, (req, res) => {
  const { title, short_title, card_image, display_amount, adult_price, destination_name, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const doc = store.insert('tickets', { title, short_title: short_title||'', slug_url: slugify(title), card_image: card_image||'', display_amount: Number(display_amount)||0, adult_price: Number(adult_price)||0, destination_name: destination_name||'', description: description||'' });
  res.status(201).json(map(doc));
});

router.put('/:id', verifyToken, (req, res) => {
  const { title, short_title, card_image, display_amount, adult_price, destination_name, description } = req.body;
  const updates = { title, short_title, card_image, display_amount: display_amount !== undefined ? Number(display_amount) : undefined, adult_price: adult_price !== undefined ? Number(adult_price) : undefined, destination_name, description };
  if (title) updates.slug_url = slugify(title);
  const doc = store.update('tickets', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Not found' }); res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => { store.remove('tickets', req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;

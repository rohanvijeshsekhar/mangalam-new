const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = b => ({ blog_id: b.id, title: b.title, slug_url: b.slug_url, card_image: b.card_image||'', date: b.date||'', content: b.content||'', created_at: b.created_at });

router.get('/',    (req, res) => res.json(store.getAll('blogs').map(map)));
router.get('/:id', (req, res) => { const b = store.getOne('blogs', x => x.id === Number(req.params.id) || x.slug_url === req.params.id); if (!b) return res.status(404).json({ error: 'Not found' }); res.json(map(b)); });

router.post('/', verifyToken, (req, res) => {
  const { title, card_image, date, content } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const doc = store.insert('blogs', { title, slug_url: slugify(title), card_image: card_image||'', date: date||new Date().toISOString().split('T')[0], content: content||'' });
  res.status(201).json(map(doc));
});

router.put('/:id', verifyToken, (req, res) => {
  const { title, card_image, date, content } = req.body;
  const updates = { title, card_image, date, content };
  if (title) updates.slug_url = slugify(title);
  const doc = store.update('blogs', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Not found' }); res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => { store.remove('blogs', req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;

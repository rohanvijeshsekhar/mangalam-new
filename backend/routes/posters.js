const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const map = p => ({
  poster_id: p.id,
  title: p.title || p.name || 'Promotional Banner',
  name: p.title || p.name || 'Promotional Banner',
  image: p.image || '',
  link: p.link || '',
  alt_text: p.alt_text || p.title || 'Promotional Banner',
  created_at: p.created_at
});

router.get('/', (req, res) => {
  res.json(store.getAll('posters').map(map));
});

router.get('/:id', (req, res) => {
  const doc = store.getById('posters', req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(map(doc));
});

router.post('/', verifyToken, (req, res) => {
  const { title, name, image, link, alt_text } = req.body;
  const doc = store.insert('posters', {
    title: title || name || 'Promotional Banner',
    image: image || '',
    link: link || '',
    alt_text: alt_text || title || name || 'Promotional Banner'
  });
  res.status(201).json(map(doc));
});

router.put('/:id', verifyToken, (req, res) => {
  const { title, name, image, link, alt_text } = req.body;
  const doc = store.update('posters', req.params.id, {
    title: title || name,
    image,
    link,
    alt_text: alt_text || title || name
  });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => {
  store.remove('posters', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;

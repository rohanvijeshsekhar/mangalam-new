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

router.get('/', async (req, res) => {
  try {
    const items = await store.getAll('posters');
    res.json(items.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch posters' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await store.getById('posters', req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch poster' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, name, image, link, alt_text } = req.body;
    const doc = await store.insert('posters', {
      title: title || name || 'Promotional Banner',
      image: image || '',
      link: link || '',
      alt_text: alt_text || title || name || 'Promotional Banner'
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create poster' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, name, image, link, alt_text } = req.body;
    const doc = await store.update('posters', req.params.id, {
      title: title || name,
      image,
      link,
      alt_text: alt_text || title || name
    });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', ...map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update poster' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('posters', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete poster' });
  }
});

module.exports = router;

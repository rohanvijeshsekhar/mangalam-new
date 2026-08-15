const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const map = t => ({
  testimonial_id: t.id,
  name: t.name,
  location: t.location || '',
  feedback: t.feedback || '',
  rating: Number(t.rating) || 5,
  created_at: t.created_at
});

router.get('/', async (req, res) => {
  try {
    const items = await store.getAll('testimonials');
    res.json(items.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, location, feedback, rating } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const doc = await store.insert('testimonials', {
      name,
      location: location || '',
      feedback: feedback || '',
      rating: Number(rating) || 5
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, location, feedback, rating } = req.body;
    const doc = await store.update('testimonials', req.params.id, {
      name,
      location,
      feedback,
      rating: rating !== undefined ? Number(rating) : undefined
    });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', ...map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('testimonials', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

module.exports = router;

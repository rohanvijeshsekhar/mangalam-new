const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const map = t => ({ testimonial_id: t.id, name: t.name, location: t.location||'', feedback: t.feedback||'', rating: t.rating||5, created_at: t.created_at });

router.get('/', (req, res) => res.json(store.getAll('testimonials').map(map)));
router.post('/', verifyToken, (req, res) => {
  const { name, location, feedback, rating } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const doc = store.insert('testimonials', { name, location: location||'', feedback: feedback||'', rating: Number(rating)||5 });
  res.status(201).json(map(doc));
});
router.put('/:id', verifyToken, (req, res) => {
  const { name, location, feedback, rating } = req.body;
  const doc = store.update('testimonials', req.params.id, { name, location, feedback, rating: rating !== undefined ? Number(rating) : undefined });
  if (!doc) return res.status(404).json({ error: 'Not found' }); res.json({ message: 'Updated', ...map(doc) });
});
router.delete('/:id', verifyToken, (req, res) => { store.remove('testimonials', req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;

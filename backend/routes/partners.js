const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const map = p => ({ partner_id: p.id, name: p.name, image: p.image||'', created_at: p.created_at });

router.get('/', (req, res) => res.json(store.getAll('partners').map(map)));
router.post('/', verifyToken, (req, res) => {
  const { name, image } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const doc = store.insert('partners', { name, image: image||'' });
  res.status(201).json(map(doc));
});
router.put('/:id', verifyToken, (req, res) => {
  const doc = store.update('partners', req.params.id, { name: req.body.name, image: req.body.image });
  if (!doc) return res.status(404).json({ error: 'Not found' }); res.json({ message: 'Updated', ...map(doc) });
});
router.delete('/:id', verifyToken, (req, res) => { store.remove('partners', req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;

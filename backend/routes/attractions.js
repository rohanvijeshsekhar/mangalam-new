const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = a => ({
  attraction_id:   a.id,
  destination_id:  a.destination_id || (a.destination_name && a.destination_name.toLowerCase().includes('dubai') ? 1 : null),
  destination_name:a.destination_name || 'Dubai, UAE',
  name:            a.name || a.title || '',
  title:           a.name || a.title || '',
  slug_url:        a.slug_url || (a.name ? slugify(a.name) : ''),
  card_image:      a.card_image || a.image || '',
  banner_image:    a.banner_image || a.card_image || a.image || '',
  experience_type: a.experience_type || 'Cultural',
  duration:        a.duration || '2-3 Hours',
  included:        a.included || 'Entry Ticket & Guide',
  price:           a.price || a.amount || 0,
  amount:          a.price || a.amount || 0,
  description:     a.description || a.overview || '',
  overview:        a.description || a.overview || '',
  created_at:      a.created_at
});

router.get('/', (req, res) => {
  res.json(store.getAll('attractions').map(map));
});

router.get('/:id', (req, res) => {
  const a = store.getOne('attractions', x => x.id === Number(req.params.id) || x.slug_url === req.params.id);
  if (!a) return res.status(404).json({ error: 'Not found' });
  res.json(map(a));
});

router.post('/', verifyToken, (req, res) => {
  const { name, card_image, banner_image, experience_type, duration, included, destination_id, destination_name, price, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const doc = store.insert('attractions', {
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
});

router.put('/:id', verifyToken, (req, res) => {
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
  const doc = store.update('attractions', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => {
  store.remove('attractions', req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;

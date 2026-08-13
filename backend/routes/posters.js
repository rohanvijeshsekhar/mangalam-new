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

function ensureSeed() {
  const existing = store.getAll('posters');
  if (!existing || existing.length === 0) {
    const seeds = [
      {
        title: 'Exclusive Dubai Holiday Special Offer',
        image: './assets/images/activity-banner.webp',
        link: '/holiday-package.html',
        alt_text: 'Exclusive Dubai Holiday Special Offer'
      },
      {
        title: 'Burj Khalifa Sky Views & Entry Tickets',
        image: './assets/images/destination-banner.webp',
        link: '/attraction.html',
        alt_text: 'Burj Khalifa Sky Views & Entry Tickets'
      }
    ];
    seeds.forEach(s => store.insert('posters', s));
  }
}

router.get('/', (req, res) => {
  ensureSeed();
  res.json(store.getAll('posters').map(map));
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

const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();

const map = g => ({
  gallery_id: g.id,
  id: g.id,
  title: g.title || 'Tour Moment',
  image: g.image || '',
  caption: g.caption || '',
  created_at: g.created_at
});

// Sample fallback gallery images for initial state
const SAMPLE_GALLERY = [
  { id: 1, title: 'Kerala Backwaters Tour', image: './assets/images/banner1.webp', caption: 'Happy travelers experiencing the serene Alleppey backwaters houseboats.', created_at: new Date().toISOString() },
  { id: 2, title: 'Dubai Desert Safari', image: './assets/images/res-activity-banner.webp', caption: 'Thrilling dune bashing and sunset desert camp in Dubai.', created_at: new Date().toISOString() },
  { id: 3, title: 'Singapore City Sightseeing', image: './assets/images/activity-banner.webp', caption: 'Explorers visiting Gardens by the Bay and Marina Bay Sands.', created_at: new Date().toISOString() },
  { id: 4, title: 'Thailand Beach Getaway', image: './assets/images/banner2.webp', caption: 'Tropical island hopping trip in Phuket & Krabi.', created_at: new Date().toISOString() },
  { id: 5, title: 'Bali Cultural Discovery', image: './assets/images/banner3.webp', caption: 'Traditional temple visit and rice terrace views in Ubud.', created_at: new Date().toISOString() },
  { id: 6, title: 'Swiss Alps Expedition', image: './assets/images/package-1.webp', caption: 'Unforgettable mountain railway journey in Mount Titlis.', created_at: new Date().toISOString() }
];

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const items = await store.getAll('gallery');
    if (!items || items.length === 0) {
      return res.json(SAMPLE_GALLERY);
    }
    res.json(items.map(map));
  } catch (e) {
    res.json(SAMPLE_GALLERY);
  }
});

// POST /api/gallery (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, image, caption } = req.body;
    if (!image) return res.status(400).json({ error: 'image is required' });
    const doc = await store.insert('gallery', {
      title: title || 'Tour Moment',
      image,
      caption: caption || ''
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

// DELETE /api/gallery/:id (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('gallery', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router;

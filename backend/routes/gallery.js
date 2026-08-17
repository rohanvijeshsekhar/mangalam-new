const express = require('express');
const store   = require('../db/store');
const { query } = require('../db/mysql');
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

// Fallback sample photos if empty
const SAMPLE_GALLERY = [
  { title: 'Kerala Backwaters Tour', image: './assets/images/banner1.webp', caption: 'Happy travelers experiencing the serene Alleppey backwaters houseboats.' },
  { title: 'Dubai Desert Safari', image: './assets/images/res-activity-banner.webp', caption: 'Thrilling dune bashing and sunset desert camp in Dubai.' },
  { title: 'Singapore City Sightseeing', image: './assets/images/activity-banner.webp', caption: 'Explorers visiting Gardens by the Bay and Marina Bay Sands.' },
  { title: 'Thailand Beach Getaway', image: './assets/images/banner2.webp', caption: 'Tropical island hopping trip in Phuket & Krabi.' },
  { title: 'Bali Cultural Discovery', image: './assets/images/banner3.webp', caption: 'Traditional temple visit and rice terrace views in Ubud.' },
  { title: 'Swiss Alps Expedition', image: './assets/images/package-1.webp', caption: 'Unforgettable mountain railway journey in Mount Titlis.' }
];

// Ensure table exists in MySQL and seed default items if empty
async function ensureGalleryTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) DEFAULT '',
        image VARCHAR(500) NOT NULL,
        caption VARCHAR(255) DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const countRes = await query(`SELECT COUNT(*) as cnt FROM gallery`);
    if (countRes && countRes[0] && Number(countRes[0].cnt) === 0) {
      for (const item of SAMPLE_GALLERY) {
        await query(`INSERT INTO gallery (title, image, caption) VALUES (?, ?, ?)`, [
          item.title,
          item.image,
          item.caption
        ]);
      }
    }
  } catch (e) {
    console.error('[Gallery DB init warning]:', e.message);
  }
}

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    await ensureGalleryTable();
    const items = await store.getAll('gallery');
    res.json((items || []).map(map));
  } catch (e) {
    res.json([]);
  }
});

// POST /api/gallery (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    await ensureGalleryTable();
    const { title, image, caption } = req.body;
    if (!image) return res.status(400).json({ error: 'image is required' });
    const doc = await store.insert('gallery', {
      title: title || 'Tour Moment',
      image,
      caption: caption || ''
    });
    res.status(201).json(map(doc));
  } catch (e) {
    console.error('[Gallery POST error]:', e);
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

// PUT /api/gallery/:id (Protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    await ensureGalleryTable();
    const { title, image, caption } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (image !== undefined) updates.image = image;
    if (caption !== undefined) updates.caption = caption;

    const doc = await store.update('gallery', req.params.id, updates);
    res.json(map(doc || { id: req.params.id, ...updates }));
  } catch (e) {
    console.error('[Gallery PUT error]:', e);
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

// DELETE /api/gallery/:id (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await ensureGalleryTable();
    await store.remove('gallery', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router;

const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = b => {
  const plainText = b.content ? b.content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim() : '';
  return {
    id: b.id,
    blog_id: b.id,
    title: b.title || '',
    slug_url: b.slug_url || '',
    slug: b.slug_url || '',
    card_image: b.card_image || '',
    banner_image: b.banner_image || b.card_image || '',
    date: b.date || '',
    author: b.author || 'Mangalam Editorial',
    category: b.category || 'Travel Guide',
    content: b.content || '',
    description: b.description || plainText.slice(0, 180),
    created_at: b.created_at || ''
  };
};

router.get('/', async (req, res) => {
  try {
    const items = await store.getAll('blogs');
    res.json(items.map(map));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const isNum = !isNaN(Number(req.params.id));
    const b = isNum
      ? await store.getById('blogs', req.params.id)
      : await store.getOne('blogs', 'WHERE slug_url = ?', [req.params.id]);
    if (!b) return res.status(404).json({ error: 'Not found' });
    res.json(map(b));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, card_image, banner_image, date, content, author, category, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const doc = await store.insert('blogs', {
      title,
      slug_url: slugify(title),
      card_image: card_image || '',
      banner_image: banner_image || card_image || '',
      date: date || new Date().toISOString().split('T')[0],
      content: content || '',
      author: author || 'Mangalam Editorial',
      category: category || 'Travel Guide',
      description: description || ''
    });
    res.status(201).json(map(doc));
  } catch (e) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, card_image, banner_image, date, content, author, category, description } = req.body;
    const updates = { card_image, banner_image, date, content, author, category, description };
    if (title) {
      updates.title = title;
      updates.slug_url = slugify(title);
    }
    const doc = await store.update('blogs', req.params.id, updates);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', ...map(doc) });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await store.remove('blogs', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;

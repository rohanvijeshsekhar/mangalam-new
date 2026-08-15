const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

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

router.get('/', (req, res) => {
  const blogs = store.getAll('blogs').map(map);
  res.json(blogs);
});

router.get('/:id', (req, res) => {
  const param = req.params.id;
  const numId = Number(param);
  const b = store.getOne('blogs', x => (numId && x.id === numId) || x.slug_url === param || x.slug === param);
  if (!b) return res.status(404).json({ error: 'Not found' });
  res.json(map(b));
});

router.post('/', verifyToken, (req, res) => {
  const { title, card_image, banner_image, date, content, author, category, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const doc = store.insert('blogs', {
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
});

router.put('/:id', verifyToken, (req, res) => {
  const { title, card_image, banner_image, date, content, author, category, description } = req.body;
  const updates = { card_image, banner_image, date, content, author, category, description };
  if (title) {
    updates.title = title;
    updates.slug_url = slugify(title);
  }
  const doc = store.update('blogs', req.params.id, updates);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Updated', ...map(doc) });
});

router.delete('/:id', verifyToken, (req, res) => { store.remove('blogs', req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;

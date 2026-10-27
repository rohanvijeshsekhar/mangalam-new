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

// Sanitize blog HTML content to prevent XSS and ensure safe hyperlinks
function sanitizeBlogContent(html) {
  if (!html || typeof html !== 'string') return '';

  // 1. Strip dangerous tags and their content
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // 2. Strip inline JavaScript event handlers (e.g. onerror, onload, onclick)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Inspect, validate and sanitize all <a> anchor tags
  clean = clean.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    // Extract href
    const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    let href = hrefMatch ? (hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || '').trim() : '';
    const lower = href.toLowerCase();

    // Reject dangerous URI protocols
    if (
      !href ||
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:') ||
      lower.startsWith('file:') ||
      href.includes('<') ||
      href.includes('>')
    ) {
      return '<span class="blog-link-neutralized">';
    }

    // Only allow safe protocols: http, https, relative paths /, anchors #, mailto, tel
    const isSafe = /^https?:\/\//i.test(href) || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:');
    if (!isSafe) {
      // Auto-prefix domain-like strings with https://
      if (/^[a-zA-Z0-9][-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-zA-Z0-9()]{2,6}/i.test(href)) {
        href = 'https://' + href;
      } else {
        return '<span class="blog-link-neutralized">';
      }
    }

    // Extract title
    const titleMatch = attrs.match(/title\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3] || '').trim() : '';

    // Extract target
    const targetMatch = attrs.match(/target\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const target = targetMatch ? (targetMatch[1] || targetMatch[2] || targetMatch[3] || '').trim() : '';
    const isBlank = target.toLowerCase() === '_blank';

    let safeTag = `<a href="${href.replace(/"/g, '&quot;')}"`;
    if (title) safeTag += ` title="${title.replace(/"/g, '&quot;')}"`;
    if (isBlank) safeTag += ` target="_blank" rel="noopener noreferrer"`;
    safeTag += ` class="blog-link"`;
    safeTag += '>';
    return safeTag;
  });

  return clean;
}

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, card_image, banner_image, date, content, author, category, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const cleanContent = sanitizeBlogContent(content || '');
    const doc = await store.insert('blogs', {
      title,
      slug_url: slugify(title),
      card_image: card_image || '',
      banner_image: banner_image || card_image || '',
      date: date || new Date().toISOString().split('T')[0],
      content: cleanContent,
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
    const cleanContent = content !== undefined ? sanitizeBlogContent(content) : undefined;
    const updates = { card_image, banner_image, date, author, category, description };
    if (cleanContent !== undefined) updates.content = cleanContent;
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

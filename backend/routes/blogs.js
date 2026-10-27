const express = require('express');
const store   = require('../db/store');
const { verifyToken } = require('./auth');
const router  = express.Router();
const slugify = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const map = b => {
  const plainText = b.content ? b.content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim() : '';
  const pk = (b.id !== undefined && b.id !== null) ? b.id : b.blog_id;
  return {
    id: pk,
    blog_id: pk,
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
    let b = null;
    if (isNum) {
      b = await store.getById('blogs', req.params.id);
    }
    if (!b) {
      b = await store.getOne('blogs', 'WHERE slug_url = ?', [req.params.id]);
    }
    if (!b) return res.status(404).json({ error: 'Not found' });
    res.json(map(b));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Comprehensive, secure URL cleaner supporting relative paths, anchor targets, mailto/tel, and absolute domains
function cleanHref(rawHref) {
  if (!rawHref || typeof rawHref !== 'string') return '';
  let href = rawHref.trim();
  const lower = href.toLowerCase();

  // Strip dangerous XSS protocols
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    href.includes('<') ||
    href.includes('>') ||
    href.includes('"')
  ) {
    return '';
  }

  // Safe relative paths (/packages.html, #section, ./page.html, ../page.html, ?query)
  if (
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('?') ||
    href.startsWith('./') ||
    href.startsWith('../')
  ) {
    return href;
  }

  // Safe action schemes
  if (lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('whatsapp:')) {
    return href;
  }

  // Safe relative HTML pages (e.g. packages.html, contact.html, holiday-package.html?id=1)
  if (/^[a-zA-Z0-9_\-\.\/]+(?:\.html|\.php)?(?:\?[^"'\s<>]*)?(?:#[^"'\s<>]*)?$/i.test(href)) {
    // If it looks like an external domain (e.g. google.com or mangalamtravel.com)
    if (/^(?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._\+~#=]{0,256}\.(?:com|org|net|in|io|co|ai|me|info|biz|gov|edu|uk|us|de|travel)\b/i.test(href)) {
      return 'https://' + href;
    }
    return href;
  }

  // Safe HTTP/HTTPS URLs
  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  // Domain-like links without protocol: e.g. "www.google.com" or "mangalamtravel.com"
  if (/^(?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-zA-Z0-9()]{2,6}/i.test(href)) {
    return 'https://' + href;
  }

  return href;
}

// Sanitize blog HTML content to prevent XSS and ensure safe hyperlinks without destroying HTML structure
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

  // 3. Inspect, validate and sanitize all <a> anchor tags (with full innerText capture)
  clean = clean.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (fullMatch, attrs, innerText) => {
    const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const rawHref = hrefMatch ? (hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || '').trim() : '';
    const href = cleanHref(rawHref);

    // If href is empty or unsafe, unwrap the link and keep the inner text intact
    if (!href) {
      return innerText;
    }

    const titleMatch = attrs.match(/title\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3] || '').trim() : '';

    const targetMatch = attrs.match(/target\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const target = targetMatch ? (targetMatch[1] || targetMatch[2] || targetMatch[3] || '').trim() : '';
    const isBlank = target.toLowerCase() === '_blank';

    let tag = `<a href="${href.replace(/"/g, '&quot;')}"`;
    if (title) tag += ` title="${title.replace(/"/g, '&quot;')}"`;
    if (isBlank) tag += ` target="_blank" rel="noopener noreferrer"`;
    tag += ` class="blog-link"`;
    tag += `>${innerText}</a>`;
    return tag;
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
      slug_url: req.body.slug_url ? slugify(req.body.slug_url) : slugify(title),
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
    
    // Preserve existing slug_url unless explicitly changed or missing
    const existing = await store.getById('blogs', req.params.id) || await store.getOne('blogs', 'WHERE slug_url = ?', [req.params.id]);
    if (title) {
      updates.title = title;
      if (!existing || !existing.slug_url) {
        updates.slug_url = slugify(title);
      }
    }
    if (req.body.slug_url) {
      updates.slug_url = slugify(req.body.slug_url);
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


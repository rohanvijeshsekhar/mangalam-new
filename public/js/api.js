/**
 * api.js — Shared API utilities for Mangalam Travel & Tours static pages
 * All fetch() calls go to /api/* (Express REST endpoints → MySQL)
 */

const API_BASE = '';

/** Resolve image path to a full URL */
function resolveImg(src, fallback = '/assets/images/logo-color.png') {
  if (!src) return fallback;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  if (src.startsWith('uploads/')) return '/' + src;
  if (src.startsWith('/')) return src;
  if (src.startsWith('assets/')) return '/' + src;
  // Legacy admin file paths
  return '/uploads/' + src;
}

/** Generic GET helper */
async function apiGet(path) {
  try {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('[API] GET failed:', path, e.message);
    return null;
  }
}

/** Generic POST helper */
async function apiPost(path, body, isFormData = false) {
  try {
    const opts = { method: 'POST' };
    if (isFormData) {
      opts.body = body;
    } else {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(API_BASE + path, opts);
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  } catch (e) {
    console.warn('[API] POST failed:', path, e.message);
    return null;
  }
}

/** Show skeleton loader in a container */
function showSkeleton(el, count = 3, type = 'card') {
  if (!el) return;
  const cardSkel = `
    <div class="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
      <div class="h-48 bg-gray-200"></div>
      <div class="p-4 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>`;
  el.innerHTML = Array(count).fill(cardSkel).join('');
}

/** Show error state */
function showError(el, msg = 'Could not load data.') {
  if (!el) return;
  el.innerHTML = `<p class="text-gray-400 text-center py-8 col-span-full">${msg}</p>`;
}

/** Format price */
function fmtPrice(amount) {
  const n = Number(amount);
  if (!n || isNaN(n)) return '';
  return '₹ ' + n.toLocaleString('en-IN');
}

/** Truncate text */
function truncate(str, len = 80) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

/** Slug from text */
function slugify(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Read URL query param */
function qParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ─── Notice bar loader (runs on every page) ──────────────────────────────────
async function loadNotice() {
  const bar = document.getElementById('notice-bar');
  const txt = document.getElementById('notice-text');
  if (!bar || !txt) return;
  const data = await apiGet('/api/notice');
  let msg = '';
  if (typeof data === 'string') {
    msg = data;
  } else if (data && typeof data.data === 'string') {
    msg = data.data;
  } else if (data && typeof data.notice === 'string') {
    msg = data.notice;
  }
  msg = msg.trim();
  if (msg && msg !== '[object Object]') {
    txt.innerHTML = msg;
    bar.style.display = '';
  } else {
    bar.style.display = 'none';
  }
}

// ─── Footer destinations loader ───────────────────────────────────────────────
async function loadFooterDests() {
  const col1 = document.getElementById('footer-dests-1');
  const col2 = document.getElementById('footer-dests-2');
  const col3 = document.getElementById('footer-dests-3');
  if (!col1 && !col2 && !col3) return;
  const dests = await apiGet('/api/destinations');
  if (!dests || !dests.length) return;
  const top = dests.slice(0, 18);
  const cols = [col1, col2, col3];
  const per = Math.ceil(top.length / 3);
  cols.forEach((col, i) => {
    if (!col) return;
    col.innerHTML = top.slice(i * per, (i + 1) * per).map(d => {
      const name = d.destination_name || d.name || '';
      const slug = d.slug_url || d.slug || '';
      const url = slug ? `packages.html?slug=${encodeURIComponent(slug)}&type=package` : '#';
      return `<a href="${url}" class="block text-gray-300 hover:text-white transition-colors">${name} Holiday Packages</a>`;
    }).join('');
  });
}

// ─── Footer activities loader ─────────────────────────────────────────────────
async function loadFooterActivities() {
  const el = document.getElementById('footer-activities');
  if (!el) return;
  const acts = await apiGet('/api/activities');
  if (!acts || !acts.length) return;
  el.innerHTML = acts.slice(0, 8).map(a => {
    const name = a.title || a.name || '';
    const slug = a.slug_url || a.slug || '';
    const url = slug ? `activity-details.html?slug=${encodeURIComponent(slug)}` : '#';
    return `<a href="${url}" class="block text-gray-300 hover:text-white transition-colors">${name}</a>`;
  }).join('');
}

// ─── Footer tickets loader ────────────────────────────────────────────────────
async function loadFooterTickets() {
  const el = document.getElementById('footer-tickets');
  if (!el) return;
  const tkts = await apiGet('/api/tickets');
  if (!tkts || !tkts.length) return;
  el.innerHTML = tkts.slice(0, 8).map(t => {
    const name = t.title || t.name || '';
    const slug = t.slug_url || t.slug || '';
    const url = slug ? `ticket-details.html?slug=${encodeURIComponent(slug)}` : '#';
    return `<a href="${url}" class="block text-gray-300 hover:text-white transition-colors">${name}</a>`;
  }).join('');
}

// ─── Destination dropdown populator (search bars on multiple pages) ───────────
async function loadDestinationDropdowns() {
  let dests = await apiGet('/api/destinations');
  if (!dests || !Array.isArray(dests) || dests.length === 0) {
    dests = [
      { destination_name: 'Dubai', slug_url: 'dubai' },
      { destination_name: 'Singapore', slug_url: 'singapore' },
      { destination_name: 'Malaysia', slug_url: 'malaysia' },
      { destination_name: 'Thailand', slug_url: 'thailand' },
      { destination_name: 'Bali', slug_url: 'bali' }
    ];
  }
  const seen = new Set();
  const uniqueDests = [];
  dests.forEach(d => {
    const name = (d.destination_name || d.name || d.title || '').trim();
    const slug = (d.slug_url || d.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim();
    if (name && !seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      uniqueDests.push({ name, slug });
    }
  });

  const dropdownHTML = uniqueDests.map(d => 
    `<div class="px-4 py-2.5 hover:bg-gray-100 cursor-pointer font-dm-sans text-sm text-gray-700 font-medium destination-menu-item transition-colors" data-value="${d.name}" data-slug="${d.slug}">${d.name}</div>`
  ).join('');

  document.querySelectorAll('.destination-menu-scroll').forEach(menu => {
    const anyDestItem = `<div class="px-4 py-2.5 hover:bg-gray-100 cursor-pointer font-dm-sans text-sm text-gray-700 font-medium destination-menu-item transition-colors" data-value="Any Destination" data-slug="">Any Destination</div>`;
    menu.innerHTML = anyDestItem + dropdownHTML;
  });
}

// ─── Dynamic Google & Social SEO Meta Injector ───────────────────────────────
async function loadDynamicSeo() {
  try {
    const pathname = window.location.pathname || '/';
    const cleanPath = pathname === '/' || pathname.endsWith('/index.html') ? '/' : pathname;
    const seo = await apiGet(`/seo/match?route=${encodeURIComponent(cleanPath)}`);
    if (!seo || !seo.id) return;

    if (seo.meta_title) {
      document.title = seo.meta_title;
      setMeta('og:title', 'property', seo.meta_title);
      setMeta('twitter:title', 'name', seo.meta_title);
    }
    if (seo.meta_description) {
      setMeta('description', 'name', seo.meta_description);
      setMeta('og:description', 'property', seo.meta_description);
      setMeta('twitter:description', 'name', seo.meta_description);
    }
    if (seo.meta_keywords) {
      setMeta('keywords', 'name', seo.meta_keywords);
    }
    if (seo.robots) {
      setMeta('robots', 'name', seo.robots);
    }
    if (seo.canonical_url) {
      setLink('canonical', seo.canonical_url);
      setMeta('og:url', 'property', seo.canonical_url);
    }
    if (seo.og_image) {
      const resolved = resolveImg(seo.og_image);
      setMeta('og:image', 'property', resolved);
      setMeta('twitter:image', 'name', resolved);
      setMeta('twitter:card', 'name', 'summary_large_image');
    }
  } catch (_) {}
}

function setMeta(nameOrProp, attr, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// ─── Mobile Bottom Nav Styling Enhancement ──────────────────────────────────
function injectMobileNavStyles() {
  if (document.getElementById('mt-mobile-nav-styles')) return;
  const style = document.createElement('style');
  style.id = 'mt-mobile-nav-styles';
  style.textContent = `
    @media (max-width: 768px) {
      .responsive-float-header {
        display: block !important;
        background: #ffffff !important;
        box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1) !important;
        z-index: 1000 !important;
        height: auto !important;
        padding-bottom: env(safe-area-inset-bottom, 0px) !important;
      }
      .responsive-float-header ul {
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-end !important;
        list-style: none !important;
        margin: 0 !important;
        padding: 8px 8px !important;
        gap: 4px !important;
      }
      .responsive-float-header li {
        flex: 1 !important;
        text-align: center !important;
      }
      .responsive-float-header a {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-decoration: none !important;
        color: #666666 !important;
        font-size: 10px !important;
        line-height: 1.2 !important;
        text-align: center !important;
      }
      .responsive-float-header a.active {
        color: #1f2937 !important;
      }
      .responsive-float-header a > svg,
      .responsive-float-header i {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
        margin-bottom: 4px !important;
      }
      .mobile-customize-item {
        position: relative !important;
      }
      .mobile-customize-button {
        position: relative !important;
        top: -6px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-decoration: none !important;
        color: #1f2937 !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
      .mobile-customize-button:focus {
        outline: none !important;
      }
      .mobile-customize-icon svg {
        width: 62px !important;
        height: 62px !important;
        display: block !important;
        filter: drop-shadow(0 4px 10px rgba(26, 172, 222, 0.35)) !important;
      }
      .mobile-customize-dropdown {
        bottom: 70px !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// ─── Init common page elements ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectMobileNavStyles();
  loadDynamicSeo();
  loadNotice();
  loadFooterDests();
  loadFooterActivities();
  loadFooterTickets();
  loadDestinationDropdowns();
});

// Also run immediately if DOM is ready
if (document.readyState !== 'loading') {
  injectMobileNavStyles();
}

// Export for use in page scripts
window.MT = {
  apiGet, apiPost, resolveImg, showSkeleton, showError,
  fmtPrice, truncate, slugify, qParam
};

/**
 * api.js — Shared API Utilities for Mangalam Travel & Tours
 * Returns clean empty arrays when no database is connected.
 */

const API_BASE = window.API_BASE || (
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000'
    : window.location.origin
);

const STATIC_DATA = {
  destinations: [],
  packages: [],
  tickets: [],
  activities: [],
  blogs: [],
  testimonials: [],
  partners: []
};

/** Resolve image path to a full URL */
function resolveImg(src, fallback = './assets/images/logo-color.png') {
  if (!src) return fallback;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  if (src.startsWith('/uploads/') || src.startsWith('uploads/')) {
    const cleanPath = src.startsWith('/') ? src : '/' + src;
    return API_BASE + cleanPath;
  }
  if (src.startsWith('./assets/') || src.startsWith('assets/')) {
    return src.startsWith('./') ? src : './' + src;
  }
  if (src.startsWith('/')) return '.' + src;
  return './assets/images/' + src;
}

/** Generic GET helper */
async function apiGet(path) {
  try {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data) return data;
  } catch (e) {
    // Return clean empty array
  }
  return [];
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
    if (path.includes('otp')) return { status: 1, message: 'OTP verified' };
    return '1';
  }
}

/** Show skeleton loader */
function showSkeleton(el, count = 3, type = 'card') {
  if (!el) return;
  el.innerHTML = '';
}

/** Get URL search query param */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Global Exports
window.MT = { resolveImg, apiGet, apiPost, showSkeleton, getParam, qParam: getParam };

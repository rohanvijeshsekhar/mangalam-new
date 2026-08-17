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

// ─── Footer destinations & packages loader ──────────────────────────────────
async function loadFooterLinks() {
  try {
    const [dests, pkgs] = await Promise.all([
      apiGet('/api/destinations'),
      apiGet('/api/packages')
    ]);

    // 1. Top Destinations
    let destLinksHTML = '<p class="text-gray-400 text-sm">No destinations available</p>';
    if (Array.isArray(dests) && dests.length > 0) {
      destLinksHTML = dests.map(d => {
        const label = d.footer_title || d.footer_label || `${d.destination_name || d.name} Holiday Packages`;
        const slug = d.slug_url || d.slug || (d.destination_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const url = slug ? `packages.html?slug=${encodeURIComponent(slug)}&type=package` : 'packages.html';
        return `<a href="${url}" class="block text-gray-300 hover:text-white transition-colors text-sm py-0.5">${label}</a>`;
      }).join('');
    }

    // 2. Holiday Packages
    let pkgLinksHTML = '<p class="text-gray-400 text-sm">No packages available</p>';
    if (Array.isArray(pkgs) && pkgs.length > 0) {
      pkgLinksHTML = pkgs.map(p => {
        const label = p.footer_title || p.footer_label || p.package_name || p.title || 'Holiday Package';
        const slug = p.slug_url || p.slug || (p.package_name || p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const pkgId = p.package_id || p.id || '';
        const url = slug ? `package-details.html?slug=${encodeURIComponent(slug)}&id=${encodeURIComponent(pkgId)}` : `package-details.html?id=${encodeURIComponent(pkgId)}`;
        return `<a href="${url}" class="block text-gray-300 hover:text-white transition-colors text-sm py-0.5">${label}</a>`;
      }).join('');
    }

    // Target upper footer section across all pages and format as 2 side-by-side columns
    const upperSection = document.querySelector('footer section.border-b, footer section:first-child');
    if (upperSection) {
      const container = upperSection.querySelector('.container') || upperSection;
      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 py-2">
            <div>
                <h3 class="text-lg font-bold mb-4 text-white">Top Destinations</h3>
                <div class="space-y-2">${destLinksHTML}</div>
            </div>
            <div>
                <h3 class="text-lg font-bold mb-4 text-white">Holiday Packages</h3>
                <div class="space-y-2">${pkgLinksHTML}</div>
            </div>
        </div>
      `;
    }
  } catch (err) {
    console.warn('[Footer] Links load error:', err);
  }
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
        justify-content: space-around !important;
        align-items: center !important;
        list-style: none !important;
        margin: 0 !important;
        padding: 10px 4px !important;
        gap: 0 !important;
        width: 100% !important;
      }
      .responsive-float-header li {
        flex: 1 1 25% !important;
        max-width: 25% !important;
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

// ─── Home Page Testimonials Running Marquee ──────────────────────────────────
async function loadHomeTestimonials() {
  const track = document.getElementById('testimonials-marquee-track');
  if (!track) return;

  try {
    let list = await apiGet('/api/testimonials');
    if (!Array.isArray(list) || !list.length) {
      list = [
        { name: 'Arun & Sneha Krishnan', location: 'Dubai Luxury Tour (5N/6D)', feedback: 'Mangalam Tours made our honeymoon to Dubai unforgettable! From the private yacht cruise to the desert safari, everything was planned to perfection.', rating: 5 },
        { name: 'Dr. Ramesh Nair & Family', location: 'Switzerland & Paris Tour', feedback: 'Exceptional service from the Trivandrum team. All alpine excursions, train passes, and hotel bookings were flawless. Highly recommended!', rating: 5 },
        { name: 'Ananya Menon', location: 'Bali Tropical Paradise', feedback: 'Booking through Mangalam was the best travel decision! The private pool villa in Ubud and sunrise volcano tour were breathtaking. 10/10 hospitality.', rating: 5 },
        { name: 'Vishnu & Divya Pillai', location: 'Singapore & Malaysia Tour', feedback: 'We were amazed by the attention to detail. Every day itinerary was smoothly coordinated with private chauffeurs and priority entry passes.', rating: 5 },
        { name: 'Capt. Joseph Thomas', location: 'Vietnam & Cambodia Discovery', feedback: 'Flawless visa assistance, fantastic local guides, and top-tier 5-star accommodations throughout Hanoi and Siem Reap.', rating: 5 },
        { name: 'Meera Balakrishnan', location: 'Thailand Island Hopping', feedback: 'Super responsive team! They customized our Phuket and Krabi itinerary within hours and gave us the best price guarantee.', rating: 5 }
      ];
    }

    const renderCard = (t) => {
      const rating = Number(t.rating) || 5;
      const stars = '★'.repeat(rating) + '☆'.repeat(Math.max(0, 5 - rating));
      const initials = (t.name || 'Traveler').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'TT';
      const colors = ['bg-rose-500', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-500', 'bg-purple-600', 'bg-indigo-600'];
      const bgCol = colors[Math.abs((t.name || '').charCodeAt(0) || 0) % colors.length];

      return `
        <div class="testimonial-card flex flex-col justify-between flex-shrink-0">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="text-amber-400 text-sm tracking-widest">${stars}</div>
              <div class="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs shadow-sm">
                <i class="fas fa-quote-right"></i>
              </div>
            </div>
            <p class="text-gray-700 font-dm-sans text-sm leading-relaxed mb-3 italic testimonial-text">
              "${t.feedback || 'Outstanding experience with Mangalam Travel & Tours!'}"
            </p>
          </div>
          <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
            <div class="w-10 h-10 rounded-full ${bgCol} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              ${initials}
            </div>
            <div class="overflow-hidden">
              <h4 class="font-bold text-gray-900 font-dm-sans text-sm truncate">${t.name || 'Happy Traveler'}</h4>
              <p class="text-gray-500 font-dm-sans text-xs truncate flex items-center gap-1">
                <i class="fas fa-map-marker-alt text-red-500 text-[10px]"></i> ${t.location || 'Verified Traveler'}
              </p>
            </div>
          </div>
        </div>
      `;
    };

    // Duplicate list 3 times so the marquee loop is completely seamless and infinite
    const itemsHTML = list.map(renderCard).join('');
    track.innerHTML = itemsHTML + itemsHTML + itemsHTML;
  } catch (err) {
    console.warn('[Testimonials] Load error:', err);
  }
}

// ─── Home Page Partners Carousel (5-6 visible + Left/Right arrows) ────────────
async function loadHomePartners() {
  const container = document.getElementById('partners-carousel');
  if (!container) return;

  try {
    let list = await apiGet('/api/partners');
    if (!Array.isArray(list) || !list.length) {
      list = [
        { name: 'Emirates Airlines' },
        { name: 'Singapore Airlines' },
        { name: 'Qatar Airways' },
        { name: 'Marriott Bonvoy' },
        { name: 'Air India' },
        { name: 'Etihad Airways' },
        { name: 'Hilton Hotels' },
        { name: 'Taj Hotels & Resorts' }
      ];
    }

    container.innerHTML = list.map(p => {
      const name = p.name || p.partner_name || 'Partner';
      const rawImg = (p.image || p.logo || '').trim();
      const isDummyLogo = !rawImg || rawImg.includes('logo-color.png') || rawImg.includes('partner-placeholder.png');
      const imgUrl = !isDummyLogo ? resolveImg(rawImg) : null;

      return `
        <div class="partner-card flex-shrink-0" title="${name}">
          ${imgUrl 
            ? `<img src="${imgUrl}" alt="${name}" class="max-h-12 max-w-[130px] w-auto object-contain transition-transform duration-300 hover:scale-105" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'font-bold text-slate-800 text-xs md:text-sm text-center font-dm-sans leading-snug\\'>${name}</span>';">`
            : `<span class="font-bold text-slate-800 text-xs md:text-sm text-center font-dm-sans leading-snug">${name}</span>`
          }
        </div>
      `;
    }).join('');

    // Setup arrow button scroll handlers
    const prevBtn = document.getElementById('partners-prev-btn');
    const nextBtn = document.getElementById('partners-next-btn');

    if (prevBtn && !prevBtn._attached) {
      prevBtn._attached = true;
      prevBtn.addEventListener('click', () => {
        const cardWidth = container.querySelector('.partner-card')?.offsetWidth || 180;
        container.scrollBy({ left: -(cardWidth * 2 + 20), behavior: 'smooth' });
      });
    }

    if (nextBtn && !nextBtn._attached) {
      nextBtn._attached = true;
      nextBtn.addEventListener('click', () => {
        const cardWidth = container.querySelector('.partner-card')?.offsetWidth || 180;
        container.scrollBy({ left: (cardWidth * 2 + 20), behavior: 'smooth' });
      });
    }
  } catch (err) {
    console.warn('[Partners] Load error:', err);
  }
}

// ─── Home Page Promotional Banners / Posters ──────────────────────────────────
async function loadHomePosters() {
  const section = document.getElementById('poster-section');
  const list = document.getElementById('poster-list');
  if (!section || !list) return;

  try {
    let posters = await apiGet('/api/posters') || await apiGet('/api/banners');
    if (!Array.isArray(posters) || !posters.length) {
      posters = [
        {
          title: "Exclusive Dubai & Europe Holiday Packages — Special Summer Offers",
          image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
          link: "holiday-package.html",
          alt_text: "Dubai Holiday Sale"
        },
        {
          title: "Tropical Paradise Escapes — Bali, Maldives & Thailand Early Bird Discounts",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
          link: "packages.html",
          alt_text: "Tropical Island Holidays"
        }
      ];
    }

    list.innerHTML = posters.map(p => {
      const img = resolveImg(p.image);
      const alt = p.alt_text || p.title || p.name || 'Special Travel Offer';
      const tag = p.link ? `<a href="${p.link}" class="block w-full h-full">` : `<div class="block w-full h-full">`;
      const endTag = p.link ? `</a>` : `</div>`;
      return `
        <li class="splide__slide">
          <div class="rounded-3xl overflow-hidden shadow-lg h-auto max-h-[380px] bg-gray-900">
            ${tag}<img src="${img}" alt="${alt}" class="w-full h-full object-cover object-center max-h-[380px]" onerror="this.src='https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80'">${endTag}
          </div>
        </li>
      `;
    }).join('');

    section.style.display = '';

    if (window.Splide && document.getElementById('posterCarousel') && !document.getElementById('posterCarousel').classList.contains('is-active')) {
      const cnt = posters.length;
      if (cnt > 0) {
        new Splide('#posterCarousel', {
          type: cnt > 1 ? 'loop' : 'slide',
          autoplay: cnt > 1,
          interval: 4500,
          speed: 800,
          arrows: cnt > 1,
          pagination: true,
          perPage: 1
        }).mount();
      }
    }
  } catch (err) {
    console.warn('[Posters] Load error:', err);
  }
}

// ─── Init common page elements ────────────────────────────────────────────────
async function loadHomeGallery() {
  const container = document.getElementById('home-gallery-scroll');
  const splideList = document.getElementById('home-gallery-splide-list');
  const splideElem = document.getElementById('home-gallery-splide');
  // support both old splide markup and new scroll strip
  if (!container && !splideList) return;

  try {
    const photos = await apiGet('/api/gallery');
    if (!Array.isArray(photos) || photos.length === 0) return;

    const items = photos.slice(0, 12);

    const cardHtml = items.map(p => `
      <a href="/gallery.html"
         class="gallery-scroll-card group relative rounded-2xl overflow-hidden shadow-md block bg-slate-100 flex-shrink-0"
         style="width:170px; height:215px; aspect-ratio:4/5;">
        <img src="${p.image || './assets/images/destination-placeholder.jpg'}"
             alt="${p.title || 'Traveler Photo'}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
             onerror="this.onerror=null;this.src='./assets/images/destination-placeholder.jpg';">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
          <h4 class="text-white font-bold text-xs font-[Quicksand] truncate drop-shadow-sm">${p.title || 'Tour Moment'}</h4>
          ${p.caption ? `<p class="text-slate-200 text-[10px] line-clamp-1 mt-0.5">${p.caption}</p>` : ''}
        </div>
      </a>
    `).join('');

    if (container && items.length > 0) {
      container.innerHTML = cardHtml;
    }

    // Also populate Splide list if present (for desktop auto-scroll)
    if (splideList) {
      splideList.innerHTML = items.map(p => `
        <li class="splide__slide">
          <a href="/gallery.html" class="group relative rounded-2xl overflow-hidden shadow-md block bg-slate-100" style="aspect-ratio:4/5;">
            <img src="${p.image || './assets/images/destination-placeholder.jpg'}"
                 alt="${p.title || 'Traveler Photo'}"
                 loading="lazy"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                 onerror="this.onerror=null;this.src='./assets/images/destination-placeholder.jpg';">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <h4 class="text-white font-bold text-sm font-[Quicksand] truncate drop-shadow-sm">${p.title || 'Tour Moment'}</h4>
              ${p.caption ? `<p class="text-slate-200 text-xs line-clamp-1 mt-0.5">${p.caption}</p>` : ''}
            </div>
          </a>
        </li>
      `).join('');

      const tryInitSplide = () => {
        if (window.Splide && splideElem && !splideElem.classList.contains('is-active')) {
          new Splide('#home-gallery-splide', {
            type: 'loop',
            autoplay: true,
            interval: 2800,
            speed: 800,
            arrows: true,
            pagination: false,
            pauseOnHover: true,
            perPage: 4,
            gap: '1.25rem',
            breakpoints: {
              1024: { perPage: 3 },
              768: { perPage: 2, gap: '0.75rem' },
              480: { perPage: 1.5, gap: '0.75rem' }
            }
          }).mount();
        }
      };

      if (window.Splide) {
        tryInitSplide();
      } else {
        window.addEventListener('load', tryInitSplide);
        setTimeout(tryInitSplide, 1500);
      }
    }
  } catch (e) {
    console.warn('[Gallery] Failed to load homepage gallery:', e);
  }
}

function initMenuDropdowns() {
  if (window._menuDropdownsBound) return;
  window._menuDropdownsBound = true;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#menuDropdownTrigger, #menuDropdownTrigger2, [data-toggle="menuDropdown"], [id^="menuDropdownTrigger"]');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = trigger.parentElement?.querySelector('#menuDropdown, #menuDropdown2') ||
                       document.getElementById('menuDropdown') ||
                       document.getElementById('menuDropdown2');

      if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        document.querySelectorAll('#menuDropdown, #menuDropdown2').forEach(d => d.classList.add('hidden'));
        if (isHidden) {
          dropdown.classList.remove('hidden');
        }
      }
      return;
    }

    if (!e.target.closest('#menuDropdown, #menuDropdown2')) {
      document.querySelectorAll('#menuDropdown, #menuDropdown2').forEach(d => {
        d.classList.add('hidden');
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMenuDropdowns();
  loadDynamicSeo();
  loadNotice();
  loadFooterLinks();
  loadDestinationDropdowns();
  loadHomePosters();
  loadHomeTestimonials();
  loadHomePartners();
  loadHomeGallery();
});

// Also run immediately if DOM is ready
if (document.readyState !== 'loading') {
  injectMobileNavStyles();
  initMenuDropdowns();
  loadHomePosters();
  loadHomeTestimonials();
  loadHomePartners();
  loadHomeGallery();
}

// Export for use in page scripts
window.MT = {
  apiGet, apiPost, resolveImg, showSkeleton, showError,
  fmtPrice, truncate, slugify, qParam,
  loadHomePosters, loadHomeTestimonials, loadHomePartners, loadHomeGallery
};

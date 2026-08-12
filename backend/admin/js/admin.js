/**
 * admin.js — Mangalam Travel & Tours Admin Panel Logic
 * Handles: Auth, Navigation, CRUD for all data types, Image upload, Modals
 */

const API_ORIGIN = window.API_ORIGIN || (
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.port === '3000' ? 'http://localhost:4000' : window.location.origin)
    : window.location.origin
);
const API = `${API_ORIGIN}/api`;

// ── Auth ─────────────────────────────────────────────────────────────────────
const token = localStorage.getItem('mt_admin_token');
if (!token) window.location.href = '/admin/index.html';

const username = localStorage.getItem('mt_admin_user') || 'Admin';
document.getElementById('sidebar-username').textContent = username;
document.getElementById('sidebar-avatar').textContent = username.charAt(0).toUpperCase();

document.getElementById('btn-logout').addEventListener('click', () => {
  if (confirm('Logout?')) { localStorage.clear(); window.location.href = '/admin/index.html'; }
});

// ── API helpers ───────────────────────────────────────────────────────────────
async function api(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (res.status === 401) { localStorage.clear(); window.location.href = '/admin/index.html'; }
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = '/admin/index.html';
    throw new Error('Session expired. Please log in again.');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return `${API_ORIGIN}${data.url}`;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Navigation ────────────────────────────────────────────────────────────────
const sections = {
  dashboard:    { title: 'Dashboard',    subtitle: 'Overview of your website data' },
  destinations: { title: 'Destinations', subtitle: 'Manage travel destinations' },
  packages:     { title: 'Packages',     subtitle: 'Manage holiday packages' },
  attractions:  { title: 'Attractions',  subtitle: 'Manage places and attraction experiences' },
  tickets:      { title: 'Tickets',      subtitle: 'Manage attraction tickets' },
  blogs:        { title: 'Blogs',        subtitle: 'Manage blog posts' },
  testimonials: { title: 'Testimonials', subtitle: 'Manage customer reviews' },
  partners:     { title: 'Partners',     subtitle: 'Manage partner logos' },
  settings:     { title: 'Settings',     subtitle: 'Admin account & configuration' },
};

let currentSection = 'dashboard';

function navigateTo(section) {
  currentSection = section;
  // Nav items
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });
  // Sections
  document.querySelectorAll('.content-section').forEach(el => {
    el.classList.toggle('hidden', !el.id.endsWith(section));
  });
  // Header
  document.getElementById('page-title').textContent = sections[section]?.title || section;
  document.getElementById('page-subtitle').textContent = sections[section]?.subtitle || '';
  // Load data
  loaders[section]?.();
}

document.querySelectorAll('[data-section]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const s = el.dataset.section;
    const action = el.dataset.action;
    navigateTo(s);
    if (action === 'add') setTimeout(() => openAddModal(s), 100);
  });
});

// Sidebar toggle
document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function loadDashboard() {
  const stats = await api('GET', '/stats');
  if (!stats) return;
  ['destinations','packages','attractions','tickets','blogs','testimonials','partners'].forEach(k => {
    const el = document.getElementById(`stat-${k}`);
    if (el) el.textContent = stats[k] ?? 0;
  });
}

// ── Image upload helper ───────────────────────────────────────────────────────
function createImageUpload(id, currentUrl = '') {
  return `
    <div class="img-upload-area" id="upload-area-${id}">
      <input type="file" accept="image/*" id="file-${id}" onchange="handleFileSelect('${id}')">
      <div class="upload-icon"><i class="fas fa-cloud-upload-alt"></i></div>
      <p>Click or drag image here</p>
      <p style="font-size:11px;margin-top:4px;color:#9ca3af">JPG, PNG, WEBP — Max 10MB</p>
    </div>
    ${currentUrl ? `<div class="img-preview" id="preview-${id}"><img src="${currentUrl}" alt="Preview"></div>` : `<div class="img-preview" id="preview-${id}"></div>`}
    <input type="hidden" id="img-url-${id}" value="${currentUrl}">
  `;
}

window.handleFileSelect = async function(id) {
  const file = document.getElementById(`file-${id}`).files[0];
  if (!file) return;
  const area = document.getElementById(`upload-area-${id}`);
  area.innerHTML = `<div style="padding:12px;color:#6b7280;font-size:13px"><i class="fas fa-spinner fa-spin"></i> Uploading...</div>`;
  try {
    const url = await uploadImage(file);
    document.getElementById(`img-url-${id}`).value = url;
    document.getElementById(`preview-${id}`).innerHTML = `<img src="${url}" alt="Preview">`;
    area.innerHTML = `<input type="file" accept="image/*" id="file-${id}" onchange="handleFileSelect('${id}')"><div class="upload-icon" style="color:#10b981"><i class="fas fa-check-circle"></i></div><p style="color:#10b981;font-size:13px">Uploaded!</p>`;
    showToast('Image uploaded', 'success');
  } catch (e) {
    area.innerHTML = `<input type="file" accept="image/*" id="file-${id}" onchange="handleFileSelect('${id}')"><div class="upload-icon" style="color:#dc2626"><i class="fas fa-exclamation-circle"></i></div><p style="color:#dc2626;font-size:13px">${e.message}</p>`;
  }
};

// ── Star rating helper ─────────────────────────────────────────────────────────
function starRatingHtml(id, current = 5) {
  return `<div class="star-rating" id="stars-${id}">
    ${[1,2,3,4,5].map(n => `<span data-v="${n}" class="${n <= current ? 'active' : ''}" onclick="setStars('${id}',${n})">★</span>`).join('')}
  </div><input type="hidden" id="rating-${id}" value="${current}">`;
}
window.setStars = function(id, val) {
  document.getElementById(`rating-${id}`).value = val;
  document.querySelectorAll(`#stars-${id} span`).forEach(s => {
    s.classList.toggle('active', Number(s.dataset.v) <= val);
  });
};

// ── Table image cell ──────────────────────────────────────────────────────────
function imgCell(src) {
  if (src && src.trim()) return `<img src="${src}" class="table-img" onerror="this.parentElement.innerHTML='<div class=table-img-placeholder><i class=fas fa-image></i></div>'">`;
  return `<div class="table-img-placeholder"><i class="fas fa-image"></i></div>`;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal(); });

// ── Open add modal ─────────────────────────────────────────────────────────────
function openAddModal(section) {
  const forms = {
    destinations: openDestinationForm,
    packages:     openPackageForm,
    tickets:      openTicketForm,
    blogs:        openBlogForm,
    testimonials: openTestimonialForm,
    partners:     openPartnerForm,
  };
  forms[section]?.();
}

// ══════════════════════════════════════════════════════════════════════════════
// DESTINATIONS
// ══════════════════════════════════════════════════════════════════════════════
let destinations = [];

async function loadDestinations() {
  destinations = await api('GET', '/destinations') || [];
  const tbody = document.getElementById('tbody-destinations');
  if (!tbody) return;
  if (!destinations.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5"><i class="fas fa-map-marker-alt" style="font-size:24px;color:#e5e7eb;display:block;margin-bottom:8px"></i>No destinations yet. Add your first destination.</td></tr>`; return; }
  tbody.innerHTML = destinations.map(d => `
    <tr>
      <td>${imgCell(d.card_image)}</td>
      <td><strong>${d.destination_name}</strong></td>
      <td><code style="font-size:12px;background:#f3f4f6;padding:2px 8px;border-radius:6px">${d.slug_url}</code></td>
      <td><span class="text-truncate">${d.description || '<span style="color:#d1d5db">—</span>'}</span></td>
      <td><div class="table-actions">
        <button class="btn-sm btn-edit" onclick="editDestination(${d.destination_id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteDestination(${d.destination_id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openDestinationForm(d = null) {
  openModal(d ? 'Edit Destination' : 'Add Destination', `
    <div class="form-group"><label>Destination Name *</label><input id="d-name" value="${d?.destination_name||''}" placeholder="e.g. Dubai"></div>
    <div class="form-group"><label>Card Image</label>${createImageUpload('d-card', d?.card_image||'')}</div>
    <div class="form-group"><label>Inner/Banner Image</label>${createImageUpload('d-inner', d?.inner_image||'')}</div>
    <div class="form-group"><label>Description</label><textarea id="d-desc" placeholder="Short destination description">${d?.description||''}</textarea></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveDestination(${d?.destination_id||'null'})"><i class="fas fa-save"></i> ${d ? 'Update' : 'Save'}</button>
    </div>`);
}

window.editDestination = function(id) {
  const d = destinations.find(x => x.destination_id === id);
  if (d) openDestinationForm(d);
};

window.saveDestination = async function(id) {
  const body = {
    destination_name: document.getElementById('d-name').value.trim(),
    card_image: document.getElementById('img-url-d-card').value,
    inner_image: document.getElementById('img-url-d-inner').value,
    description: document.getElementById('d-desc').value.trim()
  };
  if (!body.destination_name) { showToast('Name is required', 'error'); return; }
  const res = id ? await api('PUT', `/destinations/${id}`, body) : await api('POST', '/destinations', body);
  if (res?.error) { showToast(res.error, 'error'); return; }
  showToast(id ? 'Destination updated!' : 'Destination added!', 'success');
  closeModal(); loadDestinations(); loadDashboard();
};

window.deleteDestination = async function(id) {
  if (!confirm('Delete this destination?')) return;
  await api('DELETE', `/destinations/${id}`);
  showToast('Deleted', 'success'); loadDestinations(); loadDashboard();
};

document.getElementById('btn-add-destination')?.addEventListener('click', () => openDestinationForm());

// ══════════════════════════════════════════════════════════════════════════════
// PACKAGES
// ══════════════════════════════════════════════════════════════════════════════
let packages = [];

async function loadPackages() {
  packages = await api('GET', '/packages') || [];
  const tbody = document.getElementById('tbody-packages');
  if (!tbody) return;
  if (!packages.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6"><i class="fas fa-suitcase" style="font-size:24px;color:#e5e7eb;display:block;margin-bottom:8px"></i>No packages yet. Add your first package.</td></tr>`; return; }
  const typeClass = { package:'badge-package', curated:'badge-curated', honeymoon:'badge-honeymoon', 'fixed-departure':'badge-fixed' };
  tbody.innerHTML = packages.map(p => `
    <tr>
      <td>${imgCell(p.card_image)}</td>
      <td><strong>${p.package_name}</strong></td>
      <td>${p.nights||'—'}N / ${p.days||'—'}D</td>
      <td>${p.amount ? '₹ ' + Number(p.amount).toLocaleString('en-IN') : '<span style="color:#d1d5db">—</span>'}</td>
      <td><span class="badge ${typeClass[p.type]||'badge-package'}">${p.type||'package'}</span></td>
      <td><div class="table-actions">
        <button class="btn-sm btn-edit" onclick="editPackage(${p.package_id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn-sm btn-delete" onclick="deletePackage(${p.package_id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function getDestOptions(selected = null) {
  return `<option value="">— No Destination —</option>` + destinations.map(d => `<option value="${d.destination_id}" ${selected == d.destination_id ? 'selected' : ''}>${d.destination_name}</option>`).join('');
}

window.addItineraryDay = function(title = '', desc = '') {
  const container = document.getElementById('itinerary-days-container');
  if (!container) return;
  const currentRows = container.querySelectorAll('.itinerary-day-row');
  if (currentRows.length >= 15) {
    showToast('Maximum 15 itinerary days allowed', 'error');
    return;
  }
  const nextNum = currentRows.length + 1;
  const div = document.createElement('div');
  div.className = 'itinerary-day-row border border-gray-200 rounded-xl p-3.5 mb-3 bg-gray-50/70 relative';
  div.innerHTML = `
    <div class="flex items-center justify-between mb-2">
      <span class="font-bold text-xs uppercase tracking-wider text-red-600">Day <span class="day-num">${nextNum}</span></span>
      <button type="button" class="text-red-500 hover:text-red-700 text-xs font-bold bg-transparent border-0 cursor-pointer" onclick="removeItineraryDay(this)">
        <i class="fas fa-trash-alt"></i> Delete
      </button>
    </div>
    <div class="form-group mb-2">
      <label class="text-xs font-bold text-gray-700">Day Title / Header</label>
      <input class="itinerary-day-title" value="${title ? title.replace(/"/g, '&quot;') : `Day ${nextNum}: Schedule`}" placeholder="e.g. Day ${nextNum}: Arrival & Dhow Cruise">
    </div>
    <div class="form-group mb-0">
      <label class="text-xs font-bold text-gray-700">Day Schedule & Details</label>
      <textarea class="itinerary-day-desc" rows="2" placeholder="Activities, sightseeing, and schedule for Day ${nextNum}...">${desc || ''}</textarea>
    </div>`;
  container.appendChild(div);
  reindexItineraryDays();
};

window.removeItineraryDay = function(btn) {
  const row = btn.closest('.itinerary-day-row');
  if (row) {
    row.remove();
    reindexItineraryDays();
  }
};

function reindexItineraryDays() {
  const rows = document.querySelectorAll('#itinerary-days-container .itinerary-day-row');
  rows.forEach((r, idx) => {
    const numSpan = r.querySelector('.day-num');
    if (numSpan) numSpan.textContent = idx + 1;
  });
}

function openPackageForm(p = null) {
  const bannerImgs = Array.isArray(p?.banner_images) ? p.banner_images : 
    (typeof p?.banner_images === 'string' ? (JSON.parse(p.banner_images || '[]') || []) : []);
  const b1 = bannerImgs[0] || p?.banner_image || p?.inner_image || p?.card_image || '';
  const b2 = bannerImgs[1] || '';
  const b3 = bannerImgs[2] || '';
  const b4 = bannerImgs[3] || '';

  openModal(p ? 'Edit Package' : 'Add Package', `
    <div class="form-group"><label>Package Name *</label><input id="p-name" value="${p?.package_name||''}" placeholder="e.g. Extravagant Dubai Luxury Tour"></div>
    <div class="form-row-two">
      <div class="form-group"><label>Nights</label><input id="p-nights" type="number" value="${p?.nights||''}" placeholder="4"></div>
      <div class="form-group"><label>Days</label><input id="p-days" type="number" value="${p?.days||''}" placeholder="5"></div>
    </div>
    <div class="form-row-two">
      <div class="form-group"><label>Hotel Type</label><input id="p-hotel" value="${p?.hotel_type||'4 Star Hotel'}" placeholder="e.g. 4 Star Hotel / 5-Star Luxury"></div>
      <div class="form-group"><label>Number of Sightseeings</label><input id="p-activities" value="${p?.activities_count||'5 Included'}" placeholder="e.g. 5 Sightseeings"></div>
    </div>
    <div class="form-row-two">
      <div class="form-group"><label>Price (₹)</label><input id="p-amount" type="number" value="${p?.amount||''}" placeholder="25000"></div>
      <div class="form-group"><label>Type</label>
        <select id="p-type">
          <option value="package" ${p?.type==='package'?'selected':''}>Package</option>
          <option value="curated" ${p?.type==='curated'?'selected':''}>Curated Itinerary</option>
          <option value="honeymoon" ${p?.type==='honeymoon'?'selected':''}>Honeymoon</option>
          <option value="fixed-departure" ${p?.type==='fixed-departure'?'selected':''}>Fixed Departure</option>
        </select>
      </div>
    </div>
    <div class="form-row-two">
      <div class="form-group"><label>Transfers Spec</label><input id="p-transfers" value="${p?.transfers||'Included'}" placeholder="e.g. Airport Transfers Included"></div>
      <div class="form-group"><label>Destination</label><select id="p-dest">${getDestOptions(p?.destination_id)}</select></div>
    </div>
    <div class="form-group"><label>Card Image (Grid Thumbnail)</label>${createImageUpload('p-card', p?.card_image||'')}</div>
    
    <!-- Up to 4 Banner Slider Images -->
    <div class="form-group" style="margin-top:12px; margin-bottom:12px">
      <label style="font-weight:bold; color:#1f2937">Banner Slider Images (Up to 4 Images - Auto slides every 2s on website)</label>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:6px">
        <div><label style="font-size:11px; font-weight:bold; color:#4b5563">Banner 1 (Main Cover)</label>${createImageUpload('p-banner-1', b1)}</div>
        <div><label style="font-size:11px; font-weight:bold; color:#4b5563">Banner 2 (Optional Slide 2)</label>${createImageUpload('p-banner-2', b2)}</div>
        <div><label style="font-size:11px; font-weight:bold; color:#4b5563">Banner 3 (Optional Slide 3)</label>${createImageUpload('p-banner-3', b3)}</div>
        <div><label style="font-size:11px; font-weight:bold; color:#4b5563">Banner 4 (Optional Slide 4)</label>${createImageUpload('p-banner-4', b4)}</div>
      </div>
    </div>

    <div class="form-group"><label>Overview</label><textarea id="p-overview" placeholder="Package overview...">${p?.overview||''}</textarea></div>
    
    <!-- Multi-Day Itinerary Builder (Up to 15 Days) -->
    <div class="form-group">
      <label class="flex items-center justify-between font-bold text-gray-800 mb-1">
        <span>Day-by-Day Itinerary (Up to 15 Days)</span>
        <span class="text-xs text-gray-500 font-normal">Each day will display as a separate box on the website</span>
      </label>
      <div id="itinerary-days-container" class="mt-2"></div>
      <button type="button" class="btn-secondary" style="width:100%; padding:10px; border:1px dashed #dc2626; color:#dc2626; background:#fef2f2; border-radius:12px; font-weight:bold; cursor:pointer; margin-top:6px" onclick="addItineraryDay()">
        <i class="fas fa-plus-circle"></i> + Add Next Day Box (Up to 15 Days)
      </button>
    </div>

    <div class="form-row-two">
      <div class="form-group"><label>Inclusions (Features - comma or line separated)</label><textarea id="p-inclusions" rows="3" placeholder="Flight, 4-Star Hotel, Meals, Transfers, Sightseeing...">${p?.inclusions||''}</textarea></div>
      <div class="form-group"><label>Exclusions (comma or line separated)</label><textarea id="p-exclusions" rows="3" placeholder="Personal expenses, Travel Insurance...">${p?.exclusions||''}</textarea></div>
    </div>
    <div class="form-group"><label>Terms & Conditions (Booking Policy & Rules)</label><textarea id="p-terms" rows="3" placeholder="Enter terms & conditions, cancellation policy, booking rules...">${p?.terms||''}</textarea></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="savePackage(${p?.package_id||'null'})"><i class="fas fa-save"></i> ${p ? 'Update' : 'Save'}</button>
    </div>`);

  // Populate existing days or initial day
  const rawItinerary = p?.itinerary;
  let existingDays = p?.itinerary_days || [];
  if (!existingDays.length && rawItinerary) {
    try {
      existingDays = JSON.parse(rawItinerary);
    } catch {
      const lines = rawItinerary.split('\n').map(s => s.trim()).filter(Boolean);
      existingDays = lines.map((l, i) => ({ day: i + 1, title: l.startsWith('Day') ? l : `Day ${i + 1}`, description: l }));
    }
  }

  if (existingDays && existingDays.length) {
    existingDays.forEach(d => addItineraryDay(d.title || d.name, d.description || d.desc || d.text));
  } else {
    addItineraryDay('Day 1: Arrival & Hotel Check-in', '');
  }
}

window.editPackage = function(id) { const p = packages.find(x => x.package_id === id); if (p) openPackageForm(p); };

window.savePackage = async function(id) {
  const itineraryDays = [];
  document.querySelectorAll('#itinerary-days-container .itinerary-day-row').forEach((row, idx) => {
    const title = row.querySelector('.itinerary-day-title')?.value.trim();
    const desc = row.querySelector('.itinerary-day-desc')?.value.trim();
    if (title || desc) {
      itineraryDays.push({
        day: idx + 1,
        title: title || `Day ${idx + 1}`,
        description: desc || ''
      });
    }
  });

  const b1 = document.getElementById('img-url-p-banner-1')?.value || '';
  const b2 = document.getElementById('img-url-p-banner-2')?.value || '';
  const b3 = document.getElementById('img-url-p-banner-3')?.value || '';
  const b4 = document.getElementById('img-url-p-banner-4')?.value || '';
  const bannerList = [b1, b2, b3, b4].filter(Boolean);

  const body = {
    package_name: document.getElementById('p-name').value.trim(),
    nights: document.getElementById('p-nights').value,
    days: document.getElementById('p-days').value,
    hotel_type: document.getElementById('p-hotel').value.trim() || '4 Star Hotel',
    activities_count: document.getElementById('p-activities').value.trim() || '5 Included',
    transfers: document.getElementById('p-transfers').value.trim() || 'Included',
    amount: document.getElementById('p-amount').value,
    type: document.getElementById('p-type').value,
    destination_id: document.getElementById('p-dest').value || null,
    card_image: document.getElementById('img-url-p-card').value,
    banner_image: b1,
    banner_images: bannerList,
    overview: document.getElementById('p-overview').value.trim(),
    itinerary: JSON.stringify(itineraryDays),
    inclusions: document.getElementById('p-inclusions').value.trim(),
    exclusions: document.getElementById('p-exclusions').value.trim(),
    terms: document.getElementById('p-terms').value.trim(),
  };
  if (!body.package_name) { showToast('Package name required', 'error'); return; }
  const res = id ? await api('PUT', `/packages/${id}`, body) : await api('POST', '/packages', body);
  if (res?.error) { showToast(res.error, 'error'); return; }
  showToast(id ? 'Package updated!' : 'Package added!', 'success');
  closeModal(); loadPackages(); loadDashboard();
};

window.deletePackage = async function(id) {
  if (!confirm('Delete this package?')) return;
  await api('DELETE', `/packages/${id}`);
  showToast('Deleted', 'success'); loadPackages(); loadDashboard();
};

document.getElementById('btn-add-package')?.addEventListener('click', () => { if (!destinations.length) loadDestinations().then(() => openPackageForm()); else openPackageForm(); });

// ══════════════════════════════════════════════════════════════════════════════
// TICKETS
// ══════════════════════════════════════════════════════════════════════════════
let tickets = [];

async function loadTickets() {
  tickets = await api('GET', '/tickets') || [];
  const tbody = document.getElementById('tbody-tickets');
  if (!tbody) return;
  if (!tickets.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5"><i class="fas fa-ticket-alt" style="font-size:24px;color:#e5e7eb;display:block;margin-bottom:8px"></i>No tickets yet.</td></tr>`; return; }
  tbody.innerHTML = tickets.map(t => `
    <tr>
      <td>${imgCell(t.card_image)}</td>
      <td><strong>${t.title}</strong>${t.short_title ? `<br><span style="font-size:12px;color:#9ca3af">${t.short_title}</span>` : ''}</td>
      <td>${t.destination_name || '<span style="color:#d1d5db">—</span>'}</td>
      <td>${t.display_amount ? '₹ ' + Number(t.display_amount).toLocaleString('en-IN') : '<span style="color:#d1d5db">—</span>'}</td>
      <td><div class="table-actions">
        <button class="btn-sm btn-edit" onclick="editTicket(${t.ticket_id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteTicket(${t.ticket_id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openTicketForm(t = null) {
  openModal(t ? 'Edit Ticket' : 'Add Ticket', `
    <div class="form-group"><label>Title *</label><input id="t-title" value="${t?.title||''}" placeholder="e.g. Burj Khalifa 124th Floor"></div>
    <div class="form-group"><label>Short Title</label><input id="t-short" value="${t?.short_title||''}" placeholder="Short display name"></div>
    <div class="form-row-two">
      <div class="form-group"><label>Price (₹)</label><input id="t-price" type="number" value="${t?.display_amount||''}" placeholder="1500"></div>
      <div class="form-group"><label>Destination</label><input id="t-dest" value="${t?.destination_name||''}" placeholder="e.g. Dubai"></div>
    </div>
    <div class="form-group"><label>Card Image</label>${createImageUpload('t-card', t?.card_image||'')}</div>
    <div class="form-group"><label>Description</label><textarea id="t-desc" placeholder="Ticket description...">${t?.description||''}</textarea></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveTicket(${t?.ticket_id||'null'})"><i class="fas fa-save"></i> ${t ? 'Update' : 'Save'}</button>
    </div>`);
}

window.editTicket = function(id) { const t = tickets.find(x => x.ticket_id === id); if (t) openTicketForm(t); };

window.saveTicket = async function(id) {
  const body = {
    title: document.getElementById('t-title').value.trim(),
    short_title: document.getElementById('t-short').value.trim(),
    display_amount: document.getElementById('t-price').value,
    destination_name: document.getElementById('t-dest').value.trim(),
    card_image: document.getElementById('img-url-t-card').value,
    description: document.getElementById('t-desc').value.trim(),
  };
  if (!body.title) { showToast('Title required', 'error'); return; }
  const res = id ? await api('PUT', `/tickets/${id}`, body) : await api('POST', '/tickets', body);
  if (res?.error) { showToast(res.error, 'error'); return; }
  showToast(id ? 'Ticket updated!' : 'Ticket added!', 'success');
  closeModal(); loadTickets(); loadDashboard();
};

window.deleteTicket = async function(id) {
  if (!confirm('Delete this ticket?')) return;
  await api('DELETE', `/tickets/${id}`);
  showToast('Deleted', 'success'); loadTickets(); loadDashboard();
};

document.getElementById('btn-add-ticket')?.addEventListener('click', () => openTicketForm());

// ══════════════════════════════════════════════════════════════════════════════
// BLOGS
// ══════════════════════════════════════════════════════════════════════════════
let blogs = [];

async function loadBlogs() {
  blogs = await api('GET', '/blogs') || [];
  const tbody = document.getElementById('tbody-blogs');
  if (!tbody) return;
  if (!blogs.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5"><i class="fas fa-blog" style="font-size:24px;color:#e5e7eb;display:block;margin-bottom:8px"></i>No blogs yet.</td></tr>`; return; }
  tbody.innerHTML = blogs.map(b => `
    <tr>
      <td>${imgCell(b.card_image)}</td>
      <td><strong>${b.title}</strong></td>
      <td><code style="font-size:12px;background:#f3f4f6;padding:2px 8px;border-radius:6px">${b.slug_url}</code></td>
      <td>${b.date || '<span style="color:#d1d5db">—</span>'}</td>
      <td><div class="table-actions">
        <button class="btn-sm btn-edit" onclick="editBlog(${b.blog_id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteBlog(${b.blog_id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openBlogForm(b = null) {
  const today = new Date().toISOString().split('T')[0];
  openModal(b ? 'Edit Blog' : 'Add Blog', `
    <div class="form-group"><label>Title *</label><input id="b-title" value="${b?.title||''}" placeholder="Blog post title"></div>
    <div class="form-group"><label>Date</label><input id="b-date" type="date" value="${b?.date||today}"></div>
    <div class="form-group"><label>Card Image</label>${createImageUpload('b-card', b?.card_image||'')}</div>
    <div class="form-group"><label>Content</label><textarea id="b-content" rows="6" placeholder="Blog content here...">${b?.content||''}</textarea></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveBlog(${b?.blog_id||'null'})"><i class="fas fa-save"></i> ${b ? 'Update' : 'Save'}</button>
    </div>`);
}

window.editBlog = function(id) { const b = blogs.find(x => x.blog_id === id); if (b) openBlogForm(b); };

window.saveBlog = async function(id) {
  const body = {
    title: document.getElementById('b-title').value.trim(),
    date: document.getElementById('b-date').value,
    card_image: document.getElementById('img-url-b-card').value,
    content: document.getElementById('b-content').value.trim(),
  };
  if (!body.title) { showToast('Title required', 'error'); return; }
  const res = id ? await api('PUT', `/blogs/${id}`, body) : await api('POST', '/blogs', body);
  if (res?.error) { showToast(res.error, 'error'); return; }
  showToast(id ? 'Blog updated!' : 'Blog added!', 'success');
  closeModal(); loadBlogs(); loadDashboard();
};

window.deleteBlog = async function(id) {
  if (!confirm('Delete this blog?')) return;
  await api('DELETE', `/blogs/${id}`);
  showToast('Deleted', 'success'); loadBlogs(); loadDashboard();
};

document.getElementById('btn-add-blog')?.addEventListener('click', () => openBlogForm());

// ══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ══════════════════════════════════════════════════════════════════════════════
let testimonials = [];

async function loadTestimonials() {
  testimonials = await api('GET', '/testimonials') || [];
  const tbody = document.getElementById('tbody-testimonials');
  if (!tbody) return;
  if (!testimonials.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5"><i class="fas fa-star" style="font-size:24px;color:#e5e7eb;display:block;margin-bottom:8px"></i>No testimonials yet.</td></tr>`; return; }
  tbody.innerHTML = testimonials.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td>${t.location || '<span style="color:#d1d5db">—</span>'}</td>
      <td>${'★'.repeat(t.rating||5)}</td>
      <td><span class="text-truncate">${t.feedback || '<span style="color:#d1d5db">—</span>'}</span></td>
      <td><div class="table-actions">
        <button class="btn-sm btn-edit" onclick="editTestimonial(${t.testimonial_id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteTestimonial(${t.testimonial_id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openTestimonialForm(t = null) {
  openModal(t ? 'Edit Testimonial' : 'Add Testimonial', `
    <div class="form-row-two">
      <div class="form-group"><label>Name *</label><input id="r-name" value="${t?.name||''}" placeholder="John Doe"></div>
      <div class="form-group"><label>Location</label><input id="r-loc" value="${t?.location||''}" placeholder="Dubai, UAE"></div>
    </div>
    <div class="form-group"><label>Rating</label>${starRatingHtml('r', t?.rating||5)}</div>
    <div class="form-group"><label>Feedback</label><textarea id="r-feedback" rows="4" placeholder="Customer review...">${t?.feedback||''}</textarea></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveTestimonial(${t?.testimonial_id||'null'})"><i class="fas fa-save"></i> ${t ? 'Update' : 'Save'}</button>
    </div>`);
}

window.editTestimonial = function(id) { const t = testimonials.find(x => x.testimonial_id === id); if (t) openTestimonialForm(t); };

window.saveTestimonial = async function(id) {
  const body = {
    name: document.getElementById('r-name').value.trim(),
    location: document.getElementById('r-loc').value.trim(),
    rating: document.getElementById('rating-r').value,
    feedback: document.getElementById('r-feedback').value.trim(),
  };
  if (!body.name) { showToast('Name required', 'error'); return; }
  const res = id ? await api('PUT', `/testimonials/${id}`, body) : await api('POST', '/testimonials', body);
  if (res?.error) { showToast(res.error, 'error'); return; }
  showToast(id ? 'Updated!' : 'Added!', 'success');
  closeModal(); loadTestimonials(); loadDashboard();
};

window.deleteTestimonial = async function(id) {
  if (!confirm('Delete this testimonial?')) return;
  await api('DELETE', `/testimonials/${id}`);
  showToast('Deleted', 'success'); loadTestimonials(); loadDashboard();
};

document.getElementById('btn-add-testimonial')?.addEventListener('click', () => openTestimonialForm());

// ══════════════════════════════════════════════════════════════════════════════
// PARTNERS
// ══════════════════════════════════════════════════════════════════════════════
let partners = [];

async function loadPartners() {
  partners = await api('GET', '/partners') || [];
  const tbody = document.getElementById('tbody-partners');
  if (!tbody) return;
  if (!partners.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="3"><i class="fas fa-handshake" style="font-size:24px;color:#e5e7eb;display:block;margin-bottom:8px"></i>No partners yet.</td></tr>`; return; }
  tbody.innerHTML = partners.map(p => `
    <tr>
      <td>${imgCell(p.image)}</td>
      <td><strong>${p.name}</strong></td>
      <td><div class="table-actions">
        <button class="btn-sm btn-edit" onclick="editPartner(${p.partner_id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn-sm btn-delete" onclick="deletePartner(${p.partner_id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openPartnerForm(p = null) {
  openModal(p ? 'Edit Partner' : 'Add Partner', `
    <div class="form-group"><label>Partner Name *</label><input id="pr-name" value="${p?.name||''}" placeholder="e.g. Emirates Airlines"></div>
    <div class="form-group"><label>Logo Image</label>${createImageUpload('pr-img', p?.image||'')}</div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="savePartner(${p?.partner_id||'null'})"><i class="fas fa-save"></i> ${p ? 'Update' : 'Save'}</button>
    </div>`);
}

window.editPartner = function(id) { const p = partners.find(x => x.partner_id === id); if (p) openPartnerForm(p); };

window.savePartner = async function(id) {
  const body = {
    name: document.getElementById('pr-name').value.trim(),
    image: document.getElementById('img-url-pr-img').value,
  };
  if (!body.name) { showToast('Name required', 'error'); return; }
  const res = id ? await api('PUT', `/partners/${id}`, body) : await api('POST', '/partners', body);
  if (res?.error) { showToast(res.error, 'error'); return; }
  showToast(id ? 'Updated!' : 'Added!', 'success');
  closeModal(); loadPartners(); loadDashboard();
};

window.deletePartner = async function(id) {
  if (!confirm('Delete this partner?')) return;
  await api('DELETE', `/partners/${id}`);
  showToast('Deleted', 'success'); loadPartners(); loadDashboard();
};

document.getElementById('btn-add-partner')?.addEventListener('click', () => openPartnerForm());

// ══════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════════════════════════════
document.getElementById('form-change-password')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('settings-msg');
  const np = document.getElementById('s-new-pass').value;
  const cp = document.getElementById('s-conf-pass').value;
  if (np !== cp) { msg.textContent = 'Passwords do not match'; msg.className = 'settings-msg error'; return; }
  const res = await api('POST', '/auth/change-password', {
    currentPassword: document.getElementById('s-cur-pass').value,
    newPassword: np
  });
  if (res?.error) { msg.textContent = res.error; msg.className = 'settings-msg error'; }
  else { msg.textContent = 'Password updated successfully!'; msg.className = 'settings-msg success'; }
});

// ══════════════════════════════════════════════════════════════════════════════
// ATTRACTIONS
// ══════════════════════════════════════════════════════════════════════════════
let attractions = [];

async function loadAttractions() {
  attractions = await api('GET', '/attractions') || [];
  const tbody = document.getElementById('tbody-attractions');
  if (!tbody) return;
  if (!attractions.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6"><i class="fas fa-camera" style="font-size:24px;color:#e5e7eb;display:block;margin-bottom:8px"></i>No attractions found.</td></tr>`;
    return;
  }
  tbody.innerHTML = attractions.map(a => `
    <tr>
      <td>${imgCell(a.card_image || a.banner_image)}</td>
      <td><strong>${a.name || a.title}</strong></td>
      <td><span class="badge" style="background:#e0f2fe;color:#0369a1;font-weight:bold;padding:4px 10px;border-radius:12px">${a.experience_type || 'Cultural'}</span></td>
      <td>${a.duration || '2-3 Hours'}</td>
      <td>${a.price || a.amount ? `₹ ${Number(a.price || a.amount).toLocaleString('en-IN')}` : 'Free / Included'}</td>
      <td><div class="table-actions">
        <button class="btn-sm btn-edit" onclick="editAttraction(${a.attraction_id})"><i class="fas fa-pen"></i> Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteAttraction(${a.attraction_id})"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`).join('');
}

function openAttractionForm(a = null) {
  openModal(a ? 'Edit Attraction' : 'Add Attraction', `
    <div class="form-group"><label>Attraction Name *</label><input id="a-name" value="${a?.name||a?.title||''}" placeholder="e.g. Burj Khalifa Observation Deck & Sky Views"></div>
    <div class="form-row-two">
      <div class="form-group"><label>Experience Type *</label>
        <select id="a-exp">
          <option value="Adventure" ${a?.experience_type==='Adventure'?'selected':''}>Adventure</option>
          <option value="Cultural" ${a?.experience_type==='Cultural'?'selected':''}>Cultural</option>
          <option value="Luxury" ${a?.experience_type==='Luxury'?'selected':''}>Luxury</option>
          <option value="Sightseeing" ${a?.experience_type==='Sightseeing'?'selected':''}>Sightseeing</option>
          <option value="Nature" ${a?.experience_type==='Nature'?'selected':''}>Nature</option>
          <option value="Family" ${a?.experience_type==='Family'?'selected':''}>Family</option>
        </select>
      </div>
      <div class="form-group"><label>Duration</label><input id="a-duration" value="${a?.duration||'2-3 Hours'}" placeholder="e.g. 2-3 Hours, Half Day, Full Day"></div>
    </div>
    <div class="form-row-two">
      <div class="form-group"><label>Destination / Location</label><input id="a-dest" value="${a?.destination_name||'Dubai, UAE'}" placeholder="e.g. Dubai, UAE"></div>
      <div class="form-group"><label>Ticket Price (₹)</label><input id="a-price" type="number" value="${a?.price||a?.amount||''}" placeholder="3500"></div>
    </div>
    <div class="form-group"><label>Included Items (comma or line separated)</label><textarea id="a-included" rows="2" placeholder="e.g. Timed Entry Ticket, Access to Observation Deck, Soft Drinks">${a?.included||''}</textarea></div>
    <div class="form-group"><label>Card Image (Thumbnail)</label>${createImageUpload('a-card', a?.card_image||'')}</div>
    <div class="form-group"><label>Banner Image (Detail Page Header Cover)</label>${createImageUpload('a-banner', a?.banner_image||a?.card_image||'')}</div>
    <div class="form-group"><label>Description / Overview</label><textarea id="a-desc" rows="4" placeholder="Detailed description of attraction & experiences...">${a?.description||a?.overview||''}</textarea></div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveAttraction(${a?.attraction_id||'null'})"><i class="fas fa-save"></i> ${a ? 'Update' : 'Save'}</button>
    </div>`);
}

window.editAttraction = function(id) { const a = attractions.find(x => x.attraction_id === id); if (a) openAttractionForm(a); };

window.saveAttraction = async function(id) {
  const body = {
    name: document.getElementById('a-name').value.trim(),
    experience_type: document.getElementById('a-exp').value,
    duration: document.getElementById('a-duration').value.trim() || '2-3 Hours',
    destination_name: document.getElementById('a-dest').value.trim() || '',
    price: document.getElementById('a-price').value,
    included: document.getElementById('a-included').value.trim(),
    card_image: document.getElementById('img-url-a-card').value,
    banner_image: document.getElementById('img-url-a-banner').value || document.getElementById('img-url-a-card').value,
    description: document.getElementById('a-desc').value.trim(),
  };
  if (!body.name) { showToast('Attraction name required', 'error'); return; }
  const res = id ? await api('PUT', `/attractions/${id}`, body) : await api('POST', '/attractions', body);
  if (res?.error) { showToast(res.error, 'error'); return; }
  showToast(id ? 'Updated!' : 'Added!', 'success');
  closeModal(); loadAttractions(); loadDashboard();
};

window.deleteAttraction = async function(id) {
  if (!confirm('Delete this attraction?')) return;
  await api('DELETE', `/attractions/${id}`);
  showToast('Deleted', 'success'); loadAttractions(); loadDashboard();
};

document.getElementById('btn-add-attraction')?.addEventListener('click', () => openAttractionForm());

// ── Section loaders map ───────────────────────────────────────────────────────
const loaders = {
  dashboard:    loadDashboard,
  destinations: loadDestinations,
  packages:     () => { loadDestinations(); loadPackages(); },
  attractions:  loadAttractions,
  tickets:      loadTickets,
  blogs:        loadBlogs,
  testimonials: loadTestimonials,
  partners:     loadPartners,
  settings:     () => {},
};

// ── Initial load ──────────────────────────────────────────────────────────────
navigateTo('dashboard');

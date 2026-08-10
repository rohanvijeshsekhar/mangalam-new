/**
 * admin.js — Mangalam Travel & Tours Admin Panel Logic
 * Handles: Auth, Navigation, CRUD for all data types, Image upload, Modals
 */

const API_ORIGIN = window.API_ORIGIN || (
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000'
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
  ['destinations','packages','tickets','blogs','testimonials','partners'].forEach(k => {
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

function openPackageForm(p = null) {
  openModal(p ? 'Edit Package' : 'Add Package', `
    <div class="form-group"><label>Package Name *</label><input id="p-name" value="${p?.package_name||''}" placeholder="e.g. Extravagant Dubai Luxury Tour"></div>
    <div class="form-row-two">
      <div class="form-group"><label>Nights</label><input id="p-nights" type="number" value="${p?.nights||''}" placeholder="4"></div>
      <div class="form-group"><label>Days</label><input id="p-days" type="number" value="${p?.days||''}" placeholder="5"></div>
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
    <div class="form-group"><label>Destination</label><select id="p-dest">${getDestOptions(p?.destination_id)}</select></div>
    <div class="form-group"><label>Card Image</label>${createImageUpload('p-card', p?.card_image||'')}</div>
    <div class="form-group"><label>Overview</label><textarea id="p-overview" placeholder="Package overview...">${p?.overview||''}</textarea></div>
    <div class="form-group"><label>Itinerary</label><textarea id="p-itinerary" rows="4" placeholder="Day 1: Arrival...">${p?.itinerary||''}</textarea></div>
    <div class="form-row-two">
      <div class="form-group"><label>Inclusions</label><textarea id="p-inclusions" rows="3" placeholder="Hotel, meals...">${p?.inclusions||''}</textarea></div>
      <div class="form-group"><label>Exclusions</label><textarea id="p-exclusions" rows="3" placeholder="Airfare, visa...">${p?.exclusions||''}</textarea></div>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="savePackage(${p?.package_id||'null'})"><i class="fas fa-save"></i> ${p ? 'Update' : 'Save'}</button>
    </div>`);
}

window.editPackage = function(id) { const p = packages.find(x => x.package_id === id); if (p) openPackageForm(p); };

window.savePackage = async function(id) {
  const body = {
    package_name: document.getElementById('p-name').value.trim(),
    nights: document.getElementById('p-nights').value,
    days: document.getElementById('p-days').value,
    amount: document.getElementById('p-amount').value,
    type: document.getElementById('p-type').value,
    destination_id: document.getElementById('p-dest').value || null,
    card_image: document.getElementById('img-url-p-card').value,
    overview: document.getElementById('p-overview').value.trim(),
    itinerary: document.getElementById('p-itinerary').value.trim(),
    inclusions: document.getElementById('p-inclusions').value.trim(),
    exclusions: document.getElementById('p-exclusions').value.trim(),
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

// ── Section loaders map ───────────────────────────────────────────────────────
const loaders = {
  dashboard:    loadDashboard,
  destinations: loadDestinations,
  packages:     () => { loadDestinations(); loadPackages(); },
  tickets:      loadTickets,
  blogs:        loadBlogs,
  testimonials: loadTestimonials,
  partners:     loadPartners,
  settings:     () => {},
};

// ── Initial load ──────────────────────────────────────────────────────────────
navigateTo('dashboard');

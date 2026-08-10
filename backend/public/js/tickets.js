/**
 * tickets.js — Tickets listing page
 */
document.addEventListener('DOMContentLoaded', async () => {
  const [dests, tickets] = await Promise.all([
    MT.apiGet('/api/destinations'),
    MT.apiGet('/api/tickets')
  ]);

  const bar = document.getElementById('dest-filter-bar');
  if (bar && dests) {
    dests.forEach(d => {
      const btn = document.createElement('button');
      btn.className = 'dest-filter-btn px-4 py-2 rounded-full text-sm font-dm-sans border border-gray-300 hover:border-gray-800 transition-colors text-gray-600';
      btn.dataset.destId = d.destination_id || '';
      btn.dataset.slug = d.slug_url || d.slug || '';
      btn.textContent = d.destination_name || d.name || '';
      bar.appendChild(btn);
    });
  }

  const slugParam = MT.qParam('slug');
  let activeDestId = '';
  if (slugParam && dests) {
    const m = dests.find(d => (d.slug_url || d.slug) === slugParam);
    if (m) activeDestId = m.destination_id;
  }
  if (activeDestId) setActive(bar?.querySelector(`[data-dest-id="${activeDestId}"]`));

  renderTickets(tickets, activeDestId);

  bar?.addEventListener('click', e => {
    const btn = e.target.closest('.dest-filter-btn');
    if (!btn) return;
    setActive(btn);
    renderTickets(tickets, btn.dataset.destId);
  });

  function setActive(btn) {
    if (!btn) return;
    bar?.querySelectorAll('.dest-filter-btn').forEach(b => b.className = 'dest-filter-btn px-4 py-2 rounded-full text-sm font-dm-sans border border-gray-300 hover:border-gray-800 transition-colors text-gray-600');
    btn.className = 'dest-filter-btn px-4 py-2 rounded-full text-sm font-dm-sans border-2 border-gray-800 bg-gray-800 text-white transition-colors';
  }

  function renderTickets(list, destId) {
    const grid = document.getElementById('tickets-grid');
    if (!grid) return;
    if (!list || !list.length) { grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-20">No tickets available.</p>'; return; }
    let filtered = list;
    if (destId) filtered = list.filter(t => String(t.destination_id) === String(destId));
    if (!filtered.length) { grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-20">No tickets for this destination.</p>'; return; }
    grid.innerHTML = filtered.map(t => {
      const title = t.title || t.name || '';
      const slug  = t.slug_url || t.slug || '';
      const img   = MT.resolveImg(t.image || t.card_image);
      const price = MT.fmtPrice(t.amount || t.price || t.adult_price);
      const url   = slug ? `/ticket-details?slug=${encodeURIComponent(slug)}` : '#';
      return `<a href="${url}" class="block group rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow bg-white">
        <div class="relative overflow-hidden h-52"><img src="${img}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='/assets/images/logo-color.png'"></div>
        <div class="p-4">
          <h3 class="text-base font-bold font-dm-sans text-gray-800 leading-tight line-clamp-2 mb-2">${title}</h3>
          ${price ? `<div class="text-sm font-semibold text-gray-800">${price}</div>` : ''}
          <div class="mt-3 text-red-500 text-sm font-medium">Book Now →</div>
        </div>
      </a>`;
    }).join('');
  }
});

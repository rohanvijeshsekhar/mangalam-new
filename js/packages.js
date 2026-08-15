/**
 * packages.js — Packages listing & Destination details page
 */
document.addEventListener('DOMContentLoaded', async () => {
  const [dests, allPkgs] = await Promise.all([
    MT.apiGet('/api/destinations'),
    MT.apiGet('/api/packages')
  ]);

  const slugParam   = MT.qParam('slug');
  const typeParam   = MT.qParam('type') || 'package';
  const destIdParam = MT.qParam('destination_id');

  if (typeParam === 'activities' || typeParam === 'activity' || typeParam === 'attraction' || typeParam === 'attractions') {
    const slugSuffix = slugParam ? `?slug=${encodeURIComponent(slugParam)}` : (destIdParam ? `?destination_id=${encodeURIComponent(destIdParam)}` : '');
    window.location.href = `attraction.html${slugSuffix}`;
    return;
  }

  let activeDest = null;
  if (slugParam && dests && dests.length) {
    activeDest = dests.find(d => (d.slug_url || d.slug) === slugParam);
  } else if (destIdParam && dests && dests.length) {
    activeDest = dests.find(d => String(d.destination_id) === String(destIdParam));
  }

  // Update Hero Section
  const heroImg = document.getElementById('dest-hero-img');
  const heroTitle = document.getElementById('dest-hero-title');
  const heroDesc = document.getElementById('dest-hero-desc');
  const destSpan = document.getElementById('dest-span-name');

  if (activeDest) {
    const destName = activeDest.destination_name || activeDest.name || 'Destination';
    const rawInnerImg = activeDest.inner_image || activeDest.Inner_image || activeDest.card_image || '';
    const resolvedImg = MT.resolveImg(rawInnerImg) || './assets/images/bg-img.webp';

    if (heroImg) heroImg.src = resolvedImg;
    if (heroTitle) heroTitle.textContent = destName;
    if (heroDesc) heroDesc.textContent = activeDest.discription || activeDest.description || '';
    if (destSpan) destSpan.textContent = destName;
  } else {
    if (heroImg) heroImg.src = './assets/images/bg-img.webp';
    if (heroTitle) heroTitle.textContent = 'Holiday Packages';
    if (heroDesc) heroDesc.textContent = 'Discover customized tour packages for an unforgettable journey.';
    if (destSpan) destSpan.textContent = '';
  }

  // Build destination filter buttons
  const bar = document.getElementById('dest-filter-bar');
  if (bar && dests && dests.length) {
    dests.forEach(d => {
      const btn = document.createElement('button');
      btn.className = 'dest-filter-btn px-4 py-2 rounded-full text-sm font-dm-sans border border-gray-300 hover:border-gray-800 hover:text-gray-800 transition-colors text-gray-600';
      btn.dataset.slug = d.slug_url || d.slug || '';
      btn.dataset.destId = d.destination_id || '';
      btn.textContent = d.destination_name || d.name || '';
      bar.appendChild(btn);
    });
  }

  let activeDestId = activeDest ? activeDest.destination_id : (destIdParam || '');
  if (activeDestId && bar) {
    const btn = bar.querySelector(`[data-dest-id="${activeDestId}"]`);
    if (btn) setActive(btn);
  }

  // Update Tab Links
  const tabPackages = document.getElementById('tab-packages');
  const tabActivity = document.getElementById('tab-activity');

  function updateTabLinks(slug, destId) {
    const slugSuffix = slug ? `?slug=${encodeURIComponent(slug)}` : (destId ? `?destination_id=${encodeURIComponent(destId)}` : '');
    if (tabPackages) tabPackages.href = `packages.html${slugSuffix ? slugSuffix + '&type=package' : ''}`;
    if (tabActivity) tabActivity.href = `attraction.html${slugSuffix}`;
  }

  updateTabLinks(slugParam, activeDestId);

  renderPackages(allPkgs, activeDestId);

  // Filter click handler
  bar?.addEventListener('click', e => {
    const btn = e.target.closest('.dest-filter-btn');
    if (!btn) return;
    setActive(btn);
    updateTabLinks(btn.dataset.slug, btn.dataset.destId);
    renderPackages(allPkgs, btn.dataset.destId);
  });

  function setActive(btn) {
    bar?.querySelectorAll('.dest-filter-btn').forEach(b => {
      b.className = 'dest-filter-btn px-4 py-2 rounded-full text-sm font-dm-sans border border-gray-300 hover:border-gray-800 hover:text-gray-800 transition-colors text-gray-600';
    });
    btn.className = 'dest-filter-btn px-4 py-2 rounded-full text-sm font-dm-sans border-2 border-gray-800 bg-gray-800 text-white transition-colors';
  }

  function renderPackages(pkgs, destId) {
    const grid = document.getElementById('packages-grid');
    if (!grid) return;
    if (!pkgs || !pkgs.length) { grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-20">No packages available.</p>'; return; }
    let list = pkgs;
    if (destId) list = pkgs.filter(p => String(p.destination_id) === String(destId));
    if (!list.length) { grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-20">No packages for this destination yet.</p>'; return; }
    grid.innerHTML = list.map(p => R.packageCard(p)).join('');
  }
});

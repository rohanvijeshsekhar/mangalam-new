/**
 * listing.js — Shared package listing page loader
 * Used by: curated-itineraries.html, fixed-departures.html, honeymoon-packages.html
 * Reads data-type attribute from <body> to filter packages by type
 */
document.addEventListener('DOMContentLoaded', async () => {
  const pageType = document.body.dataset.type || 'curated';
  const gridId   = document.body.dataset.grid  || 'curated-packages-grid';
  const grid     = document.getElementById(gridId);
  if (!grid) return;

  // Show loading skeleton
  grid.innerHTML = `
    <div class="col-span-full flex justify-center items-center py-16">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-400 text-sm font-dm-sans">Loading packages...</p>
      </div>
    </div>`;

  const packages = await MT.apiGet('/api/packages');

  // Filter by type
  const typeMap = {
    'curated':          ['curated'],
    'fixed-departure':  ['fixed-departure', 'fixed_departure'],
    'honeymoon':        ['honeymoon'],
    'package':          ['package'],
  };
  const allowed = typeMap[pageType] || [pageType];
  const filtered = (packages || []).filter(p => allowed.includes((p.type || '').toLowerCase()));

  if (!filtered.length) {
    const labels = {
      'curated':         { icon: 'fi-rr-map',        msg: 'No curated itineraries found',  sub: 'We are preparing special curated packages. Please check back soon!' },
      'fixed-departure': { icon: 'fi-rr-calendar',   msg: 'No fixed departures found',     sub: 'We are currently updating our fixed departure packages. Please check back soon!' },
      'honeymoon':       { icon: 'fi-rr-heart',       msg: 'No honeymoon packages found',   sub: 'We are curating special romantic getaways. Please check back soon!' },
    };
    const l = labels[pageType] || { icon: 'fi-rr-suitcase', msg: 'No packages found', sub: 'Please check back soon!' };
    grid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <div class="inline-block p-4 rounded-full bg-gray-100 mb-4">
          <i class="fi ${l.icon} text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 font-[Quicksand]">${l.msg}</h3>
        <p class="text-gray-500 text-sm mt-1 font-dm-sans">${l.sub}</p>
      </div>`;
    return;
  }

  // Render cards
  grid.innerHTML = filtered.map(p => R.packageCard(p)).join('');
});

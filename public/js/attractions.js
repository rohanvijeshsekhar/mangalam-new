/**
 * attractions.js — Attractions Grid Loader
 * Loads attraction items from /api/attractions and renders premium box cards
 */
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('attractions-grid') || document.getElementById('tickets-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="col-span-full py-20 text-center text-gray-400 font-dm-sans">
      <i class="fa-solid fa-spinner animate-spin text-3xl text-red-600 mb-3"></i>
      <p class="text-base">Loading attractions & experiences...</p>
    </div>`;

  const attractions = await MT.apiGet('/api/attractions');

  if (!attractions || !attractions.length) {
    container.innerHTML = `
      <div class="col-span-full text-center py-20 bg-gray-50 rounded-3xl p-8 border border-gray-100">
        <i class="fa-solid fa-camera text-4xl text-gray-300 mb-4 block"></i>
        <h3 class="text-xl font-bold font-[Quicksand] text-gray-800 mb-2">No Attractions Available</h3>
        <p class="text-gray-500 font-dm-sans max-w-md mx-auto">Check back soon for new exciting places, activities and attractions.</p>
      </div>`;
    return;
  }

  container.innerHTML = attractions.map(a => {
    const title = a.name || a.title || 'Attraction';
    const slug = a.slug_url || a.slug || '';
    const link = `attraction-details.html?slug=${slug || a.attraction_id}`;
    const img = MT.resolveImg(a.card_image || a.banner_image || a.image);
    const expType = a.experience_type || 'Cultural';
    const duration = a.duration || '2-3 Hours';
    const dest = a.destination_name || 'Dubai, UAE';
    const price = a.price || a.amount ? `₹ ${Number(a.price || a.amount).toLocaleString('en-IN')}` : 'Included';
    const desc = a.description || a.overview || '';
    const included = a.included || '';

    // Experience badge color mappings
    const expColors = {
      'Adventure': 'bg-amber-500 text-white',
      'Cultural':  'bg-indigo-600 text-white',
      'Luxury':    'bg-yellow-400 text-slate-900',
      'Sightseeing':'bg-emerald-600 text-white',
      'Nature':    'bg-green-600 text-white',
      'Family':    'bg-purple-600 text-white',
    };
    const badgeColor = expColors[expType] || 'bg-red-600 text-white';

    return `
      <div class="group bg-white rounded-[28px] border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
        
        <!-- Image Box & Badges -->
        <div class="relative h-56 w-full overflow-hidden bg-slate-900">
          <img src="${img}" alt="${title}" class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" onerror="this.src='./assets/images/activity-1.webp'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <!-- Experience Type Badge (Top Left) -->
          <div class="absolute top-4 left-4 z-10">
            <span class="px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider font-dm-sans shadow-md ${badgeColor}">
              <i class="fa-solid fa-sparkles mr-1"></i> ${expType}
            </span>
          </div>

          <!-- Duration Pill (Top Right) -->
          <div class="absolute top-4 right-4 z-10">
            <span class="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/20">
              <i class="fa-regular fa-clock mr-1 text-yellow-400"></i> ${duration}
            </span>
          </div>

          <!-- Location (Bottom Left overlay) -->
          <div class="absolute bottom-3 left-4 z-10 text-white text-xs font-dm-sans flex items-center gap-1 font-medium drop-shadow">
            <i class="fa-solid fa-location-dot text-red-500"></i> ${dest}
          </div>
        </div>

        <!-- Content Card Body -->
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <h3 class="text-xl font-bold font-[Quicksand] text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
              <a href="${link}">${title}</a>
            </h3>
            
            ${desc ? `
              <p class="text-gray-500 font-dm-sans text-sm line-clamp-2 leading-relaxed">
                ${desc}
              </p>
            ` : ''}

            ${included ? `
              <div class="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-dm-sans font-medium">
                <i class="fa-solid fa-circle-check text-emerald-500"></i>
                <span class="truncate">${included}</span>
              </div>
            ` : ''}
          </div>

          <!-- Card Footer & Action Button -->
          <div class="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <div>
              <span class="text-[11px] text-gray-400 font-bold uppercase tracking-wider block font-dm-sans">Starting From</span>
              <span class="text-lg font-extrabold text-gray-900 font-[Quicksand]">${price}</span>
            </div>
            <a href="${link}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider font-dm-sans hover:bg-red-600 transition-all shadow-md">
              <span>View Box</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>

        </div>
      </div>`;
  }).join('');

  loadPosters();
});

async function loadPosters() {
  const section = document.getElementById('poster-section');
  const list = document.getElementById('poster-list');
  if (!section || !list) return;
  const posters = await MT.apiGet('/api/posters');
  if (!posters || !posters.length) return;
  list.innerHTML = posters.map(p => {
    const img = MT.resolveImg(p.image) || `./admin/files/posters/${p.image}`;
    const alt = p.alt_text || p.title || p.name || 'Special Travel Offer';
    const tag = p.link ? `<a href="${p.link}" class="block w-full h-full">` : `<div class="block w-full h-full">`;
    const endTag = p.link ? `</a>` : `</div>`;
    return `<li class="splide__slide">
      <div class="rounded-3xl overflow-hidden shadow-lg h-auto max-h-[380px] bg-gray-900">
        ${tag}<img src="${img}" alt="${alt}" class="w-full h-full object-cover object-center max-h-[380px]">${endTag}
      </div>
    </li>`;
  }).join('');
  section.style.display = '';

  if (window.Splide && document.getElementById('posterCarousel')) {
    const cnt = posters.length;
    if (cnt > 0) new Splide('#posterCarousel', { type: cnt > 1 ? 'loop' : 'slide', autoplay: cnt > 1, interval: 4000, speed: 800, arrows: cnt > 1, pagination: true, perPage: 1 }).mount();
  }
}

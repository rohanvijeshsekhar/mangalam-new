/**
 * package-details.js — Package detail page
 */
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('package-detail-root');
  if (!root) return;

  const slug = MT.qParam('slug');
  const packages = await MT.apiGet('/api/packages');
  let pkg = null;
  if (packages && slug) pkg = packages.find(p => (p.slug_url || p.slug) === slug);

  if (!pkg) {
    root.innerHTML = '<div class="container mx-auto px-4 py-24 text-center font-dm-sans"><p class="text-gray-500 text-xl font-bold mb-2">No curated itineraries found</p></div>';
    return;
  }

  const detail = await MT.apiGet(`/api/packages/${pkg.id || pkg.package_id}`);
  const d = detail || pkg;

  const title     = d.package_name || d.title || d.name || '';
  const img       = MT.resolveImg(d.image || d.card_image);
  const price     = d.amount || d.price ? `₹ ${Number(d.amount || d.price).toLocaleString('en-IN')}` : '';
  const nights    = d.nights || '';
  const days      = d.days || '';
  const inclusions= d.inclusions || '';
  const exclusions= d.exclusions || '';
  const itinerary = d.itinerary || '';
  const overview  = d.overview || d.description || d.discription || '';

  document.title = `${title} | Mangalam Travel & Tours`;

  root.innerHTML = `
    <div class="relative h-[50vh] overflow-hidden">
      <img src="${img}" alt="${title}" class="w-full h-full object-cover" onerror="this.src='./assets/images/logo-color.png'">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-8 text-white container mx-auto">
        <h1 class="text-4xl font-bold font-[Quicksand] mb-2">${title}</h1>
        ${nights || days ? `<p class="text-gray-200 font-dm-sans">${nights}N / ${days}D</p>` : ''}
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          ${overview ? `<div><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Overview</h2><div class="text-gray-600 font-dm-sans leading-relaxed">${overview}</div></div>` : ''}
          ${itinerary ? `<div><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Itinerary</h2><div class="text-gray-600 font-dm-sans leading-relaxed">${itinerary}</div></div>` : ''}
          ${inclusions ? `<div><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Inclusions</h2><div class="text-gray-600 font-dm-sans leading-relaxed">${inclusions}</div></div>` : ''}
          ${exclusions ? `<div><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Exclusions</h2><div class="text-gray-600 font-dm-sans leading-relaxed">${exclusions}</div></div>` : ''}
        </div>
        <div class="lg:col-span-1">
          <div class="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            ${price ? `<div class="text-3xl font-bold text-gray-800 font-[Quicksand] mb-2">${price}</div><p class="text-gray-500 text-sm font-dm-sans mb-6">per person</p>` : ''}
            <form id="pkg-enquiry-form" class="space-y-3">
              <input type="hidden" name="package_name" value="${title}">
              <input type="text" name="customer_name" placeholder="Your Name" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <input type="email" name="customer_email" placeholder="Email" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <input type="tel" name="customer_phone" placeholder="Phone" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-semibold font-dm-sans hover:bg-gray-800 transition-colors">Book Now / Enquire</button>
              <div id="pkg-enq-alert" class="hidden text-center py-2 rounded-xl text-sm font-dm-sans"></div>
            </form>
          </div>
        </div>
      </div>
    </div>`;
});

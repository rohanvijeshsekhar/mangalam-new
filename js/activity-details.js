/** activity-details.js */
document.addEventListener('DOMContentLoaded', async () => {
  const slug = MT.qParam('slug');
  const root = document.getElementById('activity-detail-root');
  if (!root) return;
  const activities = await MT.apiGet('/api/activities');
  const a = activities?.find(a => (a.slug_url || a.slug) === slug);
  if (!a) { root.innerHTML = '<div class="container mx-auto px-4 py-20 text-center"><p class="text-gray-500 text-xl">Activity not found.</p></div>'; return; }

  const detail = await MT.apiGet(`/api/activities/${a.id || a.activity_id}`);
  const d = detail || a;
  const title = d.title || d.name || '';
  const img   = MT.resolveImg(d.image || d.card_image);
  const price = MT.fmtPrice(d.adult_price || d.amount || d.price);
  const desc  = d.description || d.discription || '';

  document.title = `${title} | Mangalam Travel & Tours`;

  root.innerHTML = `
    <div class="relative h-[50vh] overflow-hidden">
      <img src="${img}" alt="${title}" class="w-full h-full object-cover" onerror="this.src='/assets/images/logo-color.png'">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-8 text-white container mx-auto">
        <h1 class="text-4xl font-bold font-[Quicksand] mb-2">${title}</h1>
      </div>
    </div>
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          ${desc ? `<div class="prose max-w-none text-gray-600 font-dm-sans leading-relaxed">${desc}</div>` : ''}
        </div>
        <div>
          <div class="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            ${price ? `<div class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">${price}<span class="text-sm text-gray-500 font-dm-sans font-normal"> / person</span></div>` : ''}
            <form id="act-enquiry-form" class="space-y-3">
              <input type="hidden" name="activity_name" value="${title}">
              <input type="text" name="customer_name" placeholder="Your Name" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <input type="email" name="customer_email" placeholder="Email" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <input type="tel" name="customer_phone" placeholder="Phone" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-semibold font-dm-sans hover:bg-gray-800 transition-colors">Enquire Now</button>
              <div id="act-alert" class="hidden text-center py-2 rounded-xl text-sm font-dm-sans"></div>
            </form>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('act-enquiry-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...'; btn.disabled = true;
    const result = await MT.apiPost('/api/enquiry/cart', Object.fromEntries(new FormData(e.target)));
    const al = document.getElementById('act-alert');
    if (al) { al.classList.remove('hidden'); al.className = result?.success ? 'text-center py-2 rounded-xl text-sm font-dm-sans bg-green-50 text-green-700' : 'text-center py-2 rounded-xl text-sm font-dm-sans bg-red-50 text-red-700'; al.textContent = result?.success ? 'Enquiry sent!' : 'Failed. Please try again.'; }
    btn.textContent = 'Enquire Now'; btn.disabled = false;
  });
});

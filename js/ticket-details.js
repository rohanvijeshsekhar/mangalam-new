/** ticket-details.js */
document.addEventListener('DOMContentLoaded', async () => {
  const slug = MT.qParam('slug');
  const root = document.getElementById('ticket-detail-root');
  if (!root) return;
  const tickets = await MT.apiGet('/api/tickets');
  const t = tickets?.find(t => (t.slug_url || t.slug) === slug);
  if (!t) { root.innerHTML = '<div class="container mx-auto px-4 py-20 text-center"><p class="text-gray-500 text-xl">Ticket not found.</p><a href="/tickets" class="mt-4 inline-block px-6 py-2 bg-black text-white rounded-xl font-dm-sans">Browse Tickets</a></div>'; return; }

  const detail = await MT.apiGet(`/api/tickets/${t.id || t.ticket_id}`);
  const d = detail || t;
  const title       = d.title || d.name || '';
  const img         = MT.resolveImg(d.image || d.card_image);
  const adultPrice  = MT.fmtPrice(d.adult_price || d.amount || d.price);
  const childPrice  = MT.fmtPrice(d.child_price);
  const description = d.description || d.discription || '';

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
          ${description ? `<div class="prose max-w-none text-gray-600 font-dm-sans leading-relaxed">${description}</div>` : ''}
        </div>
        <div>
          <div class="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            ${adultPrice ? `<div class="mb-2"><span class="text-sm text-gray-500 font-dm-sans">Adult: </span><span class="text-2xl font-bold font-[Quicksand] text-gray-800">${adultPrice}</span></div>` : ''}
            ${childPrice ? `<div class="mb-4"><span class="text-sm text-gray-500 font-dm-sans">Child: </span><span class="text-lg font-bold font-[Quicksand] text-gray-800">${childPrice}</span></div>` : ''}
            <form id="tkt-enquiry-form" class="space-y-3">
              <input type="hidden" name="ticket_name" value="${title}">
              <input type="text" name="customer_name" placeholder="Your Name" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <input type="email" name="customer_email" placeholder="Email" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <input type="tel" name="customer_phone" placeholder="Phone" required class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-semibold font-dm-sans hover:bg-gray-800 transition-colors">Book Now / Enquire</button>
              <div id="tkt-alert" class="hidden text-center py-2 rounded-xl text-sm font-dm-sans"></div>
            </form>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('tkt-enquiry-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...'; btn.disabled = true;
    const result = await MT.apiPost('/api/enquiry/cart', Object.fromEntries(new FormData(e.target)));
    const al = document.getElementById('tkt-alert');
    if (al) { al.classList.remove('hidden'); al.className = result?.success ? 'text-center py-2 rounded-xl text-sm font-dm-sans bg-green-50 text-green-700' : 'text-center py-2 rounded-xl text-sm font-dm-sans bg-red-50 text-red-700'; al.textContent = result?.success ? 'Enquiry sent!' : 'Failed. Please try again.'; }
    btn.textContent = 'Book Now / Enquire'; btn.disabled = false;
  });
});

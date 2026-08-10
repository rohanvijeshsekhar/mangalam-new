/**
 * package-details.js — Package detail page loader with feature box chips & banner cover hero
 */
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('package-detail-root');
  if (!root) return;

  const slug = MT.qParam('slug');
  const packages = await MT.apiGet('/api/packages');
  let pkg = null;
  if (packages && slug) pkg = packages.find(p => (p.slug_url || p.slug) === slug);

  if (!pkg) {
    root.innerHTML = `
      <div class="container mx-auto px-4 py-24 text-center font-dm-sans">
        <div class="inline-block p-4 rounded-full bg-gray-100 mb-4">
          <i class="fa-solid fa-suitcase text-3xl text-gray-400"></i>
        </div>
        <h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-2">Package Not Found</h2>
        <p class="text-gray-500 max-w-md mx-auto mb-6">The requested package could not be found. Please check back later or explore other packages.</p>
        <a href="packages.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-all">Explore Packages</a>
      </div>`;
    return;
  }

  const detail = await MT.apiGet(`/api/packages/${pkg.id || pkg.package_id}`);
  const d = detail || pkg;

  const title      = d.package_name || d.title || d.name || '';
  const bannerImg  = MT.resolveImg(d.banner_image || d.inner_image || d.card_image || d.image);
  const cardImg    = MT.resolveImg(d.card_image || d.image);
  const price      = d.amount || d.price ? `₹ ${Number(d.amount || d.price).toLocaleString('en-IN')}` : '';
  const nights     = d.nights || '';
  const days       = d.days || '';
  const inclusions = d.inclusions || '';
  const exclusions = d.exclusions || '';
  const itinerary  = d.itinerary || '';
  const overview   = d.overview || d.description || d.discription || '';

  document.title = `${title} | Mangalam Travel & Tours`;

  // Feature / Inclusion Box Chips Renderer
  function renderFeatureBoxes(text, type = 'inclusion') {
    if (!text) return '';
    const items = text.split(/,|\n|;/).map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
    if (!items.length) return '';

    const isInc = type === 'inclusion';
    const bgClass = isInc 
      ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/80' 
      : 'bg-rose-50/80 text-rose-800 border-rose-200/80 hover:bg-rose-100/80';
    const iconClass = isInc ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-500';

    return `
      <div class="flex flex-wrap gap-3 my-4">
        ${items.map(item => `
          <div class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${bgClass} shadow-sm font-dm-sans font-semibold text-sm transition-all hover:scale-[1.02] cursor-default">
            <i class="fa-solid ${iconClass} text-base shrink-0"></i>
            <span>${item}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Parse Itinerary into Structured Timeline Cards
  function renderItineraryTimeline(text) {
    if (!text) return '';
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
    if (!lines.length) return '';

    return `
      <div class="space-y-4 my-6">
        ${lines.map((line, idx) => `
          <div class="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 font-bold font-[Quicksand] flex items-center justify-center shrink-0 border border-red-100">
              ${idx + 1}
            </div>
            <div class="flex-1 font-dm-sans text-gray-700 leading-relaxed self-center">
              ${line}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  root.innerHTML = `
    <!-- Header Banner Hero Section -->
    <div class="relative w-full h-[380px] lg:h-[480px] overflow-hidden bg-slate-900">
      <img src="${bannerImg}" alt="${title}" class="w-full h-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105" onerror="this.src='./assets/images/bg-img.webp'">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6 lg:p-12 text-white container mx-auto">
        <div class="max-w-4xl space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-4 py-1.5 rounded-full bg-red-600 text-white font-semibold text-xs uppercase tracking-wider font-dm-sans shadow-lg shadow-red-600/30">
              Holiday Package
            </span>
            ${nights || days ? `
              <span class="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/30">
                <i class="fa-regular fa-clock mr-1.5"></i>${nights} Nights / ${days} Days
              </span>
            ` : ''}
          </div>
          <h1 class="text-3xl lg:text-5xl font-bold font-[Quicksand] text-white leading-tight">${title}</h1>
        </div>
      </div>
    </div>

    <!-- Details Body -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- Left Content Column -->
        <div class="lg:col-span-2 space-y-10">
          
          ${overview ? `
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-circle-info text-red-600 text-xl"></i> Package Overview
              </h2>
              <div class="text-gray-600 font-dm-sans leading-relaxed whitespace-pre-line text-base">
                ${overview}
              </div>
            </div>
          ` : ''}

          ${inclusions ? `
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-circle-check text-emerald-600 text-xl"></i> Key Features & Inclusions
              </h2>
              <p class="text-sm text-gray-500 font-dm-sans">Everything included in this tour package:</p>
              ${renderFeatureBoxes(inclusions, 'inclusion')}
            </div>
          ` : ''}

          ${exclusions ? `
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-circle-xmark text-rose-500 text-xl"></i> Exclusions
              </h2>
              <p class="text-sm text-gray-500 font-dm-sans">Items not included in the package price:</p>
              ${renderFeatureBoxes(exclusions, 'exclusion')}
            </div>
          ` : ''}

          ${itinerary ? `
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-map-location-dot text-red-600 text-xl"></i> Tour Itinerary
              </h2>
              ${renderItineraryTimeline(itinerary)}
            </div>
          ` : ''}

        </div>

        <!-- Right Booking / Enquiry Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-28 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
            
            ${price ? `
              <div class="border-b border-gray-100 pb-6">
                <span class="text-xs uppercase tracking-wider text-gray-400 font-bold font-dm-sans block mb-1">Starting From</span>
                <div class="text-4xl font-extrabold text-gray-900 font-[Quicksand]">${price}</div>
                <span class="text-sm text-gray-500 font-dm-sans">per person inclusive of taxes</span>
              </div>
            ` : ''}

            <div>
              <h3 class="text-xl font-bold font-[Quicksand] text-gray-900 mb-1">Book This Package</h3>
              <p class="text-sm text-gray-500 font-dm-sans mb-4">Send an enquiry to get custom quotes & instant assistance.</p>
              
              <form id="pkg-enquiry-form" class="space-y-4">
                <input type="hidden" name="package_name" value="${title}">
                <div>
                  <label class="block text-xs font-bold text-gray-600 uppercase mb-1 font-dm-sans">Full Name *</label>
                  <input type="text" name="customer_name" placeholder="John Doe" required class="block w-full rounded-xl border border-gray-200 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50/50">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 uppercase mb-1 font-dm-sans">Email Address *</label>
                  <input type="email" name="customer_email" placeholder="john@example.com" required class="block w-full rounded-xl border border-gray-200 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50/50">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 uppercase mb-1 font-dm-sans">Phone Number *</label>
                  <input type="tel" name="customer_phone" placeholder="+91 9876543210" required class="block w-full rounded-xl border border-gray-200 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50/50">
                </div>
                <button type="submit" class="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold font-dm-sans hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2">
                  <i class="fa-solid fa-paper-plane"></i> Send Package Enquiry
                </button>
                <div id="pkg-enq-alert" class="hidden text-center py-3 rounded-xl text-sm font-dm-sans"></div>
              </form>
            </div>

            <div class="border-t border-gray-100 pt-6 space-y-3 text-xs text-gray-500 font-dm-sans">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-shield-halved text-emerald-600 text-base"></i>
                <span>Best Price Guarantee & Verified Operators</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-headset text-red-600 text-base"></i>
                <span>24/7 Travel Support Assistance</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>`;

  // Handle Enquiry Form Submit
  const form = document.getElementById('pkg-enquiry-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('pkg-enq-alert');
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Submitting...';

      const payload = {
        package_name: title,
        customer_name: form.customer_name.value.trim(),
        customer_email: form.customer_email.value.trim(),
        customer_phone: form.customer_phone.value.trim(),
      };

      try {
        const res = await MT.apiPost('/api/enquiry', payload);
        if (alertEl) {
          alertEl.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-emerald-50', 'text-emerald-700');
          alertEl.classList.add('bg-emerald-50', 'text-emerald-700');
          alertEl.textContent = 'Enquiry sent successfully! We will contact you shortly.';
        }
        form.reset();
      } catch {
        if (alertEl) {
          alertEl.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-emerald-50', 'text-emerald-700');
          alertEl.classList.add('bg-emerald-50', 'text-emerald-700');
          alertEl.textContent = 'Enquiry received! Our team will call you back.';
        }
        form.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Package Enquiry';
      }
    });
  }
});

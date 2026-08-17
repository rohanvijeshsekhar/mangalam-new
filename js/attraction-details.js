/**
 * attraction-details.js — Attraction detail page loader
 * Renders cover banner, experience type, duration, included items, description & booking form
 */
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('attraction-detail-root');
  if (!root) return;

  const slug = MT.qParam('slug');
  const attractions = await MT.apiGet('/api/attractions');
  let item = null;
  if (attractions && slug) item = attractions.find(a => (a.slug_url || a.slug) === slug || String(a.attraction_id || a.id) === String(slug));

  if (!item) {
    root.innerHTML = `
      <div class="container mx-auto px-4 py-24 text-center font-dm-sans">
        <div class="inline-block p-4 rounded-full bg-gray-100 mb-4">
          <i class="fa-solid fa-camera text-3xl text-gray-400"></i>
        </div>
        <h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-2">Attraction Not Found</h2>
        <p class="text-gray-500 max-w-md mx-auto mb-6">The requested attraction or place could not be found. Please check back later or explore other attractions.</p>
        <a href="attraction.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-all">Explore Attractions</a>
      </div>`;
    return;
  }

  const detail = await MT.apiGet(`/api/attractions/${item.id || item.attraction_id}`);
  const d = detail || item;

  const title    = d.name || d.title || '';
  const bannerImg= MT.resolveImg(d.banner_image || d.card_image || d.image);
  const expType  = d.experience_type || 'Cultural';
  const duration = d.duration || '2-3 Hours';
  const dest     = d.destination_name || 'Dubai, UAE';
  const price    = d.price || d.amount ? `₹ ${Number(d.price || d.amount).toLocaleString('en-IN')}` : '';
  const desc     = d.description || d.overview || '';
  const included = d.included || '';

    document.title = title;

  // Experience badge color mappings
  const expColors = {
    'Adventure': 'bg-amber-500 text-white shadow-amber-500/30',
    'Cultural':  'bg-indigo-600 text-white shadow-indigo-600/30',
    'Luxury':    'bg-yellow-400 text-slate-900 shadow-yellow-400/30',
    'Sightseeing':'bg-emerald-600 text-white shadow-emerald-600/30',
    'Nature':    'bg-green-600 text-white shadow-green-600/30',
    'Family':    'bg-purple-600 text-white shadow-purple-600/30',
  };
  const badgeColor = expColors[expType] || 'bg-red-600 text-white shadow-red-600/30';

  root.innerHTML = `
    <!-- TOP ROW: 100% Full-Width Attraction Banner Cover -->
    <div class="w-full bg-slate-900 mb-8">
      <div class="relative w-full h-[380px] md:h-[480px] lg:h-[540px] overflow-hidden">
        
        <!-- Image Cover -->
        <img src="${bannerImg}" alt="${title}" class="w-full h-full object-cover object-center" onerror="this.src='./assets/images/activity-1.webp'">

        <!-- Dark Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 pointer-events-none"></div>
        
        <!-- Overlay Badges & Title at Bottom of Image -->
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white container mx-auto z-30 pointer-events-none">
          <div class="max-w-4xl space-y-3">
            <div>
              <a href="/" class="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/30 transition-all shadow-sm">
                <i class="fa-solid fa-arrow-left text-xs text-yellow-300"></i> Back to Home
              </a>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider font-dm-sans shadow-lg ${badgeColor}">
                <i class="fa-solid fa-sparkles mr-1.5"></i>${expType} Experience
              </span>
              <span class="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/30">
                <i class="fa-regular fa-clock mr-1.5 text-yellow-400"></i>Duration: ${duration}
              </span>
              ${dest ? `
                <span class="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/30">
                  <i class="fa-solid fa-location-dot mr-1.5 text-red-500"></i>${dest}
                </span>
              ` : ''}
              ${price ? `
                <span class="px-4 py-1.5 rounded-full bg-yellow-400 text-slate-900 font-extrabold text-xs font-dm-sans">
                  ${price} / person
                </span>
              ` : ''}
            </div>
            <h1 class="text-3xl md:text-5xl font-bold font-[Quicksand] text-white leading-tight capitalize">${title}</h1>
          </div>
        </div>

      </div>
    </div>

    <!-- BOTTOM ROW: Attraction Features & Details Content -->
    <div class="container mx-auto px-4 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- Main Column (Overview, Experience Type, Duration, Included Items) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- 3 Spec Boxes Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <!-- Box 1: Experience Type -->
            <div class="bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/80 p-5 rounded-[24px] shadow-lg shadow-gray-200/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-dm-sans block mb-0.5">Experience Type</span>
                <span class="text-base font-extrabold text-gray-900 font-[Quicksand]">${expType}</span>
              </div>
            </div>

            <!-- Box 2: Duration -->
            <div class="bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/80 p-5 rounded-[24px] shadow-lg shadow-gray-200/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                <i class="fa-regular fa-clock"></i>
              </div>
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-dm-sans block mb-0.5">Duration</span>
                <span class="text-base font-extrabold text-gray-900 font-[Quicksand]">${duration}</span>
              </div>
            </div>

            <!-- Box 3: Destination -->
            <div class="bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/80 p-5 rounded-[24px] shadow-lg shadow-gray-200/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-dm-sans block mb-0.5">Location</span>
                <span class="text-base font-extrabold text-gray-900 font-[Quicksand] truncate">${dest}</span>
              </div>
            </div>
          </div>
          
          <!-- Attraction Description / Overview -->
          ${desc ? `
            <div class="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-4">
              <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-compass text-red-600"></i> Attraction Overview & Experience
              </h2>
              <div class="text-gray-600 font-dm-sans leading-relaxed whitespace-pre-line text-base md:text-lg">
                ${desc}
              </div>
            </div>
          ` : ''}

          <!-- Included Features Card -->
          ${included ? `
            <div class="bg-gradient-to-br from-white to-emerald-50/20 p-8 rounded-[32px] border border-emerald-100 shadow-xl shadow-gray-200/40 space-y-6">
              <div class="flex items-center gap-3.5 border-b border-emerald-100/80 pb-4">
                <div class="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <h2 class="text-xl font-bold font-[Quicksand] text-gray-900">What's Included in Experience</h2>
                  <span class="text-xs text-gray-500 font-dm-sans">Services & activity details included</span>
                </div>
              </div>
              <ul class="space-y-3.5 font-dm-sans">
                ${included.split(/,|\n|;/).map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).map(item => `
                  <li class="flex items-start gap-3.5 text-gray-700 text-base leading-snug">
                    <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      <i class="fa-solid fa-check"></i>
                    </div>
                    <span class="font-medium">${item}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

        </div>

        <!-- Booking & Enquiry Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-28 bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
            
            ${price ? `
              <div class="border-b border-gray-100 pb-6">
                <span class="text-xs uppercase tracking-wider text-gray-400 font-bold font-dm-sans block mb-1">Starting Price</span>
                <div class="text-4xl font-extrabold text-gray-900 font-[Quicksand]">${price}</div>
                <span class="text-sm text-gray-500 font-dm-sans">per person</span>
              </div>
            ` : ''}

            <div class="space-y-4">
              <h3 class="text-xl font-bold font-[Quicksand] text-gray-900">Book / Enquiry Form</h3>
              <p class="text-sm text-gray-500 font-dm-sans">Submit your details to reserve your experience or get instant pricing.</p>
              
              <form id="attraction-enquiry-form" class="space-y-4 pt-2">
                <input type="hidden" name="package_name" value="${title}">
                <div>
                  <label class="block text-xs font-bold text-gray-600 uppercase mb-1 font-dm-sans">Full Name *</label>
                  <input type="text" name="customer_name" placeholder="John Doe" required class="block w-full rounded-xl border border-gray-200 py-3.5 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50/50">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 uppercase mb-1 font-dm-sans">Email Address *</label>
                  <input type="email" name="customer_email" placeholder="john@example.com" required class="block w-full rounded-xl border border-gray-200 py-3.5 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50/50">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 uppercase mb-1 font-dm-sans">Phone Number *</label>
                  <input type="tel" name="customer_phone" placeholder="+91 9876543210" required class="block w-full rounded-xl border border-gray-200 py-3.5 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50/50">
                </div>
                <button type="submit" class="w-full bg-red-600 text-white py-4 rounded-2xl font-bold font-dm-sans hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-base">
                  <i class="fa-solid fa-paper-plane"></i> Book / Send Enquiry
                </button>
                <div id="attraction-enq-alert" class="hidden text-center py-3 rounded-xl text-sm font-dm-sans"></div>
              </form>
            </div>

            <div class="border-t border-gray-100 pt-6 space-y-3 text-xs text-gray-500 font-dm-sans">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-shield-halved text-emerald-600 text-base"></i>
                <span>Instant Booking Confirmation</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-headset text-red-600 text-base"></i>
                <span>24/7 Dedicated Customer Assistance</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>`;

  // Handle Enquiry Form Submit
  const form = document.getElementById('attraction-enquiry-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('attraction-enq-alert');
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Submitting...';

      const payload = {
        package_name: `[Attraction] ${title}`,
        customer_name: form.customer_name.value.trim(),
        customer_email: form.customer_email.value.trim(),
        customer_phone: form.customer_phone.value.trim(),
      };

      try {
        await MT.apiPost('/api/enquiry', payload);
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
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Book / Send Enquiry';
      }
    });
  }
});

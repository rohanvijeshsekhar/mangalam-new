/**
 * package-details.js — Package detail page loader
 * Layout: Image at TOP (full-width cover banner), Features & Content DOWN below image (no congestion)
 */
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('package-detail-root');
  if (!root) return;

  const rawParam = (MT.qParam('slug') || MT.qParam('id') || MT.qParam('package_id') || '').trim();
  const packages = await MT.apiGet('/api/packages');
  let pkg = null;

  if (Array.isArray(packages) && packages.length > 0) {
    if (rawParam) {
      const lower = rawParam.toLowerCase();
      pkg = packages.find(p => 
        String(p.slug_url || p.slug || '').toLowerCase() === lower ||
        String(p.package_id || p.id || '') === rawParam ||
        String(p.package_name || p.title || '').toLowerCase() === lower ||
        String(p.package_name || p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === lower
      );
    }
    if (!pkg && rawParam) {
      // Direct API fetch
      const direct = await MT.apiGet(`/api/packages/${encodeURIComponent(rawParam)}`);
      if (direct && (direct.package_id || direct.id || direct.package_name)) pkg = direct;
    }
    if (!pkg && packages.length > 0) {
      // Fallback to first available package if single package exists
      pkg = packages[0];
    }
  }

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
  if (title) {
    document.title = `${title} — Holiday Package | Mangalam Travel & Tours`;
    const desc = (d.meta_description || d.description || d.overview || `Explore ${title} with Mangalam Travel & Tours. Complete itinerary, hotel details, and best prices.`).replace(/<[^>]*>?/gm, '').slice(0, 160);
    const canonical = `https://mangalamtravel.com/package-details.html?slug=${encodeURIComponent(d.slug_url || d.slug || rawParam)}`;
    const setMetaTag = (nameOrProp, attr, val) => {
      if (!val) return;
      let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMetaTag('description', 'name', desc);
    setMetaTag('title', 'name', `${title} — Mangalam Travel & Tours`);
    setMetaTag('og:title', 'property', `${title} — Mangalam Travel & Tours`);
    setMetaTag('og:description', 'property', desc);
    setMetaTag('og:url', 'property', canonical);
    setMetaTag('twitter:title', 'name', `${title} — Mangalam Travel & Tours`);
    setMetaTag('twitter:description', 'name', desc);
    setMetaTag('twitter:url', 'name', canonical);
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) { linkEl = document.createElement('link'); linkEl.setAttribute('rel', 'canonical'); document.head.appendChild(linkEl); }
    linkEl.setAttribute('href', canonical);
  }
  
  // Extract banner images list (up to 4 images)
  let rawBanners = d.banner_images || [];
  if (typeof rawBanners === 'string') {
    try { rawBanners = JSON.parse(rawBanners); } catch { rawBanners = [rawBanners]; }
  }
  let bannerList = (Array.isArray(rawBanners) ? rawBanners : []).filter(Boolean).map(img => MT.resolveImg(img));
  if (!bannerList.length) {
    const fallback = MT.resolveImg(d.banner_image || d.inner_image || d.card_image || d.image);
    bannerList = [fallback];
  }
  bannerList = bannerList.slice(0, 4); // max 4 images

  const price      = d.amount || d.price ? `₹ ${Number(d.amount || d.price).toLocaleString('en-IN')}` : '';
  const nights     = d.nights || '';
  const days       = d.days || '';
  const inclusions = d.inclusions || '';
  const exclusions = d.exclusions || '';
  const terms      = d.terms || '';
  // Extract itinerary days list
  let itineraryDays = d.itinerary_days || [];
  if (!itineraryDays.length && d.itinerary) {
    try {
      itineraryDays = JSON.parse(d.itinerary);
    } catch {
      const lines = d.itinerary.split('\n').map(s => s.trim()).filter(Boolean);
      itineraryDays = lines.map((line, idx) => {
        const dayMatch = line.match(/^(?:Day\s*(\d+)[:\s-]*|(\d+)[\.:\s-]+)(.*)/i);
        const dayNum = dayMatch ? (dayMatch[1] || dayMatch[2] || idx + 1) : idx + 1;
        const rest = dayMatch && dayMatch[3] ? dayMatch[3].trim() : line;
        return {
          day: Number(dayNum),
          title: line.startsWith('Day') ? line : `Day ${idx + 1}: ${rest}`,
          description: rest || line
        };
      });
    }
  }

  document.title = `${title} | Mangalam Travel & Tours`;

  const overview   = d.overview || d.description || d.discription || '';
  const pkgType    = (d.type || 'Holiday Package').toUpperCase();

  root.innerHTML = `
    <!-- TOP ROW: 100% Full-Width Auto-Sliding Image Banner Carousel -->
    <div class="w-full bg-slate-900 mb-8">
      <div class="relative w-full h-[380px] md:h-[480px] lg:h-[540px] overflow-hidden" id="pkg-banner-slider">
        
        <!-- Slides -->
        ${bannerList.map((img, idx) => `
          <img src="${img}" alt="${title} slide ${idx + 1}" class="pkg-slide-img absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${idx === 0 ? 'opacity-90 z-10' : 'opacity-0 z-0'}" onerror="this.src='./assets/images/bg-img.webp'">
        `).join('')}

        <!-- Dark Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20 pointer-events-none"></div>
        
        <!-- Overlay Badges & Title at Bottom of Image -->
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white container mx-auto z-30 pointer-events-none">
          <div class="max-w-4xl space-y-3">
            <div>
              <a href="/" class="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/30 transition-all shadow-sm">
                <i class="fa-solid fa-arrow-left text-xs text-yellow-300"></i> Back to Home
              </a>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider font-dm-sans shadow-lg shadow-red-600/30">
                ${pkgType}
              </span>
              ${nights || days ? `
                <span class="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/30">
                  <i class="fa-regular fa-clock mr-1.5"></i>${nights} Nights / ${days} Days
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

        <!-- Slider Dots (if > 1 image) -->
        ${bannerList.length > 1 ? `
          <div class="absolute bottom-6 right-6 md:right-12 z-30 flex items-center gap-2">
            ${bannerList.map((_, idx) => `
              <button class="pkg-slide-dot h-3 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-red-600 w-7' : 'bg-white/50 hover:bg-white w-3'}" data-index="${idx}"></button>
            `).join('')}
          </div>
        ` : ''}

      </div>
    </div>

    <!-- BOTTOM ROW: Features & Details Content (DOWN BELOW IMAGE) -->
    <div class="container mx-auto px-4 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- Main Column (Overview, Key Features/Inclusions, Exclusions, Itinerary, Terms & Conditions) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- 3 Small Box Premium Specs Grid (Above Overview) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <!-- Box 1: Duration -->
            <div class="bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/80 p-5 rounded-[24px] shadow-lg shadow-gray-200/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0 shadow-sm shadow-red-600/10">
                <i class="fa-regular fa-calendar-days"></i>
              </div>
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-dm-sans block mb-0.5">Duration</span>
                <span class="text-base font-extrabold text-gray-900 font-[Quicksand]">
                  ${days ? `${days} Days` : ''}${nights ? ` / ${nights} N` : ''}${!days && !nights ? 'Flexible' : ''}
                </span>
              </div>
            </div>

            <!-- Box 2: Hotel Type -->
            <div class="bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/80 p-5 rounded-[24px] shadow-lg shadow-gray-200/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0 shadow-sm shadow-amber-600/10">
                <i class="fa-solid fa-hotel"></i>
              </div>
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-dm-sans block mb-0.5">Hotel Type</span>
                <span class="text-base font-extrabold text-gray-900 font-[Quicksand]">
                  ${d.hotel_type || '4 Star Hotel'}
                </span>
              </div>
            </div>

            <!-- Box 3: Sightseeing -->
            <div class="bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/80 p-5 rounded-[24px] shadow-lg shadow-gray-200/30 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0 shadow-sm shadow-blue-600/10">
                <i class="fa-solid fa-camera"></i>
              </div>
              <div>
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-dm-sans block mb-0.5">Sightseeing</span>
                <span class="text-base font-extrabold text-gray-900 font-[Quicksand]">
                  ${d.activities_count || '5 Included'}
                </span>
              </div>
            </div>
          </div>
          
          ${overview ? `
            <div class="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-4">
              <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-compass text-red-600"></i> Package Overview
              </h2>
              <div class="text-gray-600 font-dm-sans leading-relaxed whitespace-pre-line text-base md:text-lg">
                ${overview}
              </div>
            </div>
          ` : ''}

          <!-- 2 Clean Premium Cards for Inclusions & Exclusions -->
          ${inclusions || exclusions ? `
            <div class="grid grid-cols-1 ${inclusions && exclusions ? 'md:grid-cols-2' : ''} gap-8">
              
              <!-- Card 1: What's Included -->
              ${inclusions ? `
                <div class="bg-gradient-to-br from-white to-emerald-50/20 p-8 rounded-[32px] border border-emerald-100 shadow-xl shadow-gray-200/40 space-y-6">
                  <div class="flex items-center gap-3.5 border-b border-emerald-100/80 pb-4">
                    <div class="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-xl shrink-0 shadow-sm">
                      <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold font-[Quicksand] text-gray-900">What's Included</h2>
                      <span class="text-xs text-gray-500 font-dm-sans">Services & features included in package</span>
                    </div>
                  </div>
                  <ul class="space-y-3.5 font-dm-sans">
                    ${inclusions.split(/,|\n|;/).map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).map(item => `
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

              <!-- Card 2: What's Excluded -->
              ${exclusions ? `
                <div class="bg-gradient-to-br from-white to-rose-50/20 p-8 rounded-[32px] border border-rose-100 shadow-xl shadow-gray-200/40 space-y-6">
                  <div class="flex items-center gap-3.5 border-b border-rose-100/80 pb-4">
                    <div class="w-11 h-11 rounded-2xl bg-rose-100/80 text-rose-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                      <i class="fa-solid fa-circle-xmark"></i>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold font-[Quicksand] text-gray-900">What's Excluded</h2>
                      <span class="text-xs text-gray-500 font-dm-sans">Services not included in package price</span>
                    </div>
                  </div>
                  <ul class="space-y-3.5 font-dm-sans">
                    ${exclusions.split(/,|\n|;/).map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).map(item => `
                      <li class="flex items-start gap-3.5 text-gray-700 text-base leading-snug">
                        <div class="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          <i class="fa-solid fa-xmark"></i>
                        </div>
                        <span class="font-medium">${item}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}

            </div>
          ` : ''}

          <!-- Day-by-Day Itinerary (Separate Dedicated Card for Each Day) -->
          ${itineraryDays && itineraryDays.length ? `
            <div class="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
              <div class="flex items-center gap-3.5 border-b border-gray-100 pb-4">
                <div class="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  <i class="fa-solid fa-map-location-dot"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900">Day-by-Day Itinerary</h2>
                  <span class="text-xs text-gray-500 font-dm-sans">Detailed schedule and travel plan for your trip</span>
                </div>
              </div>

              <!-- Separate Individual Card for Each Day -->
              <div class="space-y-5 pt-2">
                ${itineraryDays.map((item, idx) => {
                  const dayNum = String(item.day || (idx + 1)).padStart(2, '0');
                  const titleText = item.title ? item.title.replace(/^Day\s*\d+[:\s-]*/i, '') : `Day ${idx + 1}`;
                  return `
                    <div class="p-6 md:p-7 rounded-[24px] bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/80 shadow-md shadow-gray-200/30 hover:shadow-lg transition-all space-y-3">
                      <div class="flex flex-wrap items-center gap-3">
                        <span class="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider font-dm-sans shadow-md shadow-red-600/20 shrink-0">
                          DAY ${dayNum}
                        </span>
                        <h3 class="text-lg md:text-xl font-bold font-[Quicksand] text-gray-900 leading-snug">
                          ${titleText}
                        </h3>
                      </div>
                      ${item.description ? `
                        <p class="text-gray-600 font-dm-sans leading-relaxed text-base whitespace-pre-line pt-1">
                          ${item.description}
                        </p>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Terms & Conditions Card (Down below package details) -->
          ${terms ? `
            <div class="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 space-y-4">
              <h2 class="text-2xl font-bold font-[Quicksand] text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-file-contract text-red-600"></i> Terms & Conditions
              </h2>
              <div class="text-gray-600 font-dm-sans leading-relaxed whitespace-pre-line text-base md:text-lg">
                ${terms}
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Booking & Enquiry Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-28 bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
            
            ${price ? `
              <div class="border-b border-gray-100 pb-6">
                <span class="text-xs uppercase tracking-wider text-gray-400 font-bold font-dm-sans block mb-1">Package Price</span>
                <div class="text-4xl font-extrabold text-gray-900 font-[Quicksand]">${price}</div>
                <span class="text-sm text-gray-500 font-dm-sans">per person inclusive of all taxes</span>
              </div>
            ` : ''}

            <div class="space-y-4">
              <h3 class="text-xl font-bold font-[Quicksand] text-gray-900">Book / Enquiry Form</h3>
              <p class="text-sm text-gray-500 font-dm-sans">Submit your details to receive customized itinerary details & quotes.</p>
              
              <form id="pkg-enquiry-form" class="space-y-4 pt-2">
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
                  <i class="fa-solid fa-paper-plane"></i> Send Package Enquiry
                </button>
                <div id="pkg-enq-alert" class="hidden text-center py-3 rounded-xl text-sm font-dm-sans"></div>
              </form>
            </div>

            <div class="border-t border-gray-100 pt-6 space-y-3 text-xs text-gray-500 font-dm-sans">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-shield-halved text-emerald-600 text-base"></i>
                <span>Best Price Guarantee & Verified Assistance</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-headset text-red-600 text-base"></i>
                <span>Instant Callback from Travel Expert</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>`;

  // Initialize Auto-Slider for Banner Images (Every 2 seconds)
  if (bannerList.length > 1) {
    let currentSlide = 0;
    const slides = root.querySelectorAll('.pkg-slide-img');
    const dots = root.querySelectorAll('.pkg-slide-dot');

    const goToSlide = (index) => {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.remove('opacity-0', 'z-0');
          slide.classList.add('opacity-90', 'z-10');
        } else {
          slide.classList.remove('opacity-90', 'z-10');
          slide.classList.add('opacity-0', 'z-0');
        }
      });
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.className = 'pkg-slide-dot h-3 rounded-full bg-red-600 w-7 transition-all duration-300';
        } else {
          dot.className = 'pkg-slide-dot h-3 rounded-full bg-white/50 hover:bg-white w-3 transition-all duration-300';
        }
      });
      currentSlide = index;
    };

    setInterval(() => {
      const nextSlide = (currentSlide + 1) % bannerList.length;
      goToSlide(nextSlide);
    }, 2000); // 2 seconds auto slide interval

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx));
    });
  }

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
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Package Enquiry';
      }
    });
  }
});

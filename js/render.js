/**
 * render.js — 100% exact DOM card render functions matching mangalamtravel.com
 */

(function (window) {
    function destinationCard(destination) {
        if (!destination) return '';
        const dSlug = destination.slug_url || destination.slug || '';
        const destinationUrl = dSlug ? `packages.html?slug=${encodeURIComponent(dSlug)}&type=package` : 'curated-itineraries.html';
        const title = destination.destination_name || destination.title || destination.name || '';
        const rawDesc = (destination.description || '').replace(/<[^>]*>?/gm, '').trim();
        const destImg = destination.card_image || destination.image || '';
        const imgPath = MT.resolveImg(destImg) || './assets/images/destination-placeholder.jpg';

        return `
      <a href="${destinationUrl}" class="relative rounded-3xl overflow-hidden h-[400px] block cursor-pointer group">
          <img src="${imgPath}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 class="text-3xl font-bold mb-3 font-[Quicksand]">${title}</h3>
              ${rawDesc ? `<p class="text-base leading-relaxed font-dm-sans line-clamp-2">${rawDesc}</p>` : ''}
          </div>
      </a>`;
    }

    function ticketCard(ticket) {
        const imgFile = ticket.card_image || ticket.image || 'ticket-card-1.webp';
        const imagePath = MT.resolveImg(imgFile) || './assets/images/logo-color.png';
        const tktTitle = ticket.title || ticket.short_title || 'Attraction Ticket';
        const tktAmount = ticket.display_amount || ticket.amount || ticket.adult_price || 0;
        const destName = ticket.destination_name || ticket.destination || 'Global';
        const detailUrl = `ticket-details.html?id=${encodeURIComponent(ticket.ticket_id || ticket.slug_url || ticket.id || '')}`;

        return `
      <li class="splide__slide">
          <a href="${detailUrl}" class="block">
              <div class="rounded-3xl cursor-pointer group">
                  <div class="relative overflow-hidden rounded-3xl">
                      <img src="${imagePath}" alt="${tktTitle}" class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src='./assets/images/logo-color.png';">
                  </div>
                  <div class="mt-3">
                      <div class="flex items-center text-sm mb-1 font-[Quicksand] text-red-500">
                          <i class="fi fi-rr-marker mr-1.5"></i>
                          <span>${destName}</span>
                      </div>
                      <h3 class="text-lg font-bold font-dm-sans text-gray-800 leading-tight line-clamp-2">${tktTitle}</h3>
                      ${Number(tktAmount) > 0 ? `<div class="text-base font-semibold font-dm-sans text-gray-800 mt-1">₹ ${Number(tktAmount).toLocaleString('en-IN')}</div>` : ''}
                  </div>
              </div>
          </a>
      </li>`;
    }

    function blogCard(blog, index = 0) {
        const title = blog.title || 'Travel Insights';
        const slug = blog.slug_url || blog.slug || blog.blog_id || blog.id || '';
        const imgStr = blog.card_image || blog.banner_image || (blog.images && blog.images.length > 0 ? (typeof blog.images[0] === 'object' ? (blog.images[0].file_name || blog.images[0].name || blog.images[0].image) : blog.images[0]) : '');
        const blogImagePath = MT.resolveImg(imgStr) || './assets/images/logo-color.png';
        const date = blog.date || '';
        const url = `blog-details.html?slug=${encodeURIComponent(slug)}`;
        const excerpt = blog.description || (blog.content ? blog.content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 100) + '...' : 'Explore inspiring journeys, destination highlights, and expert travel tips.');
        const category = blog.category || 'Travel Guide';

        return `
      <li class="splide__slide">
          <a href="${url}" class="group block h-full">
              <div class="bg-white rounded-[26px] border border-gray-100 shadow-md shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full">
                  <!-- Square / Compact Image Box -->
                  <div class="relative h-56 w-full overflow-hidden bg-slate-900">
                      <img src="${blogImagePath}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" onerror="this.onerror=null; this.src='./assets/images/logo-color.png';">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      
                      <!-- Category Pill Badge (Top Left) -->
                      <div class="absolute top-4 left-4 z-10">
                          <span class="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider font-dm-sans shadow-md">
                              ${category}
                          </span>
                      </div>

                      <!-- Date Badge (Top Right) -->
                      ${date ? `
                      <div class="absolute top-4 right-4 z-10">
                          <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/20">
                              <i class="fa-regular fa-calendar mr-1 text-red-400"></i> ${date}
                          </span>
                      </div>` : ''}
                  </div>

                  <!-- Card Body -->
                  <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div class="space-y-2">
                          <h3 class="text-lg font-bold font-[Quicksand] text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                              ${title}
                          </h3>
                          <p class="text-gray-500 font-dm-sans text-xs line-clamp-2 leading-relaxed">
                              ${excerpt}
                          </p>
                      </div>

                      <!-- Footer / Read Action -->
                      <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-red-600 font-dm-sans">
                          <span>Read Article</span>
                          <span class="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                              <i class="fa-solid fa-arrow-right text-[11px]"></i>
                          </span>
                      </div>
                  </div>
              </div>
          </a>
      </li>`;
    }

    function testimonialCard(testi) {
        const name = testi.name || 'Happy Traveller';
        const location = testi.location || testi.country || '';
        const text = testi.feedback || testi.review || testi.text || '';
        const rating = Number(testi.rating || 5);
        const stars = Array(rating).fill('<i class="fas fa-star text-yellow-400 text-sm"></i>').join('');

        return `
      <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
          <div>
              <div class="flex items-center space-x-1 mb-6">${stars}</div>
              <p class="text-gray-600 text-base leading-relaxed font-dm-sans mb-8">"${text}"</p>
          </div>
          <div class="flex items-center space-x-4 border-t border-gray-100 pt-6">
              <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg font-[Quicksand]">
                  ${name.charAt(0)}
              </div>
              <div>
                  <h4 class="font-bold text-gray-900 font-dm-sans">${name}</h4>
                  ${location ? `<p class="text-xs text-gray-500 font-dm-sans">${location}</p>` : ''}
              </div>
          </div>
      </div>`;
    }

    function partnerLogo(partner) {
        const name = partner.name || partner.partner_name || 'Partner';
        const rawImg = (partner.image || partner.logo || '').trim();
        const isDummyLogo = !rawImg || rawImg.includes('logo-color.png') || rawImg.includes('partner-placeholder.png');
        const imgUrl = !isDummyLogo ? MT.resolveImg(rawImg) : null;

        return `
      <div class="partner-card flex items-center justify-center p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white shadow-sm hover:shadow-md transition-all h-24 min-w-[160px]">
          ${imgUrl 
            ? `<img src="${imgUrl}" alt="${name}" class="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'font-bold text-slate-800 text-xs md:text-sm text-center font-dm-sans leading-snug\\'>${name}</span>';">`
            : `<span class="font-bold text-slate-800 text-xs md:text-sm text-center font-dm-sans leading-snug">${name}</span>`
          }
      </div>`;
    }

    function packageCard(pkg) {
        const title = pkg.package_name || pkg.title || pkg.name || 'Tour Package';
        const slug = pkg.slug_url || pkg.slug || '';
        const img = MT.resolveImg(pkg.card_image || pkg.banner_image || pkg.image);
        const price = pkg.amount || pkg.price;
        const nights = pkg.nights || '';
        const days = pkg.days || '';
        const url = `package-details.html?slug=${encodeURIComponent(slug || pkg.package_id || pkg.id || '')}`;
        const rawType = String(pkg.type || 'Curated').toLowerCase();
        const overview = pkg.overview || pkg.description || '';
        const destName = pkg.destination_name || (window.DESTINATIONS_MAP && window.DESTINATIONS_MAP[pkg.destination_id]) || 'Global Destination';
        const inclusions = pkg.hotel_type ? `${pkg.hotel_type} & Sightseeing Included` : (pkg.inclusions || pkg.transfers || 'Hotel Stay & Guided Tours Included');

        // Type badge label & colors
        const typeConfig = {
            'honeymoon': { label: 'Honeymoon', color: 'bg-rose-500 text-white', icon: 'fa-solid fa-heart' },
            'curated':   { label: 'Curated',   color: 'bg-indigo-600 text-white', icon: 'fa-solid fa-sparkles' },
            'luxury':    { label: 'Luxury',    color: 'bg-yellow-400 text-slate-900', icon: 'fa-solid fa-crown' },
            'adventure': { label: 'Adventure', color: 'bg-amber-500 text-white', icon: 'fa-solid fa-compass' },
            'family':    { label: 'Family',    color: 'bg-purple-600 text-white', icon: 'fa-solid fa-users' },
            'fixed':     { label: 'Group Tour',color: 'bg-emerald-600 text-white', icon: 'fa-solid fa-people-group' },
            'package':   { label: 'Featured',  color: 'bg-red-600 text-white', icon: 'fa-solid fa-star' }
        };
        const badge = typeConfig[rawType] || { label: (rawType.charAt(0).toUpperCase() + rawType.slice(1)), color: 'bg-red-600 text-white', icon: 'fa-solid fa-sparkles' };

        // Duration text
        let durationText = '';
        if (nights && days) durationText = `${nights}N / ${days}D`;
        else if (days) durationText = `${days} Days`;
        else if (nights) durationText = `${nights} Nights`;

        return `
      <div class="group bg-white rounded-[28px] border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
          <!-- Image Box & Badges -->
          <div class="relative h-56 w-full overflow-hidden bg-slate-900">
              <img src="${img}" alt="${title}" class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" onerror="this.src='./assets/images/logo-color.png'">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <!-- Category Badge (Top Left) -->
              <div class="absolute top-4 left-4 z-10">
                  <span class="px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider font-dm-sans shadow-md ${badge.color}">
                      <i class="${badge.icon} mr-1"></i> ${badge.label}
                  </span>
              </div>

              <!-- Duration Pill (Top Right) -->
              ${durationText ? `
              <div class="absolute top-4 right-4 z-10">
                  <span class="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/20">
                      <i class="fa-regular fa-clock mr-1 text-yellow-400"></i> ${durationText}
                  </span>
              </div>` : ''}

              <!-- Location (Bottom Left Overlay) -->
              <div class="absolute bottom-3 left-4 z-10 text-white text-xs font-dm-sans flex items-center gap-1.5 font-medium drop-shadow">
                  <i class="fa-solid fa-location-dot text-red-500"></i> ${destName}
              </div>
          </div>

          <!-- Card Body -->
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                  <h3 class="text-xl font-bold font-[Quicksand] text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      <a href="${url}">${title}</a>
                  </h3>
                  ${overview ? `
                  <p class="text-gray-500 font-dm-sans text-sm line-clamp-2 leading-relaxed">
                      ${overview}
                  </p>` : ''}
                  ${inclusions ? `
                  <div class="pt-2 flex items-center gap-2 text-xs text-emerald-700 font-dm-sans font-medium">
                      <i class="fa-solid fa-circle-check text-emerald-500"></i>
                      <span class="truncate">${inclusions}</span>
                  </div>` : ''}
              </div>

              <!-- Card Footer & Action Button -->
              <div class="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                      <span class="text-[11px] text-gray-400 font-bold uppercase tracking-wider block font-dm-sans">Starting From</span>
                      ${price ? `<div class="text-lg font-extrabold text-gray-900 font-[Quicksand]">₹ ${Number(price).toLocaleString('en-IN')} <span class="text-xs text-gray-400 font-dm-sans font-normal">/ person</span></div>` : '<div class="text-base font-bold text-gray-900 font-[Quicksand]">On Request</div>'}
                  </div>
                  <a href="${url}" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider font-dm-sans group-hover:bg-red-600 hover:bg-red-600 transition-all shadow-md">
                      <span>View Box</span>
                      <i class="fa-solid fa-arrow-right text-xs"></i>
                  </a>
              </div>
          </div>
      </div>`;
    }

    function collectionSection(col, idx = 0) {
        if (!col) return '';
        const title = col.title || 'Featured Collection';
        const subtitle = col.subtitle || '';
        const pkgs = Array.isArray(col.packages) ? col.packages : [];
        if (!pkgs.length) return '';

        const cardsHtml = pkgs.map(p => packageCard(p)).join('');

        return `
      <section class="collection-block container mx-auto px-4" data-aos="fade-up" data-aos-delay="${(idx % 3) * 100}">
          <div class="mb-8 lg:mb-12">
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                      <div class="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200/60 rounded-full text-red-600 font-bold text-xs uppercase tracking-wider font-dm-sans mb-3">
                          <i class="fas fa-sparkles text-[10px]"></i> Curated Collection
                      </div>
                      <h2 class="text-2xl lg:text-4xl font-bold text-gray-900 font-[Quicksand] leading-tight">
                          ${title}
                      </h2>
                      ${subtitle ? `<p class="text-gray-500 font-dm-sans text-sm md:text-base mt-2 max-w-2xl">${subtitle}</p>` : ''}
                  </div>
                  <a href="packages.html" class="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 font-dm-sans group whitespace-nowrap">
                      <span>Explore All Packages</span>
                      <i class="fi fi-rr-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                  </a>
              </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              ${cardsHtml}
          </div>
      </section>`;
    }

    function attractionCard(a) {
        if (!a) return '';
        const title = a.name || a.title || 'Attraction';
        const slug = a.slug_url || a.slug || '';
        const link = `attraction-details.html?slug=${encodeURIComponent(slug || a.id || a.attraction_id)}`;
        const img = MT.resolveImg(a.card_image || a.banner_image || a.image);
        const expType = a.experience_type || 'Cultural';
        const duration = a.duration || '2-3 Hours';
        const dest = a.destination_name || 'Destination';
        const price = a.price || a.amount ? `₹ ${Number(a.price || a.amount).toLocaleString('en-IN')}` : 'Included';
        const desc = a.description || a.overview || '';
        const included = a.included || '';

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
          
          <!-- Experience Type Badge -->
          <div class="absolute top-4 left-4 z-10">
            <span class="px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider font-dm-sans shadow-md ${badgeColor}">
              <i class="fa-solid fa-sparkles mr-1"></i> ${expType}
            </span>
          </div>

          <!-- Duration Pill -->
          <div class="absolute top-4 right-4 z-10">
            <span class="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/20">
              <i class="fa-regular fa-clock mr-1 text-yellow-400"></i> ${duration}
            </span>
          </div>

          <!-- Location -->
          <div class="absolute bottom-3 left-4 z-10 text-white text-xs font-dm-sans flex items-center gap-1 font-medium drop-shadow">
            <i class="fa-solid fa-location-dot text-red-500"></i> ${dest}
          </div>
        </div>

        <!-- Body -->
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

          <!-- Footer & Action -->
          <div class="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <div>
              <span class="text-xs uppercase tracking-wider text-gray-400 font-bold font-dm-sans block">Starting from</span>
              <div class="text-xl font-extrabold text-gray-900 font-[Quicksand]">${price}</div>
            </div>
            <a href="${link}" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider font-dm-sans group-hover:bg-red-600 hover:bg-red-600 transition-all shadow-md">
              <span>View Details</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>
        </div>
      </div>`;
    }

    window.R = {
        destinationCard,
        ticketCard,
        blogCard,
        testimonialCard,
        partnerLogo,
        packageCard,
        attractionCard,
        collectionSection
    };
})(window);

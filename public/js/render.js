/**
 * render.js — 100% exact DOM card render functions matching mangalamtravel.com
 */

(function (window) {
    function getCountryFlagImg(destName) {
      const name = (destName || '').toLowerCase().trim();
      if (!name) return 'https://flagcdn.com/w40/in.png';

      // Comprehensive Mapping for All Major International & Domestic Travel Destinations
      const COUNTRY_MAP = [
        // Central Asia & Caucasus
        { code: 'kz', keys: ['kazakhstan', 'kazhakistan', 'kazakstan', 'almaty', 'astana', 'nur-sultan', 'shymkent'] },
        { code: 'az', keys: ['azerbaijan', 'baku', 'gabala', 'sheki'] },
        { code: 'ge', keys: ['georgia', 'tbilisi', 'batumi', 'kazbegi', 'kutaisi'] },
        { code: 'am', keys: ['armenia', 'yerevan', 'gyumri'] },
        { code: 'uz', keys: ['uzbekistan', 'tashkent', 'samarkand', 'bukhara', 'khiva'] },
        { code: 'kg', keys: ['kyrgyzstan', 'bishkek', 'issyk-kul'] },
        { code: 'tj', keys: ['tajikistan', 'dushanbe'] },
        { code: 'tm', keys: ['turkmenistan', 'ashgabat'] },

        // Middle East
        { code: 'ae', keys: ['dubai', 'uae', 'united arab emirates', 'abu dhabi', 'sharjah', 'ras al khaimah', 'fujairah', 'ajman'] },
        { code: 'sa', keys: ['saudi', 'saudi arabia', 'riyadh', 'jeddah', 'mecca', 'medina', 'alula', 'dammam'] },
        { code: 'qa', keys: ['qatar', 'doha'] },
        { code: 'om', keys: ['oman', 'muscat', 'salalah'] },
        { code: 'bh', keys: ['bahrain', 'manama'] },
        { code: 'kw', keys: ['kuwait'] },
        { code: 'jo', keys: ['jordan', 'amman', 'petra', 'dead sea', 'wadi rum'] },
        { code: 'lb', keys: ['lebanon', 'beirut'] },
        { code: 'tr', keys: ['turkey', 'türkiye', 'istanbul', 'antalya', 'cappadocia', 'bodrum', 'ankara', 'izmir', 'pamukkale'] },
        { code: 'eg', keys: ['egypt', 'cairo', 'alexandria', 'sharm', 'sharm el sheikh', 'hurghada', 'luxor', 'giza', 'aswan'] },
        { code: 'il', keys: ['israel', 'jerusalem', 'tel aviv'] },

        // Southeast Asia
        { code: 'th', keys: ['thailand', 'phuket', 'bangkok', 'pattaya', 'krabi', 'chiang mai', 'koh samui', 'hua hin'] },
        { code: 'sg', keys: ['singapore', 'sentosa'] },
        { code: 'my', keys: ['malaysia', 'kuala lumpur', 'langkawi', 'genting', 'penang', 'borneo', 'sabah', 'kota kinabalu'] },
        { code: 'id', keys: ['bali', 'indonesia', 'jakarta', 'lombok', 'ubud', 'seminyak', 'komodo', 'gili'] },
        { code: 'vn', keys: ['vietnam', 'hanoi', 'da nang', 'ho chi minh', 'saigon', 'phu quoc', 'halong', 'ha long', 'nha trang', 'hoi an'] },
        { code: 'ph', keys: ['philippines', 'manila', 'boracay', 'cebu', 'palawan', 'el nido'] },
        { code: 'kh', keys: ['cambodia', 'siem reap', 'phnom penh', 'angkor'] },
        { code: 'la', keys: ['laos', 'vientiane', 'luang prabang'] },
        { code: 'mm', keys: ['myanmar', 'burma', 'yangon', 'mandalay', 'bagan'] },

        // South Asia & Indian Ocean
        { code: 'mv', keys: ['maldives', 'male', 'maafushi'] },
        { code: 'lk', keys: ['sri lanka', 'colombo', 'kandy', 'bentota', 'galle', 'nuwara eliya', 'sigiriya'] },
        { code: 'mu', keys: ['mauritius', 'port louis'] },
        { code: 'sc', keys: ['seychelles', 'mahe', 'praslin'] },
        { code: 'np', keys: ['nepal', 'kathmandu', 'pokhara', 'everest'] },
        { code: 'bt', keys: ['bhutan', 'thimphu', 'paro', 'punakha'] },

        // East Asia
        { code: 'jp', keys: ['japan', 'tokyo', 'kyoto', 'osaka', 'hokkaido', 'mount fuji', 'fuji', 'hiroshima'] },
        { code: 'kr', keys: ['korea', 'south korea', 'seoul', 'busan', 'jeju'] },
        { code: 'cn', keys: ['china', 'beijing', 'shanghai', 'guangzhou', 'shenzhen'] },
        { code: 'hk', keys: ['hong kong', 'hongkong'] },
        { code: 'mo', keys: ['macau', 'macao'] },
        { code: 'tw', keys: ['taiwan', 'taipei'] },

        // Europe
        { code: 'ch', keys: ['switzerland', 'swiss', 'zurich', 'geneva', 'lucerne', 'interlaken', 'alps', 'zermatt', 'grindelwald'] },
        { code: 'fr', keys: ['france', 'paris', 'nice', 'lyon', 'cannes', 'monaco', 'marseille', 'bordeaux'] },
        { code: 'gb', keys: ['uk', 'united kingdom', 'britain', 'england', 'london', 'scotland', 'edinburgh', 'manchester'] },
        { code: 'it', keys: ['italy', 'rome', 'venice', 'milan', 'florence', 'amalfi', 'naples', 'sicily', 'pisa', 'lake como'] },
        { code: 'es', keys: ['spain', 'barcelona', 'madrid', 'seville', 'ibiza', 'mallorca', 'valencia', 'granada', 'malaga', 'tenerife'] },
        { code: 'de', keys: ['germany', 'berlin', 'munich', 'frankfurt', 'bavaria', 'hamburg', 'cologne'] },
        { code: 'nl', keys: ['netherlands', 'holland', 'amsterdam', 'rotterdam'] },
        { code: 'be', keys: ['belgium', 'brussels', 'bruges', 'ghent', 'antwerp'] },
        { code: 'at', keys: ['austria', 'vienna', 'salzburg', 'innsbruck', 'hallstatt'] },
        { code: 'gr', keys: ['greece', 'athens', 'santorini', 'mykonos', 'crete', 'rhodes', 'corfu'] },
        { code: 'cz', keys: ['czech', 'czech republic', 'czechia', 'prague'] },
        { code: 'hu', keys: ['hungary', 'budapest'] },
        { code: 'pt', keys: ['portugal', 'lisbon', 'porto', 'algarve', 'madeira'] },
        { code: 'ie', keys: ['ireland', 'dublin', 'galway'] },
        { code: 'hr', keys: ['croatia', 'dubrovnik', 'split', 'zagreb', 'hvar'] },
        { code: 'no', keys: ['norway', 'oslo', 'bergen', 'tromso', 'fjords'] },
        { code: 'se', keys: ['sweden', 'stockholm', 'gothenburg'] },
        { code: 'fi', keys: ['finland', 'helsinki', 'lapland', 'rovaniemi'] },
        { code: 'dk', keys: ['denmark', 'copenhagen'] },
        { code: 'is', keys: ['iceland', 'reykjavik'] },
        { code: 'ru', keys: ['russia', 'moscow', 'st petersburg', 'saint petersburg'] },
        { code: 'pl', keys: ['poland', 'warsaw', 'krakow'] },
        { code: 'va', keys: ['vatican', 'vatican city'] },

        // Africa
        { code: 'ke', keys: ['kenya', 'nairobi', 'masai mara'] },
        { code: 'tz', keys: ['tanzania', 'zanzibar', 'serengeti', 'kilimanjaro'] },
        { code: 'za', keys: ['south africa', 'cape town', 'johannesburg', 'kruger', 'durban'] },
        { code: 'ma', keys: ['morocco', 'marrakech', 'casablanca', 'rabat', 'fez'] },

        // Americas & Oceania
        { code: 'us', keys: ['usa', 'united states', 'america', 'new york', 'california', 'florida', 'las vegas', 'hawaii', 'los angeles', 'san francisco', 'miami', 'orlando'] },
        { code: 'ca', keys: ['canada', 'toronto', 'vancouver', 'montreal', 'banff', 'niagara'] },
        { code: 'au', keys: ['australia', 'sydney', 'melbourne', 'brisbane', 'gold coast', 'cairns', 'perth'] },
        { code: 'nz', keys: ['new zealand', 'auckland', 'queenstown', 'wellington', 'christchurch', 'rotorua'] },
        { code: 'br', keys: ['brazil', 'rio de janeiro', 'rio', 'sao paulo'] },
        { code: 'ar', keys: ['argentina', 'buenos aires', 'patagonia'] },
        { code: 'pe', keys: ['peru', 'lima', 'cusco', 'machu picchu'] },
        { code: 'mx', keys: ['mexico', 'cancun', 'mexico city', 'tulum'] },

        // India / Domestic
        { code: 'in', keys: ['india', 'kerala', 'goa', 'delhi', 'kashmir', 'manali', 'rajasthan', 'ladakh', 'shimla', 'andaman', 'munnar', 'wayanad', 'ooty', 'jaipur', 'agra', 'mumbai', 'varanasi', 'alleppey', 'kochi', 'trivandrum', 'coorg', 'hampi', 'rishikesh', 'darjeeling', 'sikkim', 'gangtok', 'leh'] }
      ];

      for (const entry of COUNTRY_MAP) {
        if (entry.keys.some(k => name.includes(k))) {
          return `https://flagcdn.com/w40/${entry.code}.png`;
        }
      }

      return `https://flagcdn.com/w40/in.png`;
    }

    function destinationCard(destination) {
        if (!destination) return '';
        const dSlug = destination.slug_url || destination.slug || '';
        const destinationUrl = dSlug ? `packages.html?slug=${encodeURIComponent(dSlug)}&type=package` : 'curated-itineraries.html';
        const rawTitle = destination.destination_name || destination.title || destination.name || '';
        const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
        const rawDesc = (destination.description || '').replace(/<[^>]*>?/gm, '').trim();
        const destImg = destination.card_image || destination.inner_image || destination.image || '';
        const imgPath = MT.resolveImg(destImg) || './assets/images/destination-placeholder.jpg';
        
        const placesCount = Array.isArray(destination.places_to_visit) && destination.places_to_visit.length > 0 
          ? destination.places_to_visit.length 
          : '';
        const placesText = placesCount ? `${placesCount}+ Tourist Places` : 'Top Tourist Destination';
        const flagUrl = getCountryFlagImg(title);

        return `
      <a href="${destinationUrl}" class="block group h-full select-none">
        <div class="relative rounded-3xl bg-white shadow-md hover:shadow-xl transition-all duration-500 flex flex-col h-[420px] group-hover:-translate-y-1.5 overflow-visible">
          
          <!-- Top Hero Image Container (2/3 of container height) -->
          <div class="relative w-full h-[280px] rounded-t-3xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img src="${imgPath}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" onerror="this.onerror=null; this.src='./assets/images/destination-placeholder.jpg';">
          </div>

          <!-- Bottom Overlapping White Content Box (1/3 of container height) -->
          <div class="relative bg-white rounded-t-3xl rounded-b-3xl -mt-6 p-4 sm:p-5 pt-6 flex flex-col justify-between flex-1 z-10 shadow-sm">
            
            <!-- Round Flag Badge Floating on Top-Left -->
            <div class="absolute -top-5 left-5 sm:left-6 w-11 h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1.5 flex-shrink-0 z-20 overflow-hidden">
              <img src="${flagUrl}" alt="${title} Flag" class="w-full h-full object-cover rounded-full" onerror="this.style.display='none'">
            </div>

            <div>
              <!-- Subtitle / Places Count -->
              <span class="text-slate-400 font-medium text-[11px] sm:text-xs tracking-tight block mb-0.5 mt-0.5">${placesText}</span>
              
              <!-- Pink Accent Title -->
              <h3 class="text-xl sm:text-2xl font-bold font-[Quicksand] text-pink-600 mb-1 leading-tight group-hover:text-rose-600 transition-colors capitalize">${title}</h3>
              
              <!-- Description Text -->
              <p class="text-slate-500 text-xs leading-snug font-dm-sans line-clamp-1 sm:line-clamp-2">${rawDesc || 'Explore famous attractions, rich culture, and curated travel experiences.'}</p>
            </div>

            <!-- Footer Divider & Explore Link -->
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span class="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 group-hover:text-pink-600 transition-colors">
                Explore <i class="fas fa-arrow-right text-[10px] sm:text-xs group-hover:translate-x-1.5 transition-transform duration-300"></i>
              </span>
            </div>
          </div>

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

/**
 * render.js — 100% exact DOM card render functions matching mangalamtravel.com
 */

(function (window) {
    function destinationCard(destination) {
        const dSlug = destination.slug_url || destination.slug || '';
        const destinationUrl = dSlug ? `/package.php?slug=${encodeURIComponent(dSlug)}&type=package` : '/curated-itineraries.php';
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
        const detailUrl = `/tickets-details.php?id=${encodeURIComponent(ticket.ticket_id || ticket.slug_url || ticket.id || '')}`;

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
        const title = blog.title || '';
        const slug = blog.slug_url || blog.slug || '';
        const imgStr = blog.card_image || (blog.images && blog.images.length > 0 ? (typeof blog.images[0] === 'object' ? (blog.images[0].file_name || blog.images[0].name || blog.images[0].image) : blog.images[0]) : '');
        const blogImagePath = MT.resolveImg(imgStr) || './assets/images/logo-color.png';
        const date = blog.date || '';

        return `
      <li class="splide__slide">
          <a href="/blog-details.php?slug=${encodeURIComponent(slug)}" class="group block">
              <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                  <div class="relative overflow-hidden h-64">
                      <img src="${blogImagePath}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src='./assets/images/logo-color.png';">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div class="p-6">
                      ${date ? `<div class="flex items-center text-gray-500 text-sm mb-3">
                          <i class="fi fi-rr-calendar mr-2"></i>
                          <span class="font-dm-sans">${date}</span>
                      </div>` : ''}
                      <h3 class="text-xl font-bold text-gray-900 font-dm-sans mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                          ${title}
                      </h3>
                      <div class="flex items-center text-red-600 font-dm-sans font-semibold">
                          <span>Read More</span>
                          <i class="fi fi-rr-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
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
        const img = MT.resolveImg(partner.image || partner.logo) || './assets/images/partner-placeholder.png';
        const name = partner.name || partner.partner_name || 'Partner';

        return `
      <div class="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-center h-20 shadow-sm hover:shadow-md transition-shadow">
          <img src="${img}" alt="${name}" class="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all">
      </div>`;
    }

    function packageCard(pkg) {
        const title = pkg.package_name || pkg.title || pkg.name || '';
        const slug = pkg.slug_url || pkg.slug || '';
        const img = MT.resolveImg(pkg.card_image || pkg.image);
        const price = pkg.amount || pkg.price;
        const nights = pkg.nights || '';
        const days = pkg.days || '';
        const url = `/package-details.php?slug=${encodeURIComponent(slug)}`;

        return `
      <a href="${url}" class="block group rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
          <div class="relative overflow-hidden h-64">
              <img src="${img}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='./assets/images/logo-color.png'">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              ${nights || days ? `<div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full font-dm-sans">${nights}N / ${days}D</div>` : ''}
          </div>
          <div class="p-6">
              <h3 class="text-xl font-bold font-dm-sans text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">${title}</h3>
              ${price ? `<div class="text-lg font-bold text-gray-900 font-[Quicksand] mt-4">₹ ${Number(price).toLocaleString('en-IN')} <span class="text-xs text-gray-500 font-dm-sans font-normal">/ person</span></div>` : ''}
          </div>
      </a>`;
    }

    window.R = {
        destinationCard,
        ticketCard,
        blogCard,
        testimonialCard,
        partnerLogo,
        packageCard
    };
})(window);

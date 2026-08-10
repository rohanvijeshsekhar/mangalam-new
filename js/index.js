/**
 * index.js — Homepage data loader for mangalamtravel.com static HTML
 */

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadPosters(),
    loadDestinations(),
    loadTickets(),
    loadTestimonials(),
    loadPartners(),
    loadBlogs()
  ]);
  initCarousels();
});

async function loadPosters() {
  const section = document.getElementById('poster-section');
  const list = document.getElementById('poster-list');
  if (!section || !list) return;
  const posters = await MT.apiGet('/api/posters');
  if (!posters || !posters.length) return;
  list.innerHTML = posters.map(p => {
    const img = MT.resolveImg(p.image) || `./admin/files/posters/${p.image}`;
    const alt = p.alt_text || 'Special Travel Offer';
    return `<li class="splide__slide">
      <div class="rounded-3xl overflow-hidden shadow-lg h-auto">
        <img src="${img}" alt="${alt}" class="w-full h-auto object-cover">
      </div>
    </li>`;
  }).join('');
  section.style.display = '';
}

async function loadDestinations() {
  const gridEl = document.getElementById('destinations-grid');
  const destList = document.querySelector('#destinationCarousel .splide__list');
  const navCarousel = document.getElementById('destinationNavCarousel');
  const dests = await MT.apiGet('/api/destinations');

  if (!dests || !dests.length) {
    if (navCarousel) navCarousel.style.display = 'none';
    if (destList) {
      const emptySlide = `
        <li class="splide__slide">
            <div class="relative rounded-[32px] overflow-hidden h-[480px] lg:h-[540px]">
                <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white text-left">
                    <h3 class="text-3xl font-bold mb-2 font-[Quicksand] tracking-wide text-white">No Destinations Available</h3>
                    <p class="text-sm md:text-base leading-relaxed font-dm-sans line-clamp-2 text-white/90">Please check back later for exciting destinations.</p>
                </div>
            </div>
        </li>`;
      destList.innerHTML = emptySlide.repeat(4);
    } else if (gridEl) {
      gridEl.innerHTML = '<p class="col-span-full text-center text-gray-400 py-16">No destinations available at the moment.</p>';
    }
    return;
  }

  // Icon strip
  const navList = document.querySelector('#destinationNavCarousel .splide__list');
  if (navList) {
    navList.innerHTML = dests.map(d => {
      const dName = d.destination_name || d.name || d.title || '';
      const dSlug = d.slug_url || d.slug || '';
      const url = `packages.html?slug=${encodeURIComponent(dSlug)}&type=package`;
      return `<li class="splide__slide">
        <a href="${url}" class="flex flex-col items-center max-w-7xl cursor-pointer relative">
          <span class="text-xs font-dm-sans text-gray-600 font-bold hover:text-red-500 transition-colors duration-300 uppercase">${dName}</span>
        </a>
      </li>`;
    }).join('');
    if (navCarousel) navCarousel.style.display = '';
  }

  // Cards carousel / grid
  if (destList) {
    destList.innerHTML = dests.map(d => `<li class="splide__slide">${R.destinationCard(d)}</li>`).join('');
  } else if (gridEl) {
    gridEl.innerHTML = dests.map(d => R.destinationCard(d)).join('');
  }

  // Populate hero search dropdowns
  const dropdownItems = dests.map(d => {
    const name = d.destination_name || d.name || '';
    const slug = d.slug_url || d.slug || '';
    return `<div class="px-4 py-2 hover:bg-gray-100 cursor-pointer font-dm-sans text-sm destination-menu-item" data-value="${name}" data-slug="${slug}">${name}</div>`;
  }).join('');

  document.querySelectorAll('#destinationMenu .py-2, #destinationMenu2 .destination-menu-scroll').forEach(menu => {
    menu.insertAdjacentHTML('beforeend', dropdownItems);
  });
}

async function loadTickets() {
  const section = document.getElementById('home-tickets-section');
  const carousel = document.getElementById('ticketsCarousel');
  const list = document.querySelector('#ticketsCarousel .splide__list');
  const viewAllBtn = document.getElementById('view-all-tickets-btn');

  const tickets = await MT.apiGet('/api/tickets');
  if (!tickets || !tickets.length) {
    if (section) section.style.display = '';
    if (viewAllBtn) viewAllBtn.style.display = 'none';
    if (carousel) {
      carousel.outerHTML = `
        <div class="flex flex-col items-center justify-center py-8 text-center" data-aos="fade-up">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
            </svg>
            <h3 class="text-xl md:text-2xl font-bold text-slate-800 font-[Quicksand] mb-2">No Tickets Available</h3>
            <p class="text-gray-500 font-dm-sans text-sm md:text-base">We are currently updating our tickets. Please check back later!</p>
        </div>
      `;
    }
    return;
  }
  if (!list) return;
  if (section) section.style.display = '';
  if (viewAllBtn) viewAllBtn.style.display = '';
  list.innerHTML = tickets.map(t => R.ticketCard(t)).join('');
}

async function loadTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  const testimonials = await MT.apiGet('/api/testimonials');
  if (!testimonials || !testimonials.length) return;
  grid.innerHTML = testimonials.slice(0, 6).map(t => R.testimonialCard(t)).join('');
}

async function loadPartners() {
  const grid = document.getElementById('partners-grid');
  if (!grid) return;
  const partners = await MT.apiGet('/api/partners');
  if (!partners || !partners.length) return;
  grid.innerHTML = partners.map(p => R.partnerLogo(p)).join('');
}

async function loadBlogs() {
  const section = document.getElementById('home-blog-section');
  const carousel = document.getElementById('blogCarousel');
  const list = document.querySelector('#blogCarousel .splide__list');
  const viewAllBtn = document.getElementById('view-all-blogs-btn');

  const blogs = await MT.apiGet('/api/blogs');
  if (!blogs || !blogs.length) {
    if (section) section.style.display = '';
    if (viewAllBtn) viewAllBtn.style.display = 'none';
    if (carousel) {
      carousel.outerHTML = `
        <div class="flex flex-col items-center justify-center py-8 text-center" data-aos="fade-up">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-xl md:text-2xl font-bold text-slate-800 font-[Quicksand] mb-2">No Blog Posts Yet</h3>
            <p class="text-gray-500 font-dm-sans text-sm md:text-base">Check back soon for exciting travel stories and tips!</p>
        </div>
      `;
    }
    return;
  }
  if (!list) return;
  if (section) section.style.display = '';
  if (viewAllBtn) viewAllBtn.style.display = '';
  list.innerHTML = blogs.slice(0, 6).map((b, i) => R.blogCard(b, i)).join('');
}

function initCarousels() {
  if (window.Splide) {
    const posterEl = document.getElementById('posterCarousel');
    if (posterEl) {
      const cnt = posterEl.querySelectorAll('.splide__slide').length;
      if (cnt > 0) new Splide('#posterCarousel', { type: cnt > 1 ? 'loop' : 'slide', autoplay: cnt > 1, interval: 4000, arrows: false, pagination: true, perPage: 1 }).mount();
    }

    const navEl = document.getElementById('destinationNavCarousel');
    if (navEl) {
      const cnt = navEl.querySelectorAll('.splide__slide').length;
      if (cnt > 0) new Splide('#destinationNavCarousel', { autoWidth: true, gap: '2rem', pagination: false, arrows: false }).mount();
    }

    const destEl = document.getElementById('destinationCarousel');
    if (destEl) {
      const cnt = destEl.querySelectorAll('.splide__slide').length;
      if (cnt > 0) {
        new Splide('#destinationCarousel', {
          type: cnt > 4 ? 'loop' : 'slide',
          perPage: 4,
          gap: '1.5rem',
          arrows: true,
          pagination: false,
          drag: true,
          keyboard: true,
          autoplay: false,
          breakpoints: {
            1199: { perPage: 4 },
            991: { perPage: 3 },
            767: { perPage: 2 },
            575: { perPage: 1 }
          }
        }).mount();
      }
    }

    const tktEl = document.getElementById('ticketsCarousel');
    if (tktEl) {
      const cnt = tktEl.querySelectorAll('.splide__slide').length;
      if (cnt > 0) {
        new Splide('#ticketsCarousel', {
          type: cnt > 4 ? 'loop' : 'slide',
          perPage: Math.min(4, Math.max(1, cnt)),
          gap: '1.5rem',
          arrows: cnt > 1,
          breakpoints: { 1024: { perPage: Math.min(3, Math.max(1, cnt)) }, 768: { perPage: Math.min(2, Math.max(1, cnt)) }, 480: { perPage: 1 } }
        }).mount();
      }
    }

    const blogEl = document.getElementById('blogCarousel');
    if (blogEl) {
      const cnt = blogEl.querySelectorAll('.splide__slide').length;
      if (cnt > 0) {
        new Splide('#blogCarousel', {
          type: cnt > 3 ? 'loop' : 'slide',
          perPage: Math.min(3, Math.max(1, cnt)),
          gap: '1.5rem',
          arrows: cnt > 1,
          breakpoints: { 1024: { perPage: Math.min(2, Math.max(1, cnt)) }, 640: { perPage: 1 } }
        }).mount();
      }
    }
  }
  if (window.AOS) AOS.refresh();
}

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
            <div class="relative rounded-3xl overflow-hidden h-[400px] bg-gradient-to-b from-gray-200 via-gray-400 to-gray-800">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 class="text-3xl font-bold mb-3 font-[Quicksand]">No Destinations Available</h3>
                    <p class="text-base leading-relaxed font-dm-sans">Please check back later for exciting destinations.</p>
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
      const url = `/package.php?slug=${encodeURIComponent(dSlug)}&type=package`;
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
  const list = document.querySelector('#ticketsCarousel .splide__list');
  if (!list) return;
  const tickets = await MT.apiGet('/api/tickets');
  if (!tickets || !tickets.length) {
    list.innerHTML = `<li class="splide__slide"><div class="rounded-3xl p-6 text-center"><p class="text-gray-600 font-dm-sans">No tickets available at the moment.</p></div></li>`;
    return;
  }
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
  const list = document.querySelector('#blogCarousel .splide__list');
  if (!list) return;
  const blogs = await MT.apiGet('/api/blogs');
  if (!blogs || !blogs.length) return;
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
      if (cnt > 0) new Splide('#destinationNavCarousel', { autoWidth: true, gap: '2rem', pagination: false, arrows: cnt > 3 }).mount();
    }

    const destEl = document.getElementById('destinationCarousel');
    if (destEl) {
      const cnt = destEl.querySelectorAll('.splide__slide').length;
      if (cnt > 0) {
        new Splide('#destinationCarousel', {
          type: cnt > 3 ? 'loop' : 'slide',
          perPage: Math.min(3, Math.max(1, cnt)),
          gap: '1.5rem',
          arrows: cnt > 1,
          breakpoints: { 1024: { perPage: Math.min(2, Math.max(1, cnt)) }, 640: { perPage: 1 } }
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

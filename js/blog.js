/** blog.js — Blog listing page */
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const blogs = await MT.apiGet('/api/blogs');
  if (!blogs || !blogs.length) {
    grid.innerHTML = `
      <div class="col-span-full py-20 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 text-2xl">
          <i class="fa-regular fa-newspaper"></i>
        </div>
        <h3 class="text-xl font-bold font-[Quicksand] text-gray-800 mb-1">No Blog Posts Yet</h3>
        <p class="text-gray-500 font-dm-sans text-sm">Check back soon for inspiring stories and travel guides!</p>
      </div>`;
    return;
  }

  grid.innerHTML = blogs.map(blog => {
    const title = blog.title || 'Travel Guide';
    const slug = blog.slug_url || blog.slug || blog.id || '';
    const imgStr = blog.card_image || blog.banner_image || (blog.images?.[0] ? (typeof blog.images[0] === 'object' ? blog.images[0].file_name : blog.images[0]) : '');
    const img = MT.resolveImg(imgStr) || './assets/images/banner-img.webp';
    const date = blog.date || '';
    const desc = blog.description || (blog.content ? blog.content.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 110) + '...' : '');
    const url = `blog-details.html?slug=${encodeURIComponent(slug)}`;
    const category = blog.category || 'Travel Guide';

    return `
      <a href="${url}" class="group block h-full">
        <div class="bg-white rounded-[28px] overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 flex flex-col h-full">
          <div class="relative h-60 w-full overflow-hidden bg-slate-900">
            <img src="${img}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" onerror="this.onerror=null; this.src='./assets/images/logo-color.png';">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute top-4 left-4 z-10">
              <span class="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider font-dm-sans shadow-md">
                ${category}
              </span>
            </div>
            ${date ? `
            <div class="absolute top-4 right-4 z-10">
              <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-semibold text-xs font-dm-sans border border-white/20">
                <i class="fa-regular fa-calendar mr-1 text-red-400"></i> ${date}
              </span>
            </div>` : ''}
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <h2 class="text-xl font-bold font-[Quicksand] text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">${title}</h2>
              ${desc ? `<p class="text-gray-500 font-dm-sans text-sm leading-relaxed line-clamp-3">${desc}</p>` : ''}
            </div>
            <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-red-600 font-dm-sans">
              <span>Read Full Article</span>
              <span class="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <i class="fa-solid fa-arrow-right text-[11px]"></i>
              </span>
            </div>
          </div>
        </div>
      </a>`;
  }).join('');
});

/** blog.js — Blog listing page */
document.addEventListener('DOMContentLoaded', async () => {
  const grid  = document.getElementById('blog-grid');
  const blogs = await MT.apiGet('/api/blogs');
  if (!grid) return;
  if (!blogs || !blogs.length) { grid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-20">No blog posts yet. Check back soon!</p>'; return; }
  grid.innerHTML = blogs.map(blog => {
    const title = blog.title || '';
    const slug  = blog.slug_url || blog.slug || '';
    const imgStr = blog.card_image || (blog.images?.[0] ? (typeof blog.images[0] === 'object' ? blog.images[0].file_name : blog.images[0]) : '');
    const img   = MT.resolveImg(imgStr) || `/admin/files/blogs/${imgStr}`;
    const date  = blog.date || '';
    const desc  = MT.truncate(blog.short_description || blog.description || '', 120);
    const url   = slug ? `/blog-details?slug=${encodeURIComponent(slug)}` : '#';
    return `
      <a href="${url}" class="block group">
        <div class="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-gray-100">
          <div class="relative overflow-hidden h-52">
            <img src="${img}" alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='/assets/images/logo-color.png'">
          </div>
          <div class="p-6">
            ${date ? `<p class="text-xs text-gray-400 font-dm-sans mb-2">${date}</p>` : ''}
            <h2 class="text-xl font-bold text-gray-900 font-dm-sans mb-3 group-hover:text-red-600 transition-colors line-clamp-2">${title}</h2>
            ${desc ? `<p class="text-gray-500 font-dm-sans text-sm leading-relaxed line-clamp-3">${desc}</p>` : ''}
            <div class="mt-4 text-red-600 font-dm-sans font-semibold flex items-center gap-1 text-sm">Read More <i class="fi fi-rr-arrow-right group-hover:translate-x-1 transition-transform"></i></div>
          </div>
        </div>
      </a>`;
  }).join('');
});

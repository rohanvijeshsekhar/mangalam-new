/** blog-details.js */
document.addEventListener('DOMContentLoaded', async () => {
  const slug = MT.qParam('slug');
  const root = document.getElementById('blog-detail-root');
  if (!root) return;
  const blogs = await MT.apiGet('/api/blogs');
  const b = blogs?.find(b => (b.slug_url || b.slug) === slug);
  if (!b) { root.innerHTML = '<div class="container mx-auto px-4 py-20 text-center"><p class="text-gray-500 text-xl">Post not found.</p><a href="/blog" class="mt-4 inline-block px-6 py-2 bg-black text-white rounded-xl font-dm-sans">Back to Blog</a></div>'; return; }
  const detail = await MT.apiGet(`/api/blogs/${b.id || b.blog_id}`);
  const d = detail || b;
  const title   = d.title || '';
  const imgStr  = d.card_image || (d.images?.[0] ? (typeof d.images[0] === 'object' ? d.images[0].file_name : d.images[0]) : '');
  const img     = MT.resolveImg(imgStr) || `/admin/files/blogs/${imgStr}`;
  const date    = d.date || '';
  const content = d.description || d.content || d.discription || '';
  document.title = `${title} | Mangalam Travel & Tours`;
  root.innerHTML = `
    <div class="relative h-[50vh] overflow-hidden">
      <img src="${img}" alt="${title}" class="w-full h-full object-cover" onerror="this.src='/assets/images/logo-color.png'">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-8 text-white container mx-auto">
        ${date ? `<p class="text-sm text-gray-300 mb-2 font-dm-sans">${date}</p>` : ''}
        <h1 class="text-4xl font-bold font-[Quicksand]">${title}</h1>
      </div>
    </div>
    <div class="container mx-auto px-4 py-12 max-w-3xl">
      <div class="prose prose-lg max-w-none text-gray-700 font-dm-sans leading-relaxed">${content}</div>
      <div class="mt-8 pt-8 border-t border-gray-200">
        <a href="/blog" class="inline-flex items-center text-red-600 font-dm-sans font-semibold hover:underline"><i class="fi fi-rr-arrow-left mr-2"></i>Back to Blog</a>
      </div>
    </div>`;
});

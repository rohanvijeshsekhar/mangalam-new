/**
 * blog-details.js — Single blog post viewer for Mangalam Travel & Tours
 */
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('blog-detail-root');
  if (!root) return;

  const rawParam = MT.qParam('slug') || MT.qParam('id') || '';
  const param = decodeURIComponent(rawParam).trim();

  if (!param) {
    renderNotFound(root);
    return;
  }

  try {
    // 1. Fetch all blogs
    const allBlogs = await MT.apiGet('/api/blogs') || [];
    
    // Find matching post
    let blog = allBlogs.find(b => 
      String(b.slug_url || b.slug || '').toLowerCase() === param.toLowerCase() ||
      String(b.id || b.blog_id || '') === param
    );

    // If not found in list, attempt direct fetch
    if (!blog) {
      blog = await MT.apiGet(`/api/blogs/${encodeURIComponent(param)}`);
    }

    if (!blog || blog.error) {
      renderNotFound(root);
      return;
    }

    // Process fields
        const title = blog.title || 'Travel Blog';
    document.title = `${title} | Mangalam Travel & Tours`;
    const blogDesc = (blog.meta_description || blog.description || blog.content || '').replace(/<[^>]*>?/gm, '').slice(0, 160);
    const blogCanonical = `https://mangalamtravel.com/blog-details.html?slug=${encodeURIComponent(blog.slug_url || blog.slug || slug)}`;
    const setMetaTag = (nameOrProp, attr, val) => {
      if (!val) return;
      let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMetaTag('description', 'name', blogDesc);
    setMetaTag('title', 'name', `${title} | Mangalam Travel & Tours`);
    setMetaTag('og:title', 'property', `${title} | Mangalam Travel & Tours`);
    setMetaTag('og:description', 'property', blogDesc);
    setMetaTag('og:url', 'property', blogCanonical);
    setMetaTag('twitter:title', 'name', `${title} | Mangalam Travel & Tours`);
    setMetaTag('twitter:description', 'name', blogDesc);
    setMetaTag('twitter:url', 'name', blogCanonical);
    let bLinkEl = document.querySelector('link[rel="canonical"]');
    if (!bLinkEl) { bLinkEl = document.createElement('link'); bLinkEl.setAttribute('rel', 'canonical'); document.head.appendChild(bLinkEl); }
    bLinkEl.setAttribute('href', blogCanonical);

    const imgStr = blog.banner_image || blog.card_image || (blog.images && blog.images.length > 0 ? (typeof blog.images[0] === 'object' ? (blog.images[0].file_name || blog.images[0].name || blog.images[0].image) : blog.images[0]) : '');
    const bannerImg = MT.resolveImg(imgStr) || './assets/images/banner-img.webp';
    const date = blog.date || (blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
    const author = blog.author || 'Mangalam Editorial Team';
    const category = blog.category || 'Travel Guide';

    // Format content (support raw HTML or plain text linebreaks)
    let rawContent = blog.content || blog.description || '';
    let formattedContent = rawContent;
    if (rawContent && !rawContent.includes('<p>') && !rawContent.includes('<div>') && !rawContent.includes('<br>')) {
      formattedContent = rawContent.split(/\n\n+/).map(p => `<p class="mb-4">${p.replace(/\n/g, '<br>')}</p>`).join('');
    }

    // Estimated read time
    const words = rawContent.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.round(words / 180)) + ' min read';

    // Other related blogs
    const otherBlogs = allBlogs.filter(b => (b.slug_url || b.slug || b.id) !== (blog.slug_url || blog.slug || blog.id)).slice(0, 3);

    root.innerHTML = `
      <!-- Top Hero Banner Image -->
      <section class="relative w-full h-72 md:h-[440px] bg-slate-900 overflow-hidden">
        <img src="${bannerImg}" alt="${title}" class="w-full h-full object-cover object-center" onerror="this.onerror=null; this.src='./assets/images/banner-img.webp';">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30"></div>
        
        <!-- Floating Navigation -->
        <div class="absolute top-6 left-0 right-0 z-20">
          <div class="container mx-auto px-4 flex items-center justify-between">
            <a href="blog.html" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-red-600 text-white text-xs font-bold font-dm-sans backdrop-blur-md transition-all shadow-lg border border-white/10">
              <i class="fa-solid fa-arrow-left"></i>
              <span>Back to Blogs</span>
            </a>
            <span class="px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider font-dm-sans shadow-md">
              ${category}
            </span>
          </div>
        </div>
      </section>

      <!-- Main Article Container (Heading Below Banner + Content Neatly Below) -->
      <div class="container mx-auto px-4 max-w-4xl relative z-10 -mt-16 md:-mt-24 mb-20">
        <article class="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 p-6 md:p-12">
          
          <!-- Meta Header (Date, Author, Reading Time) -->
          <div class="flex flex-wrap items-center gap-4 text-xs md:text-sm font-dm-sans text-gray-500 pb-4 border-b border-gray-100">
            ${date ? `
            <div class="flex items-center gap-1.5 text-gray-700 font-medium">
              <i class="fa-regular fa-calendar-days text-red-500"></i>
              <span>${date}</span>
            </div>` : ''}
            <div class="flex items-center gap-1.5 text-gray-700 font-medium">
              <i class="fa-solid fa-user-pen text-sky-500"></i>
              <span>${author}</span>
            </div>
            <div class="flex items-center gap-1.5 text-gray-500">
              <i class="fa-regular fa-clock text-amber-500"></i>
              <span>${readTime}</span>
            </div>
          </div>

          <!-- Main Heading -->
          <h1 class="text-2xl md:text-4xl lg:text-5xl font-extrabold font-[Quicksand] text-gray-900 leading-tight tracking-tight mt-6 mb-8">
            ${title}
          </h1>

          <!-- Article Content -->
          <div class="prose prose-lg max-w-none text-gray-700 font-dm-sans leading-relaxed text-base md:text-lg space-y-6">
            ${formattedContent || '<p class="text-gray-400 italic">No written content available for this post.</p>'}
          </div>

          <!-- Article Footer & Social Share -->
          <div class="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider font-dm-sans">Share this story:</span>
              <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + window.location.href)}" target="_blank" class="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                <i class="fa-brands fa-whatsapp text-sm"></i>
              </a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                <i class="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="w-9 h-9 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors shadow-sm">
                <i class="fa-brands fa-twitter text-sm"></i>
              </a>
            </div>

            <a href="blog.html" class="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold font-dm-sans text-sm">
              <span>View All Articles</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>
        </article>
      </div>

      <!-- Related Stories Section -->
      ${otherBlogs.length ? `
      <section class="py-16 bg-slate-100/70 border-t border-gray-200">
        <div class="container mx-auto px-4 max-w-6xl">
          <div class="flex items-center justify-between mb-10">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-red-600 font-dm-sans block mb-1">More Stories</span>
              <h2 class="text-2xl md:text-3xl font-bold font-[Quicksand] text-gray-900">Explore More Travel Inspiration</h2>
            </div>
            <a href="blog.html" class="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-gray-800 font-bold text-xs uppercase tracking-wider font-dm-sans hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-200">
              <span>All Articles</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${otherBlogs.map(b => {
              const bTitle = b.title || '';
              const bSlug = b.slug_url || b.slug || b.id;
              const bImg = MT.resolveImg(b.card_image || b.banner_image) || './assets/images/banner-img.webp';
              const bDate = b.date || '';
              const bDesc = b.description || (b.content ? b.content.replace(/<[^>]*>?/gm, '').slice(0, 80) + '...' : '');
              return `
              <a href="blog-details.html?slug=${encodeURIComponent(bSlug)}" class="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-md shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                <div class="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img src="${bImg}" alt="${bTitle}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  ${bDate ? `<span class="absolute bottom-3 left-4 text-white text-xs font-medium font-dm-sans"><i class="fa-regular fa-calendar mr-1 text-red-400"></i>${bDate}</span>` : ''}
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 class="text-base font-bold font-[Quicksand] text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">${bTitle}</h3>
                    <p class="text-gray-500 font-dm-sans text-xs line-clamp-2 mt-1">${bDesc}</p>
                  </div>
                  <div class="text-xs font-bold text-red-600 font-dm-sans flex items-center gap-1.5 pt-2 border-t border-gray-50">
                    <span>Read Article</span>
                    <i class="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </a>`;
            }).join('')}
          </div>
        </div>
      </section>` : ''}
    `;
  } catch (err) {
    console.error('Error loading blog details:', err);
    renderNotFound(root);
  }
});

function renderNotFound(root) {
  root.innerHTML = `
    <div class="container mx-auto px-4 py-28 text-center max-w-md">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-3xl shadow-inner">
        <i class="fa-solid fa-book-open"></i>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 font-[Quicksand] mb-2">Blog Post Not Found</h1>
      <p class="text-gray-500 font-dm-sans text-sm mb-8 leading-relaxed">The article you are looking for may have been moved, renamed, or is currently undergoing an update.</p>
      <a href="blog.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider font-dm-sans hover:bg-red-700 transition-all shadow-md">
        <i class="fa-solid fa-arrow-left"></i>
        <span>Back to All Blogs</span>
      </a>
    </div>`;
}

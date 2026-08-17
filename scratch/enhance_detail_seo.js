const fs = require('fs');

// 1. Enhance package-details.js
let pkgCode = fs.readFileSync('js/package-details.js', 'utf8');
const pkgSeoInsert = `  const title      = d.package_name || d.title || d.name || '';
  if (title) {
    document.title = \`\${title} — Holiday Package | Mangalam Travel & Tours\`;
    const desc = (d.meta_description || d.description || d.overview || \`Explore \${title} with Mangalam Travel & Tours. Complete itinerary, hotel details, and best prices.\`).replace(/<[^>]*>?/gm, '').slice(0, 160);
    const canonical = \`https://mangalamtravel.com/package-details.html?slug=\${encodeURIComponent(d.slug_url || d.slug || rawParam)}\`;
    const setMetaTag = (nameOrProp, attr, val) => {
      if (!val) return;
      let el = document.querySelector(\`meta[\${attr}="\${nameOrProp}"]\`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMetaTag('description', 'name', desc);
    setMetaTag('title', 'name', \`\${title} — Mangalam Travel & Tours\`);
    setMetaTag('og:title', 'property', \`\${title} — Mangalam Travel & Tours\`);
    setMetaTag('og:description', 'property', desc);
    setMetaTag('og:url', 'property', canonical);
    setMetaTag('twitter:title', 'name', \`\${title} — Mangalam Travel & Tours\`);
    setMetaTag('twitter:description', 'name', desc);
    setMetaTag('twitter:url', 'name', canonical);
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) { linkEl = document.createElement('link'); linkEl.setAttribute('rel', 'canonical'); document.head.appendChild(linkEl); }
    linkEl.setAttribute('href', canonical);
  }`;

if (!pkgCode.includes('const canonical = `https://mangalamtravel.com/package-details.html')) {
  pkgCode = pkgCode.replace(/const title\s*=\s*d\.package_name[^;]*;/gi, pkgSeoInsert);
  fs.writeFileSync('js/package-details.js', pkgCode, 'utf8');
  fs.writeFileSync('public/js/package-details.js', pkgCode, 'utf8');
  fs.writeFileSync('backend/public/js/package-details.js', pkgCode, 'utf8');
  console.log('Updated package-details.js');
}

// 2. Enhance blog-details.js
let blogCode = fs.readFileSync('js/blog-details.js', 'utf8');
const blogSeoInsert = `    const title = blog.title || 'Travel Blog';
    document.title = \`\${title} | Mangalam Travel & Tours\`;
    const blogDesc = (blog.meta_description || blog.description || blog.content || '').replace(/<[^>]*>?/gm, '').slice(0, 160);
    const blogCanonical = \`https://mangalamtravel.com/blog-details.html?slug=\${encodeURIComponent(blog.slug_url || blog.slug || slug)}\`;
    const setMetaTag = (nameOrProp, attr, val) => {
      if (!val) return;
      let el = document.querySelector(\`meta[\${attr}="\${nameOrProp}"]\`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMetaTag('description', 'name', blogDesc);
    setMetaTag('title', 'name', \`\${title} | Mangalam Travel & Tours\`);
    setMetaTag('og:title', 'property', \`\${title} | Mangalam Travel & Tours\`);
    setMetaTag('og:description', 'property', blogDesc);
    setMetaTag('og:url', 'property', blogCanonical);
    setMetaTag('twitter:title', 'name', \`\${title} | Mangalam Travel & Tours\`);
    setMetaTag('twitter:description', 'name', blogDesc);
    setMetaTag('twitter:url', 'name', blogCanonical);
    let bLinkEl = document.querySelector('link[rel="canonical"]');
    if (!bLinkEl) { bLinkEl = document.createElement('link'); bLinkEl.setAttribute('rel', 'canonical'); document.head.appendChild(bLinkEl); }
    bLinkEl.setAttribute('href', blogCanonical);`;

if (!blogCode.includes('const blogCanonical = `https://mangalamtravel.com/blog-details.html')) {
  blogCode = blogCode.replace(/const title = blog\.title \|\| 'Travel Blog';\s*document\.title = `\${title} \| Mangalam Travel & Tours`;/gi, blogSeoInsert);
  fs.writeFileSync('js/blog-details.js', blogCode, 'utf8');
  fs.writeFileSync('public/js/blog-details.js', blogCode, 'utf8');
  fs.writeFileSync('backend/public/js/blog-details.js', blogCode, 'utf8');
  console.log('Updated blog-details.js');
}

// 3. Enhance attraction-details.js
let attCode = fs.readFileSync('js/attraction-details.js', 'utf8');
const attSeoInsert = `  document.title = \`\${title} | Mangalam Travel & Tours\`;
  const attDesc = (d.meta_description || d.description || d.overview || \`Experience \${title} in \${dest}. Best ticket rates, instant booking.\`).replace(/<[^>]*>?/gm, '').slice(0, 160);
  const attCanonical = \`https://mangalamtravel.com/attraction-details.html?slug=\${encodeURIComponent(d.slug_url || d.slug || slug)}\`;
  const setMetaTag = (nameOrProp, attr, val) => {
    if (!val) return;
    let el = document.querySelector(\`meta[\${attr}="\${nameOrProp}"]\`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
    el.setAttribute('content', val);
  };
  setMetaTag('description', 'name', attDesc);
  setMetaTag('title', 'name', \`\${title} | Mangalam Travel & Tours\`);
  setMetaTag('og:title', 'property', \`\${title} | Mangalam Travel & Tours\`);
  setMetaTag('og:description', 'property', attDesc);
  setMetaTag('og:url', 'property', attCanonical);
  setMetaTag('twitter:title', 'name', \`\${title} | Mangalam Travel & Tours\`);
  setMetaTag('twitter:description', 'name', attDesc);
  setMetaTag('twitter:url', 'name', attCanonical);
  let attLinkEl = document.querySelector('link[rel="canonical"]');
  if (!attLinkEl) { attLinkEl = document.createElement('link'); attLinkEl.setAttribute('rel', 'canonical'); document.head.appendChild(attLinkEl); }
  attLinkEl.setAttribute('href', attCanonical);`;

if (!attCode.includes('const attCanonical = `https://mangalamtravel.com/attraction-details.html')) {
  attCode = attCode.replace(/document\.title = `\${title} \| Mangalam Travel & Tours`;/gi, attSeoInsert);
  fs.writeFileSync('js/attraction-details.js', attCode, 'utf8');
  fs.writeFileSync('public/js/attraction-details.js', attCode, 'utf8');
  fs.writeFileSync('backend/public/js/attraction-details.js', attCode, 'utf8');
  console.log('Updated attraction-details.js');
}

console.log('Detail page SEO injection complete.');

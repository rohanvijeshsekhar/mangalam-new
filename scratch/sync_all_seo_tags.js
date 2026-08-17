const fs = require('fs');
const path = require('path');

const seoEntries = JSON.parse(fs.readFileSync('backend/db/data/seo.json', 'utf8'));

console.log(`Found ${seoEntries.length} SEO configurations to sync.`);

function syncSeo(entry) {
  if (!entry || !entry.page_route) return;
  let filename = entry.page_route === '/' ? 'index.html' : entry.page_route.replace(/^\//, '');
  if (!filename.endsWith('.html')) filename += '.html';

  const pathsToCheck = [
    filename,
    path.join('public', filename),
    path.join('backend/public', filename)
  ];

  for (const filePath of pathsToCheck) {
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Update <title>
        if (entry.meta_title) {
          if (/<title>[\s\S]*?<\/title>/i.test(content)) {
            content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${entry.meta_title}</title>`);
          }
          if (/<meta\s+name="title"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+name="title"\s+content="[^"]*"/i, `<meta name="title" content="${entry.meta_title}"`);
          }
          if (/<meta\s+property="og:title"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+property="og:title"\s+content="[^"]*"/i, `<meta property="og:title" content="${entry.meta_title}"`);
          }
          if (/<meta\s+name="twitter:title"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"/i, `<meta name="twitter:title" content="${entry.meta_title}"`);
          }
        }

        // Update <meta name="description">
        if (entry.meta_description) {
          if (/<meta\s+name="description"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+name="description"\s+content="[^"]*"/i, `<meta name="description" content="${entry.meta_description}"`);
          }
          if (/<meta\s+property="og:description"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+property="og:description"\s+content="[^"]*"/i, `<meta property="og:description" content="${entry.meta_description}"`);
          }
          if (/<meta\s+name="twitter:description"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"/i, `<meta name="twitter:description" content="${entry.meta_description}"`);
          }
        }

        // Update <meta name="keywords">
        if (entry.meta_keywords) {
          if (/<meta\s+name="keywords"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+name="keywords"\s+content="[^"]*"/i, `<meta name="keywords" content="${entry.meta_keywords}"`);
          }
        }

        // Update <link rel="canonical">
        if (entry.canonical_url) {
          if (/<link\s+rel="canonical"\s+href="[^"]*"/i.test(content)) {
            content = content.replace(/<link\s+rel="canonical"\s+href="[^"]*"/i, `<link rel="canonical" href="${entry.canonical_url}"`);
          } else if (/<link\s+href="[^"]*"\s+rel="canonical"/i.test(content)) {
            content = content.replace(/<link\s+href="[^"]*"\s+rel="canonical"/i, `<link rel="canonical" href="${entry.canonical_url}"`);
          }
          if (/<meta\s+property="og:url"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+property="og:url"\s+content="[^"]*"/i, `<meta property="og:url" content="${entry.canonical_url}"`);
          }
          if (/<meta\s+name="twitter:url"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"/i, `<meta name="twitter:url" content="${entry.canonical_url}"`);
          }
        }

        // Update <meta name="robots">
        if (entry.robots) {
          if (/<meta\s+name="robots"\s+content="[^"]*"/i.test(content)) {
            content = content.replace(/<meta\s+name="robots"\s+content="[^"]*"/i, `<meta name="robots" content="${entry.robots}"`);
          }
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Synced SEO to: ${filePath}`);
      } catch (err) {
        console.error(`Error syncing ${filePath}:`, err);
      }
    }
  }
}

for (const entry of seoEntries) {
  syncSeo(entry);
}

console.log('All SEO metadata synchronized to static HTML files.');

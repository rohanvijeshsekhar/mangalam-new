const fs = require('fs');
const path = require('path');

const DIRS = [
  'c:/Users/rohan/Downloads/public_html2',
  'c:/Users/rohan/Downloads/public_html2/public',
  'c:/Users/rohan/Downloads/public_html2/backend/public'
];

let totalModified = 0;

DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    let html = fs.readFileSync(fullPath, 'utf8');
    const original = html;

    // Remove Agent Login link from desktop navigation bars inside <header> or <nav>
    // Match <a ...agents.mangalamtravel.com...Agent Login</a>
    html = html.replace(/<a\s+[^>]*href=["']https:\/\/agents\.mangalamtravel\.com\/Config\/Login\/Agent["'][^>]*>\s*Agent Login\s*<\/a>/gi, '');

    // Also match any remaining <a ...>Agent Login</a> inside <header> or <nav>
    // Specifically looking for navigation links with Agent Login
    html = html.replace(/<a\s+[^>]*class=["'][^"']*(?:text-gray-600|text-white|text-gray-900)[^"']*["'][^>]*>\s*Agent Login\s*<\/a>/gi, '');

    if (html !== original) {
      fs.writeFileSync(fullPath, html, 'utf8');
      console.log(`Updated: ${fullPath}`);
      totalModified++;
    }
  });
});

console.log(`Successfully removed Agent Login from navbar in ${totalModified} files!`);

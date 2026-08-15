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

    // 1. In navigation bars across pages, update "Home" link to "Back to Home" with clean styling
    if (file === 'index.html') {
      // In index.html navbar
      html = html.replace(
        /<a href="\/" class="text-white hover:text-yellow-400 transition-colors font-dm-sans">Home<\/a>/g,
        '<a href="/" class="text-white hover:text-yellow-400 transition-colors font-dm-sans">Back to Home</a>'
      );
      html = html.replace(
        /<a href="\/" class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Home<\/a>/g,
        '<a href="/" class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Back to Home</a>'
      );
    } else {
      // In subpages navbar: replace <a href="/" ...>Home</a> with <a href="/" ...>Back to Home</a>
      html = html.replace(
        /<a\s+href=["']\/["']\s+class=["']text-gray-600 hover:text-gray-900 font-dm-sans transition-colors["']>Home<\/a>/gi,
        '<a href="/" class="text-gray-600 hover:text-gray-900 font-dm-sans transition-colors inline-flex items-center gap-1.5"><i class="fi fi-rr-arrow-left text-xs"></i> Back to Home</a>'
      );
      html = html.replace(
        /<a\s+href=["']index\.html["']\s+class=["']text-gray-600 hover:text-gray-900 font-dm-sans transition-colors["']>Home<\/a>/gi,
        '<a href="/" class="text-gray-600 hover:text-gray-900 font-dm-sans transition-colors inline-flex items-center gap-1.5"><i class="fi fi-rr-arrow-left text-xs"></i> Back to Home</a>'
      );
    }

    if (html !== original) {
      fs.writeFileSync(fullPath, html, 'utf8');
      console.log(`Updated Back to Home in: ${fullPath}`);
      totalModified++;
    }
  });
});

console.log(`Successfully updated Back to Home button across ${totalModified} files!`);

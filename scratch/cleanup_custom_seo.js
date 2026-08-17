const fs = require('fs');
const path = require('path');

// 1. Revert package-details.js
const pkgFiles = ['js/package-details.js', 'public/js/package-details.js', 'backend/public/js/package-details.js'];
for (const f of pkgFiles) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Remove the custom SEO block inserted earlier
    const regex = /const title\s*=\s*d\.package_name[\s\S]*?linkEl\.setAttribute\('href', canonical\);\s*\}/gi;
    if (regex.test(content)) {
      content = content.replace(regex, `const title = d.package_name || d.title || d.name || '';\n  if (title) document.title = title;`);
      fs.writeFileSync(f, content, 'utf8');
      console.log('Cleaned up:', f);
    }
  }
}

// 2. Revert blog-details.js
const blogFiles = ['js/blog-details.js', 'public/js/blog-details.js', 'backend/public/js/blog-details.js'];
for (const f of blogFiles) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /const title = blog\.title \|\| 'Travel Blog';[\s\S]*?bLinkEl\.setAttribute\('href', blogCanonical\);/gi;
    if (regex.test(content)) {
      content = content.replace(regex, `const title = blog.title || 'Travel Blog';\n    document.title = title;`);
      fs.writeFileSync(f, content, 'utf8');
      console.log('Cleaned up:', f);
    }
  }
}

// 3. Revert attraction-details.js
const attFiles = ['js/attraction-details.js', 'public/js/attraction-details.js', 'backend/public/js/attraction-details.js'];
for (const f of attFiles) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /document\.title = `\${title} \| Mangalam Travel & Tours`;[\s\S]*?attLinkEl\.setAttribute\('href', attCanonical\);/gi;
    if (regex.test(content)) {
      content = content.replace(regex, `document.title = title;`);
      fs.writeFileSync(f, content, 'utf8');
      console.log('Cleaned up:', f);
    }
  }
}

console.log('Detail scripts cleaned up.');

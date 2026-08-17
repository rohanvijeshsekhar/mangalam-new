const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      if (!name.includes('node_modules') && !name.includes('.git') && !name.includes('admin')) {
        getFiles(name, files);
      }
    } else if (name.endsWith('.html')) {
      files.push(name);
    }
  }
  return files;
}

const htmlFiles = getFiles('./');
let count = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Bump api.js version query parameter
  if (content.includes('api.js')) {
    content = content.replace(/api\.js(\?v=[^"']*)?/g, 'api.js?v=20260817_1125');
    modified = true;
  }

  // Update static responsive-float-header padding in <style>
  if (content.includes('.responsive-float-header ul')) {
    content = content.replace(/\.responsive-float-header\s*\{\s*position:\s*fixed;\s*bottom:\s*0;\s*left:\s*0;\s*right:\s*0;\s*background:\s*white;\s*box-shadow:\s*0\s*-2px\s*10px\s*rgba\(0,\s*0,\s*0,\s*0\.1\);\s*z-index:\s*1000;\s*display:\s*none;\s*\}/gi,
      `.responsive-float-header { position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -3px 16px rgba(0, 0, 0, 0.08); z-index: 1000; display: none; padding-top: 14px; padding-bottom: max(14px, env(safe-area-inset-bottom, 14px)); }`
    );
    content = content.replace(/padding:\s*8px\s*8px;/gi, 'padding: 0 4px;');
    content = content.replace(/padding:\s*10px\s*4px;/gi, 'padding: 0 4px;');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
}

console.log(`Updated mobile nav styles and cache versions in ${count} HTML files.`);

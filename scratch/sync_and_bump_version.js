const fs = require('fs');
const path = require('path');

// 1. Sync js/api.js
fs.copyFileSync('js/api.js', 'public/js/api.js');
fs.copyFileSync('js/api.js', 'backend/public/js/api.js');
console.log('Synced js/api.js');

// 2. Bump version in all HTML files
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
  if (content.includes('api.js')) {
    content = content.replace(/api\.js(\?v=[^"']*)?/g, 'api.js?v=20260817_1140');
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
}

console.log(`Updated cache buster in ${count} HTML files.`);

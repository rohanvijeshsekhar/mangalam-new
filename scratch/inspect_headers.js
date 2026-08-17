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
const misplacedMenuFiles = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
  if (headerMatch) {
    const h = headerMatch[0];
    // Check if </nav>\s*<\/div>\s*<!-- Top Right Corner Bento Menu Icon -->
    if (/<\/nav>\s*<\/div>\s*<!--\s*Top Right Corner Bento Menu Icon/i.test(h)) {
      misplacedMenuFiles.push(file);
    }
  }
}

console.log('Found ' + misplacedMenuFiles.length + ' files with misplaced menu dropdown trigger:');
console.log(misplacedMenuFiles);

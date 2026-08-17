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
let updatedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('mobile-customize-item')) {
    const newContent = content.replace(/<li\s+class="mobile-customize-item">[\s\S]*?<\/li>/g, '');
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      updatedCount++;
      console.log('Removed center blue icon from: ' + file);
    }
  }
}

console.log(`Successfully updated ${updatedCount} HTML files.`);

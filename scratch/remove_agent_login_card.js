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

  // Remove the Agent Login card from the services bottom sheet grid
  const agentCardRegex = /<a\s+href="https:\/\/agents\.mangalamtravel\.com\/Config\/Login\/Agent"[^>]*class="service-grid-card[^>]*>[\s\S]*?<\/a>/gi;
  if (agentCardRegex.test(content)) {
    content = content.replace(agentCardRegex, '');
    modified = true;
  }

  // Also bump api.js cache buster query parameter
  if (content.includes('api.js')) {
    content = content.replace(/api\.js(\?v=[^"']*)?/g, 'api.js?v=20260817_1135');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Updated: ' + file);
  }
}

console.log(`Successfully removed Agent Login card from ${count} HTML files.`);

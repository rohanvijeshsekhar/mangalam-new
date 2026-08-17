const fs = require('fs');
const path = require('path');

const svgIconDark = `<svg class="w-5 h-5 text-gray-800 group-hover:scale-110 transition-transform duration-300 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="5" height="5" rx="1.5" />
    <rect x="9.5" y="3" width="5" height="5" rx="1.5" />
    <rect x="16" y="3" width="5" height="5" rx="1.5" />
    <rect x="3" y="9.5" width="5" height="5" rx="1.5" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" />
    <rect x="16" y="9.5" width="5" height="5" rx="1.5" />
    <rect x="3" y="16" width="5" height="5" rx="1.5" />
    <rect x="9.5" y="16" width="5" height="5" rx="1.5" />
    <rect x="16" y="16" width="5" height="5" rx="1.5" />
</svg>`;

const svgIconWhite = `<svg class="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="5" height="5" rx="1.5" />
    <rect x="9.5" y="3" width="5" height="5" rx="1.5" />
    <rect x="16" y="3" width="5" height="5" rx="1.5" />
    <rect x="3" y="9.5" width="5" height="5" rx="1.5" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" />
    <rect x="16" y="9.5" width="5" height="5" rx="1.5" />
    <rect x="3" y="16" width="5" height="5" rx="1.5" />
    <rect x="9.5" y="16" width="5" height="5" rx="1.5" />
    <rect x="16" y="16" width="5" height="5" rx="1.5" />
</svg>`;

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
  let modified = false;

  // Replace Flaticon <i class="fi fi-br-grid ..."></i> with SVG icon inside menuDropdownTrigger
  if (content.includes('<i class="fi fi-br-grid')) {
    content = content.replace(/<i\s+class="fi fi-br-grid[^">]*"><\/i>/g, svgIconDark);
    modified = true;
  }

  // Ensure z-index on menuDropdown is z-[99999] so it's always on top
  if (content.includes('id="menuDropdown"') && !content.includes('z-[99999]')) {
    content = content.replace(/id="menuDropdown"\s+class="([^"]*?)z-50([^"]*?)"/g, 'id="menuDropdown" class="$1z-[99999]$2"');
    content = content.replace(/id="menuDropdown2"\s+class="([^"]*?)z-50([^"]*?)"/g, 'id="menuDropdown2" class="$1z-[99999]$2"');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log('Fixed bento icon in: ' + file);
  }
}

console.log(`Updated ${updatedCount} HTML files.`);

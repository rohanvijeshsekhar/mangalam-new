const fs = require('fs');
const path = require('path');

const newAccordionHTML = `<div class="menu-services-accordion">
                                    <button type="button" class="menu-services-toggle w-full flex items-center justify-between px-5 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer font-dm-sans font-medium select-none text-left">
                                        <span>Services</span>
                                        <svg class="w-4 h-4 text-gray-500 transform transition-transform duration-200 menu-services-arrow" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <div class="menu-services-list hidden bg-gray-50 py-1 border-y border-gray-100">
                                        <a href="/flight-tickets.html" class="block pl-7 pr-5 py-2 text-gray-600 hover:text-sky-500 hover:bg-sky-50/50 transition-colors font-dm-sans text-sm">Flight Tickets</a>
                                        <a href="/global-visa-services.html" class="block pl-7 pr-5 py-2 text-gray-600 hover:text-sky-500 hover:bg-sky-50/50 transition-colors font-dm-sans text-sm">Visa Services</a>
                                        <a href="/travel-insurance.html" class="block pl-7 pr-5 py-2 text-gray-600 hover:text-sky-500 hover:bg-sky-50/50 transition-colors font-dm-sans text-sm">Travel Insurance</a>
                                        <a href="/miscellaneous.html" class="block pl-7 pr-5 py-2 text-gray-600 hover:text-sky-500 hover:bg-sky-50/50 transition-colors font-dm-sans text-sm">Miscellaneous Services</a>
                                        <a href="/mice-tourism.html" class="block pl-7 pr-5 py-2 text-gray-600 hover:text-sky-500 hover:bg-sky-50/50 transition-colors font-dm-sans text-sm">MICE Tourism</a>
                                        <a href="/cruises.html" class="block pl-7 pr-5 py-2 text-gray-600 hover:text-sky-500 hover:bg-sky-50/50 transition-colors font-dm-sans text-sm">Cruises</a>
                                    </div>
                                </div>`;

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

  // Replace <details class="group">...Services...</details> with newAccordionHTML
  const detailsRegex = /<details\s+class="group">[\s\S]*?Services[\s\S]*?<\/details>/gi;
  if (detailsRegex.test(content)) {
    content = content.replace(detailsRegex, newAccordionHTML);
    modified = true;
  }

  // Ensure api.js is imported
  if (!content.includes('api.js') && content.includes('</body>')) {
    content = content.replace('</body>', '<script src="./js/api.js?v=20260817_1105"></script>\n</body>');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Updated: ' + file);
  }
}

console.log(`Successfully updated ${count} HTML files.`);

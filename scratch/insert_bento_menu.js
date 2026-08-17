const fs = require('fs');
const path = require('path');

const menuHTML = `
            <!-- Top Right Corner Bento Menu Icon -->
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <div id="menuDropdownTrigger" class="w-10 h-10 border border-gray-200 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-300 group shadow-sm" title="Menu">
                        <svg class="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="3" width="5" height="5" rx="1.5" />
                            <rect x="9.5" y="3" width="5" height="5" rx="1.5" />
                            <rect x="16" y="3" width="5" height="5" rx="1.5" />
                            <rect x="3" y="9.5" width="5" height="5" rx="1.5" />
                            <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" />
                            <rect x="16" y="9.5" width="5" height="5" rx="1.5" />
                            <rect x="3" y="16" width="5" height="5" rx="1.5" />
                            <rect x="9.5" y="16" width="5" height="5" rx="1.5" />
                            <rect x="16" y="16" width="5" height="5" rx="1.5" />
                        </svg>
                    </div>

                    <!-- Dropdown Modal -->
                    <div id="menuDropdown" class="hidden absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-[9999] overflow-hidden ring-1 ring-black/5 origin-top-right transition-all duration-200">
                        <div class="py-2">
                            <!-- Mobile Services Dropdown -->
                            <div class="md:hidden">
                                <details class="group">
                                    <summary class="flex items-center justify-between px-5 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer font-dm-sans font-medium select-none list-none [&::-webkit-details-marker]:hidden">
                                        Services
                                        <i class="fi fi-rr-angle-small-down transition-transform duration-300 group-open:rotate-180 flex items-center justify-center"></i>
                                    </summary>
                                    <div class="bg-gray-50 py-2">
                                        <a href="/flight-tickets.html" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">Flight Tickets</a>
                                        <a href="/global-visa-services.html" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">Visa Services</a>
                                        <a href="/travel-insurance.html" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">Travel Insurance</a>
                                        <a href="/miscellaneous.html" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">Miscellaneous Services</a>
                                        <a href="/mice-tourism.html" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">MICE Tourism</a>
                                        <a href="/cruises.html" class="block pl-8 pr-5 py-2 text-gray-600 hover:text-sky-500 transition-colors font-dm-sans text-sm">Cruises</a>
                                    </div>
                                </details>
                            </div>

                            <a href="/" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Home</a>
                            <a href="/about.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">About Us</a>
                            <a href="/contact.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Contact Us</a>
                            <a href="/blog.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Blog</a>
                            <a href="/gallery.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Gallery</a>
                            <a href="/career.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Career</a>
                            <div class="h-px bg-gray-100 mx-2 my-1"></div>
                            <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-dm-sans font-medium">Agent Login Portal</a>
                        </div>
                    </div>
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
let updatedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('menuDropdownTrigger')) continue;

  // Insert before </header> or at end of header container
  if (content.includes('<!-- Header Icons Removed -->')) {
    content = content.replace('<!-- Header Icons Removed -->', menuHTML);
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log('Inserted into: ' + file);
  } else if (content.includes('</header>')) {
    // Check if there is a header flex container
    const flexIdx = content.indexOf('class="flex items-center justify-between');
    if (flexIdx !== -1) {
      const closingDivIdx = content.indexOf('</div>', flexIdx);
      if (closingDivIdx !== -1) {
        // Find the last closing div of header before </header>
        const headerCloseIdx = content.indexOf('</header>', flexIdx);
        // Insert right before headerCloseIdx or near logo/nav container
        const insertPos = content.lastIndexOf('</div>', headerCloseIdx);
        if (insertPos > flexIdx) {
          content = content.slice(0, insertPos) + menuHTML + '\n' + content.slice(insertPos);
          fs.writeFileSync(file, content, 'utf8');
          updatedCount++;
          console.log('Inserted into: ' + file);
        }
      }
    }
  }
}

console.log(`Successfully updated ${updatedCount} HTML files.`);

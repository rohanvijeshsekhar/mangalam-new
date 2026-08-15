const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:/Users/rohan/Downloads/public_html2';

const STANDARD_HEADER = `    <!-- Header -->
    <header class="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-[999] transition-all duration-300">
    <div class="container mx-auto p-2">
        <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center space-x-2 w-[120px]">
                <a href="/"><img src="./assets/images/logo-color.png" alt="Mangalam Travel & Tours" class="w-full h-full"></a>
            </div>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center space-x-8 relative">
                <a href="/" class="text-gray-600 hover:text-gray-900 font-dm-sans transition-colors">Home</a>
                <a href="/holiday-package.html" class="text-gray-600 hover:text-gray-900 font-dm-sans transition-colors">Holiday Packages</a>
                <!-- Services Dropdown -->
                <div class="relative group">
                    <button class="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-dm-sans transition-colors focus:outline-none">
                        Services 
                        <i class="fi fi-rr-angle-small-down pt-1 flex items-center justify-center"></i>
                    </button>
                    <div class="absolute top-full -left-4 mt-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div class="py-2">
                            <a href="/flight-tickets.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Flight Tickets
                            </a>
                            <a href="/global-visa-services.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Visa Services
                            </a>
                            <a href="/travel-insurance.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Travel Insurance
                            </a>
                            <a href="/miscellaneous.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Miscellaneous Services
                            </a>
                            <a href="/mice-tourism.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                MICE Tourism
                            </a>
                            <a href="/cruises.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">
                                Cruises
                            </a>
                        </div>
                    </div>
                </div>
                <a href="/attraction.html" class="text-gray-600 hover:text-gray-900 font-dm-sans transition-colors">Attractions</a>
                <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank" class="text-gray-600 hover:text-gray-900 font-dm-sans transition-colors">Agent Login</a>
            </nav>

            <!-- Header Icons Removed -->
        </div>
    </div>
</header>`;

// Files to update if they have an old or different header (excluding index.html which has double hero overlay header)
const files = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if header needs replacement
  const headerRegex = /<header[\s\S]*?<\/header>/i;
  const match = content.match(headerRegex);

  if (match) {
    const currentHeader = match[0];
    // If it doesn't have Services dropdown or has Cart / old links
    if (!currentHeader.includes('Services') || currentHeader.includes('cart') || !currentHeader.includes('Agent Login')) {
      console.log(`Replacing header in ${file}...`);
      content = content.replace(headerRegex, STANDARD_HEADER);

      // Also ensure main / root content has top padding
      if (file === 'package-details.html') {
        content = content.replace('id="package-detail-root" class="min-h-screen"', 'id="package-detail-root" class="min-h-screen pt-20 md:pt-24"');
      } else if (file === 'attraction-details.html') {
        content = content.replace('id="attraction-detail-root" class="min-h-screen"', 'id="attraction-detail-root" class="min-h-screen pt-20 md:pt-24"');
      } else if (file === 'attraction.html') {
        content = content.replace('<main class="min-h-screen">', '<main class="min-h-screen pt-20 md:pt-24">');
      } else if (file === 'cart.html') {
        content = content.replace('<main>', '<main class="pt-20 md:pt-24">');
      } else if (file === 'career.html') {
        content = content.replace('<main>', '<main class="pt-20 md:pt-24">');
      } else if (file === 'privacy-policy.html' || file === 'terms-and-conditions.html' || file === 'thankyou.html') {
        content = content.replace('<main', '<main class="pt-20 md:pt-24"');
      }

      fs.writeFileSync(filePath, content, 'utf8');
      
      const publicPath = path.join(ROOT_DIR, 'public', file);
      if (fs.existsSync(path.dirname(publicPath))) fs.writeFileSync(publicPath, content, 'utf8');
      
      const backendPublicPath = path.join(ROOT_DIR, 'backend', 'public', file);
      if (fs.existsSync(path.dirname(backendPublicPath))) fs.writeFileSync(backendPublicPath, content, 'utf8');
    }
  }
});

console.log('All headers standardized successfully!');

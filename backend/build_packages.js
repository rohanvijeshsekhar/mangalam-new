const fs = require('fs');

const holidayHtml = fs.readFileSync('c:/Users/rohan/Downloads/public_html2/holiday-package.html', 'utf8');

// Header part up to <main
const headerPart = holidayHtml.split('<main')[0];

// Footer part starting with <footer
const footerPart = '<footer' + holidayHtml.split('<footer')[1];

const mainContent = `    <main class="pt-20 md:pt-24">
        <!-- Hero Section -->
        <section class="relative h-[45vh] min-h-[340px] overflow-hidden flex items-center justify-center" data-aos="fade-up">
            <div class="absolute inset-0" data-aos="zoom-in" data-aos-delay="100">
                <img id="dest-hero-img" src="./assets/images/bg-img.webp" alt="Destination Banner" class="w-full h-full object-cover md:rounded-br-[150px]">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 md:rounded-br-[150px]"></div>
            </div>

            <div class="relative z-10 container mx-auto px-4 text-center pb-12" data-aos="fade-up" data-aos-delay="150">
                <h1 id="dest-hero-title" class="text-4xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight drop-shadow-md">Destination</h1>
                <p id="dest-hero-desc" class="text-white/90 text-sm md:text-base mt-2 font-dm-sans max-w-xl mx-auto drop-shadow-sm"></p>
            </div>

            <!-- Navigation Tabs (Only Packages and Attractions) -->
            <div class="absolute bottom-0 left-0 w-full" data-aos="fade-up" data-aos-delay="250">
                <div class="w-full max-w-sm mx-auto px-2 sm:px-0">
                    <div class="flex justify-around bg-white rounded-t-2xl overflow-x-auto no-scrollbar shadow-sm">
                        <div class="relative flex-1 text-center">
                            <button type="button" id="tab-packages" class="w-full px-6 sm:px-10 py-3 sm:py-4 font-semibold text-[15px] sm:text-lg text-gray-900 transition-colors block whitespace-nowrap cursor-pointer">
                                Packages
                            </button>
                            <div id="indicator-packages" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-red-600 rounded-full"></div>
                        </div>

                        <div class="relative flex-1 text-center">
                            <button type="button" id="tab-activity" class="w-full px-6 sm:px-10 py-3 sm:py-4 font-semibold text-[15px] sm:text-lg text-gray-500 hover:text-gray-900 transition-colors block whitespace-nowrap cursor-pointer">
                                Attractions
                            </button>
                            <div id="indicator-activity" class="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-red-600 rounded-full hidden"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Travel Package Cards -->
        <section id="section-packages" class="py-16 bg-white" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="mb-8 text-center">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">Popular Packages In <span id="dest-span-name" class="text-red-600"></span></h2>
                    <p class="text-gray-600 font-dm-sans text-sm">Handcrafted vacation packages tailored for memorable getaways</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" id="packages-grid">
                    <!-- Packages injected by packages.js -->
                </div>
            </div>
        </section>

        <!-- Activity / Attractions Tab Section -->
        <section id="section-activity" class="py-16 bg-white hidden" data-aos="fade-up">
            <div class="container mx-auto px-4">
                <div class="mb-8 text-center" data-aos="fade-up" data-aos-delay="100">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2" data-aos="fade-up" data-aos-delay="150">Popular Attractions In <span id="dest-span-attraction-name" class="text-red-600"></span></h2>
                    <p class="text-gray-600 font-dm-sans text-sm" data-aos="fade-up" data-aos-delay="200">Top rated experiences, sightseeing, and must-visit attractions</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" id="activities-grid">
                    <!-- Attractions injected by packages.js -->
                </div>
            </div>
        </section>
    </main>
`;

let cleanFooter = footerPart.replace(
  '<script src="./js/holiday-packages.js"></script>',
  '<script src="./js/render.js"></script>\n<script src="./js/packages.js?v=20260815"></script>'
);

if (!cleanFooter.includes('packages.js')) {
  cleanFooter = cleanFooter.replace('</body>', '<script src="./js/render.js"></script>\n<script src="./js/packages.js?v=20260815"></script>\n</body>');
}

const completePackagesHtml = headerPart + mainContent + cleanFooter;

fs.writeFileSync('c:/Users/rohan/Downloads/public_html2/packages.html', completePackagesHtml, 'utf8');
fs.writeFileSync('c:/Users/rohan/Downloads/public_html2/public/packages.html', completePackagesHtml, 'utf8');
fs.writeFileSync('c:/Users/rohan/Downloads/public_html2/backend/public/packages.html', completePackagesHtml, 'utf8');

console.log('packages.html built successfully! Length:', completePackagesHtml.length);

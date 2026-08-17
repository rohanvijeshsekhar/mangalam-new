const fs = require('fs');

const heroGlassHeaderMarkup = `    <!-- Hero Glass Navbar (Desktop & Mobile) -->
    <header id="heroGlassNavbar" class="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-out pt-3 md:pt-4 px-3 md:px-6">
        <nav class="container mx-auto px-4 md:px-6 py-2 md:py-2.5 flex items-center justify-between bg-black/25 md:bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl md:rounded-full shadow-lg transition-all duration-300">
            <!-- White Logo -->
            <div class="flex items-center">
                <div class="flex items-center w-[120px] md:w-[135px]">
                    <a href="/"><img src="./assets/images/logo.png" alt="Mangalam Tours Logo" class="w-full h-auto object-contain"></a>
                </div>
            </div>

            <!-- Desktop Navigation Links -->
            <div class="hidden md:flex items-center space-x-8 font-dm-sans">
                <a href="/" class="text-white hover:text-amber-300 transition-colors font-dm-sans font-medium text-sm lg:text-base">Home</a>
                <a href="/holiday-package.html" class="text-white hover:text-amber-300 transition-colors font-dm-sans font-medium text-sm lg:text-base">Holiday Packages</a>
                <!-- Services Dropdown -->
                <div class="relative group">
                    <button type="button" class="flex items-center gap-1 text-white hover:text-amber-300 transition-colors font-dm-sans font-medium text-sm lg:text-base focus:outline-none">
                        <span>Services</span>
                        <i class="fi fi-rr-angle-small-down pt-1 flex items-center justify-center"></i>
                    </button>
                    <div class="absolute top-full -left-4 mt-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div class="py-2 text-left">
                            <a href="/flight-tickets.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Flight Tickets</a>
                            <a href="/global-visa-services.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Visa Services</a>
                            <a href="/travel-insurance.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Travel Insurance</a>
                            <a href="/miscellaneous.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Miscellaneous Services</a>
                            <a href="/mice-tourism.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">MICE Tourism</a>
                            <a href="/cruises.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Cruises</a>
                        </div>
                    </div>
                </div>
                <a href="/attraction.html" class="text-white hover:text-amber-300 transition-colors font-dm-sans font-medium text-sm lg:text-base">Attractions</a>
            </div>

            <!-- Header Icons / Menu Trigger -->
            <div class="flex items-center space-x-3">
                <div class="relative">
                    <div id="menuDropdownTrigger"
                        class="p-2 md:p-2.5 border border-white/30 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/25 transition-all duration-300 group">
                        <i class="fi fi-br-grid text-white text-base md:text-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"></i>
                    </div>

                    <!-- Dropdown Modal -->
                    <div id="menuDropdown"
                        class="hidden absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 origin-top-right transition-all duration-200">
                        <div class="py-2">
                            <!-- Mobile Services Dropdown -->
                            <div class="md:hidden">
                                <div class="menu-services-accordion">
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
                            </div>
                            </div>

                            <a href="/about.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">About</a>
                            <a href="/contact.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Contact</a>
                            <a href="/blog.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Blog</a>
                            <a href="/gallery.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Gallery</a>
                            <a href="/career.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Career</a>
                            <div class="h-px bg-gray-100 mx-2 my-1"></div>
                            <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-dm-sans font-medium">Agent
                                Login Portal</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <!-- Sticky Fixed Header (Appears on Scroll with Colored Logo) -->
    <header id="mainFixedHeader"
        class="fixed left-0 right-0 top-0 z-[60] bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300 opacity-0 pointer-events-none -translate-y-4"
        style="display: flex; align-items: center; min-height:64px">
        <nav class="container mx-auto px-4 py-2 flex items-center justify-between">
            <div class="flex items-center">
                <div class="text-gray-900">
                    <div class="flex items-center w-[120px] md:w-[130px]">
                        <a href="/"><img src="./assets/images/logo-color.png" alt="Mangalam Tours Logo" class="w-full h-auto object-contain"></a>
                    </div>
                </div>
            </div>
            <div class="hidden md:flex space-x-8 font-dm-sans">
                <a href="/" class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Home</a>
                <a href="/holiday-package.html"
                    class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Holiday Packages</a>
                <div class="relative group">
                    <button
                        class="flex items-center gap-1 text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans focus:outline-none">
                        Services
                        <i class="fi fi-rr-angle-small-down pt-1 flex items-center justify-center"></i>
                    </button>
                    <div
                        class="absolute top-full -left-4 mt-4 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div class="py-2 text-left">
                            <a href="/flight-tickets.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Flight
                                Tickets</a>
                            <a href="/global-visa-services.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Visa
                                Services</a>
                            <a href="/travel-insurance.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Travel
                                Insurance</a>
                            <a href="/miscellaneous.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Miscellaneous
                                Services</a>
                            <a href="/mice-tourism.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">MICE
                                Tourism</a>
                            <a href="/cruises.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium text-base">Cruises</a>
                        </div>
                    </div>
                </div>
                <a href="/attraction.html"
                    class="text-gray-900 hover:text-yellow-400 transition-colors font-dm-sans">Attractions</a>
            </div>
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <div id="menuDropdownTrigger2"
                        class="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group">
                        <i
                            class="fi fi-br-grid text-gray-600 text-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center"></i>
                    </div>
                    <div id="menuDropdown2"
                        class="hidden absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 origin-top-right transition-all duration-200">
                        <div class="py-2">
                            <div class="md:hidden">
                                <div class="menu-services-accordion">
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
                            </div>
                            </div>
                            <a href="/about.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">About</a>
                            <a href="/contact.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Contact</a>
                            <a href="/blog.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Blog</a>
                            <a href="/gallery.html" class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Gallery</a>
                            <a href="/career.html"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans font-medium">Career</a>
                            <div class="h-px bg-gray-100 mx-2 my-1"></div>
                            <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank"
                                class="block px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-dm-sans font-medium">Agent
                                Login Portal</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>`;

const scrollScriptMarkup = `
<script>
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }

        const letsGoButtons = [document.getElementById('letsGoBtn'), document.getElementById('letsGoBtn2')].filter(Boolean);
        let audioContext;

        function playBeep() {
            try {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (!Ctx) return;
                if (!audioContext) {
                    audioContext = new Ctx();
                }
                const ctx = audioContext;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.connect(gain).connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.2);
            } catch (error) {
                console.warn('Unable to play beep:', error);
            }
        }

        letsGoButtons.forEach(btn => {
            btn.addEventListener('click', playBeep, { passive: true });
        });
    });

    function updateNavbarOnScroll() {
        const heroGlassNavbar = document.getElementById('heroGlassNavbar');
        const mainFixedHeader = document.getElementById('mainFixedHeader');
        const heroSection = document.querySelector('.relative.z-20.h-screen') || document.querySelector('section');
        const triggerThreshold = heroSection ? Math.min(heroSection.offsetHeight - 120, 380) : 280;

        if (window.scrollY > triggerThreshold) {
            if (heroGlassNavbar) {
                heroGlassNavbar.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
                heroGlassNavbar.classList.remove('opacity-100', 'translate-y-0');
            }
            if (mainFixedHeader) {
                mainFixedHeader.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
                mainFixedHeader.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0', 'visible');
            }
        } else {
            if (heroGlassNavbar) {
                heroGlassNavbar.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
                heroGlassNavbar.classList.add('opacity-100', 'translate-y-0');
            }
            if (mainFixedHeader) {
                mainFixedHeader.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
                mainFixedHeader.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'visible');
            }
        }
    }

    window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
    window.addEventListener('DOMContentLoaded', updateNavbarOnScroll);
    updateNavbarOnScroll();

    function toggleFaq(id) {
        const answer = document.getElementById('answer-' + id);
        const icon = document.getElementById('icon-' + id);
        if (answer) {
            answer.classList.toggle('hidden');
            if (icon) {
                if (answer.classList.contains('hidden')) {
                    icon.classList.remove('fi-rr-minus');
                    icon.classList.add('fi-rr-plus');
                    icon.parentElement.classList.remove('bg-red-500');
                    icon.parentElement.classList.add('bg-white', 'border', 'border-gray-800');
                    icon.classList.remove('text-white');
                    icon.classList.add('text-gray-800');
                } else {
                    icon.classList.remove('fi-rr-plus');
                    icon.classList.add('fi-rr-minus');
                    icon.parentElement.classList.add('bg-red-500');
                    icon.parentElement.classList.remove('bg-white', 'border', 'border-gray-800');
                    icon.classList.add('text-white');
                    icon.classList.remove('text-gray-800');
                }
            }
        }
    }
</script>
`;

const files = ['index.html', 'public/index.html', 'backend/public/index.html'];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');

  // Replace header section
  const headerRegex = /<body[^>]*>[\s\S]*?<main>/i;
  if (headerRegex.test(html)) {
    html = html.replace(headerRegex, `<body class="font-dm-sans bg-white">\n${heroGlassHeaderMarkup}\n\n        <main>`);
  }

  // Replace bottom script before Other Location Modal
  const scriptRegex = /<script src="\.\/js\/index\.js[^>]*><\/script>[\s\S]*?(?=<!-- Other Location Enquiry Modal -->|<div id="otherLocationModal")/i;
  if (scriptRegex.test(html)) {
    html = html.replace(scriptRegex, `<script src="./js/index.js?v=20260817_1055"></script>\n${scrollScriptMarkup}\n`);
  }

  fs.writeFileSync(f, html, 'utf8');
  console.log('Applied glass navbar & scroll transitions to:', f);
}

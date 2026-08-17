const fs = require('fs');
const path = require('path');

const newBottomSheetLI = `        <li class="relative">
            <a href="javascript:void(0)" id="mobileServicesTrigger" class="cursor-pointer" role="button" aria-expanded="false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 4px;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                Services
            </a>
            <div id="mobileServicesDropdown" class="hidden fixed inset-0 z-[99999] flex flex-col justify-end text-left">
                <div class="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" id="mobileServicesBackdrop"></div>
                <div class="services-bottom-sheet relative bg-white rounded-t-[28px] shadow-2xl border-t border-gray-100 max-h-[70vh] flex flex-col overflow-hidden w-full mx-auto max-w-lg z-10">
                    <div class="pt-3.5 pb-2.5 px-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/80">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span class="text-sm font-bold tracking-wide text-gray-900 font-[Quicksand]">Our Services</span>
                        </div>
                        <button type="button" id="closeMobileServicesBtn" class="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs transition-colors">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-4 overflow-y-auto grid grid-cols-2 gap-2.5 pb-24">
                        <a href="/flight-tickets.html" class="service-grid-card flex items-center gap-3 p-3 rounded-2xl bg-sky-50/70 hover:bg-sky-100/80 border border-sky-100 transition-all">
                            <div class="w-10 h-10 rounded-xl bg-white shadow-xs text-sky-500 flex items-center justify-center text-base flex-shrink-0">
                                <i class="fas fa-plane"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-bold text-gray-900 truncate font-dm-sans">Flights</div>
                                <div class="text-[10px] text-gray-500 truncate">Book tickets</div>
                            </div>
                        </a>
                        <a href="/global-visa-services.html" class="service-grid-card flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-100 transition-all">
                            <div class="w-10 h-10 rounded-xl bg-white shadow-xs text-amber-500 flex items-center justify-center text-base flex-shrink-0">
                                <i class="fas fa-passport"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-bold text-gray-900 truncate font-dm-sans">Visa Services</div>
                                <div class="text-[10px] text-gray-500 truncate">Global assistance</div>
                            </div>
                        </a>
                        <a href="/travel-insurance.html" class="service-grid-card flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-100 transition-all">
                            <div class="w-10 h-10 rounded-xl bg-white shadow-xs text-emerald-500 flex items-center justify-center text-base flex-shrink-0">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-bold text-gray-900 truncate font-dm-sans">Insurance</div>
                                <div class="text-[10px] text-gray-500 truncate">Travel safe</div>
                            </div>
                        </a>
                        <a href="/miscellaneous.html" class="service-grid-card flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100 transition-all">
                            <div class="w-10 h-10 rounded-xl bg-white shadow-xs text-purple-500 flex items-center justify-center text-base flex-shrink-0">
                                <i class="fas fa-concierge-bell"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-bold text-gray-900 truncate font-dm-sans">Miscellaneous</div>
                                <div class="text-[10px] text-gray-500 truncate">Forex & More</div>
                            </div>
                        </a>
                        <a href="/mice-tourism.html" class="service-grid-card flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-100 transition-all">
                            <div class="w-10 h-10 rounded-xl bg-white shadow-xs text-indigo-500 flex items-center justify-center text-base flex-shrink-0">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-bold text-gray-900 truncate font-dm-sans">MICE Tourism</div>
                                <div class="text-[10px] text-gray-500 truncate">Corporate tours</div>
                            </div>
                        </a>
                        <a href="/cruises.html" class="service-grid-card flex items-center gap-3 p-3 rounded-2xl bg-cyan-50/70 hover:bg-cyan-100/80 border border-cyan-100 transition-all">
                            <div class="w-10 h-10 rounded-xl bg-white shadow-xs text-cyan-600 flex items-center justify-center text-base flex-shrink-0">
                                <i class="fas fa-ship"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs font-bold text-gray-900 truncate font-dm-sans">Cruises</div>
                                <div class="text-[10px] text-gray-500 truncate">Luxury liners</div>
                            </div>
                        </a>
                        <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank" class="service-grid-card col-span-2 flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all mt-1">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-400 text-sm">
                                    <i class="fas fa-user-shield"></i>
                                </div>
                                <div>
                                    <div class="text-xs font-bold font-dm-sans text-white">Agent Login Portal</div>
                                    <div class="text-[10px] text-slate-300">Partner & Agent access</div>
                                </div>
                            </div>
                            <i class="fas fa-arrow-right text-xs text-slate-400 pr-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </li>`;

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

  // Replace the entire <li class="relative"> containing mobileServicesTrigger
  const regex = /<li\s+class="relative">[\s\S]*?mobileServicesTrigger[\s\S]*?<\/li>/gi;
  if (regex.test(content)) {
    content = content.replace(regex, newBottomSheetLI);
    modified = true;
  }

  // Update api.js cache buster
  if (content.includes('api.js')) {
    content = content.replace(/api\.js(\?v=[^"']*)?/g, 'api.js?v=20260817_1130');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
    console.log('Updated: ' + file);
  }
}

console.log(`Updated bottom sheet in ${count} HTML files.`);

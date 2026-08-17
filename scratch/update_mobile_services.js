const fs = require('fs');
const path = require('path');

const newServicesLI = `        <li class="relative">
            <a href="javascript:void(0)" id="mobileServicesTrigger" class="cursor-pointer" role="button" aria-expanded="false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 4px;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                Services
            </a>
            <div id="mobileServicesDropdown" class="hidden absolute bottom-full right-0 mb-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[99999] overflow-hidden ring-1 ring-black/10 origin-bottom-right transition-all duration-200 text-left">
                <div class="py-2">
                    <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-500 font-dm-sans">Services</span>
                        <i class="fi fi-rr-apps text-gray-400 text-xs"></i>
                    </div>
                    <a href="/flight-tickets.html" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans text-sm font-medium">
                        <i class="fas fa-plane text-sky-500 w-4 text-center"></i>
                        <span>Flight Tickets</span>
                    </a>
                    <a href="/global-visa-services.html" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans text-sm font-medium">
                        <i class="fas fa-passport text-amber-500 w-4 text-center"></i>
                        <span>Visa Services</span>
                    </a>
                    <a href="/travel-insurance.html" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans text-sm font-medium">
                        <i class="fas fa-shield-alt text-emerald-500 w-4 text-center"></i>
                        <span>Travel Insurance</span>
                    </a>
                    <a href="/miscellaneous.html" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans text-sm font-medium">
                        <i class="fas fa-concierge-bell text-purple-500 w-4 text-center"></i>
                        <span>Miscellaneous</span>
                    </a>
                    <a href="/mice-tourism.html" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans text-sm font-medium">
                        <i class="fas fa-users text-indigo-500 w-4 text-center"></i>
                        <span>MICE Tourism</span>
                    </a>
                    <a href="/cruises.html" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-sky-500 transition-colors font-dm-sans text-sm font-medium">
                        <i class="fas fa-ship text-blue-500 w-4 text-center"></i>
                        <span>Cruises</span>
                    </a>
                    <div class="h-px bg-gray-100 my-1 mx-2"></div>
                    <a href="https://agents.mangalamtravel.com/Config/Login/Agent" target="_blank" class="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-dm-sans text-xs font-semibold">
                        <i class="fas fa-user-shield text-slate-500 w-4 text-center"></i>
                        <span>Agent Login</span>
                    </a>
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
  if (content.includes('Agent Login') && content.includes('responsive-float-header')) {
    // Replace the Agent Login <li> inside responsive-float-header
    const regex = /<li[^>]*>[\s\n]*<a[^>]*href="[^"]*Agent"[^>]*>[\s\S]*?Agent Login[\s\S]*?<\/a>[\s\n]*<\/li>/gi;
    if (regex.test(content)) {
      content = content.replace(regex, newServicesLI);
      fs.writeFileSync(file, content, 'utf8');
      count++;
      console.log('Updated: ' + file);
    }
  }
}

console.log(`Successfully updated ${count} HTML files.`);

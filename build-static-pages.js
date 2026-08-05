/**
 * build-static-pages.js — Clean EJS to Static HTML Compiler
 * Converts EJS views into clean static HTML pages with clear container targets.
 * Ensures hero banner elements and page-specific JS script tags are injected properly.
 */

const fs   = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'backend/src/views');
const compDir  = path.join(viewsDir, 'components');
const pubDir   = path.join(__dirname, 'public');

if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

function getHeadHtml(title, desc) {
  const headComp = fs.readFileSync(path.join(compDir, 'head.ejs'), 'utf8');
  let h = headComp;
  h = h.replace(/<%[\s\S]*?%>/g, '');
  h = h.replace(/<%= cleanTitle %>/g, title || 'Mangalam Travel & Tours');
  h = h.replace(/<%= cleanDescription %>/g, desc || 'Discover amazing travel experiences with Mangalam Travel & Tours.');
  h = h.replace(/<%= cleanKeywords %>/g, 'tour packages, travel tours, vacation packages, customized tours, holiday packages, travel services, Mangalam Tours');
  h = h.replace(/<%= cleanImage %>/g, '/assets/images/logo/mangalam-tours-og.jpg');
  h = h.replace(/<%= cleanUrl %>/g, '');
  h = h.replace(/<%= cleanType %>/g, 'website');
  return h;
}

function getHeaderHtml(activeNav = 'home') {
  const headerComp = fs.readFileSync(path.join(compDir, 'header.ejs'), 'utf8');
  let h = headerComp;
  const baseLinkClass = 'text-gray-600 hover:text-gray-900 font-dm-sans transition-colors';
  const activeLinkClass = 'text-gray-900 font-bold font-dm-sans';

  const homeClass = activeNav === 'home' ? activeLinkClass : baseLinkClass;
  const destinationClass = activeNav === 'destination' ? activeLinkClass : baseLinkClass;
  const activityClass = activeNav === 'activity' ? activeLinkClass : baseLinkClass;
  const ticketsClass = activeNav === 'tickets' ? activeLinkClass : baseLinkClass;

  h = h.replace(/<%= homeClass %>/g, homeClass);
  h = h.replace(/<%= destinationClass %>/g, destinationClass);
  h = h.replace(/<%= activityClass %>/g, activityClass);
  h = h.replace(/<%= ticketsClass %>/g, ticketsClass);
  h = h.replace(/<%= baseLinkClass %>/g, baseLinkClass);
  h = h.replace(/<%[\s\S]*?%>/g, '');
  return h;
}

function resolveIncludes(content, activeNav = 'home', jsScript = null) {
  const footerComp    = fs.readFileSync(path.join(compDir, 'footer.ejs'), 'utf8');
  const customizeComp = fs.readFileSync(path.join(compDir, 'Customize.ejs'), 'utf8');
  const otpComp       = fs.readFileSync(path.join(compDir, 'EnquiryOtpFields.ejs'), 'utf8');
  const fixedBtnComp  = fs.readFileSync(path.join(compDir, 'FixedCustomizeButton.ejs'), 'utf8');
  const mobileNavComp = fs.readFileSync(path.join(compDir, 'MobileNav.ejs'), 'utf8');
  let scriptComp      = fs.readFileSync(path.join(compDir, 'script.ejs'), 'utf8');

  if (jsScript) {
    scriptComp += `\n<script src="./js/${jsScript}?v=${Date.now()}"></script>`;
  }

  content = content.replace(/<%- include\('components\/head'[\s\S]*?\)\s*%>/g, getHeadHtml('Mangalam Travel & Tours'));
  content = content.replace(/<%- include\('components\/header'\)\s*%>/g, getHeaderHtml(activeNav));
  content = content.replace(/<%- include\('components\/footer'\)\s*%>/g, footerComp);
  content = content.replace(/<%- include\('components\/Customize'\)\s*%>/g, customizeComp);
  content = content.replace(/<%- include\('components\/EnquiryOtpFields'[\s\S]*?\)\s*%>/g, otpComp);
  content = content.replace(/<%- include\('components\/FixedCustomizeButton'\)\s*%>/g, fixedBtnComp);
  content = content.replace(/<%- include\('components\/MobileNav'[\s\S]*?\)\s*%>/g, mobileNavComp);
  content = content.replace(/<%- include\('components\/script'\)\s*%>/g, scriptComp);

  // Sub-components
  content = content.replace(/<%- include\('\.\.\/components\/head'[\s\S]*?\)\s*%>/g, getHeadHtml('Mangalam Travel & Tours'));
  content = content.replace(/<%- include\('\.\.\/components\/header'\)\s*%>/g, getHeaderHtml(activeNav));
  content = content.replace(/<%- include\('\.\.\/components\/footer'\)\s*%>/g, footerComp);
  content = content.replace(/<%- include\('\.\.\/components\/script'\)\s*%>/g, scriptComp);

  return content;
}

// Clean EJS control blocks & loops cleanly
function cleanEjsBlocks(html) {
  // Strip notice block if un-evaluated
  html = html.replace(/<% if \(typeof latestNotice !== 'undefined' && latestNotice\) \{ %>[\s\S]*?<% \} %>/g, '');

  // Fix hero image, title, and heading span in packages/destination view
  html = html.replace(/<% if \(coverImg\) \{ %>[\s\S]*?<% \} %>/g,
    `<img id="dest-hero-img" src="./assets/images/bg-img.webp" alt="Destination Banner" class="w-full h-full object-cover md:rounded-br-[150px]">`);
  html = html.replace(/<h1 class="text-4xl md:text-5xl font-bold text-white font-\[Quicksand\] leading-tight drop-shadow-md"[\s\S]*?<\/h1>/g,
    `<h1 id="dest-hero-title" class="text-4xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight drop-shadow-md">Destination</h1>`);
  html = html.replace(/<% if \(desc\) \{ %>[\s\S]*?<% \} %>/g,
    `<p id="dest-hero-desc" class="text-white/90 text-sm md:text-base mt-2 font-dm-sans max-w-xl mx-auto drop-shadow-sm"></p>`);
  html = html.replace(/Popular Packages In <span class="text-red-600">[\s\S]*?<\/span>/g,
    `Popular Packages In <span id="dest-span-name" class="text-red-600"></span>`);

  // Strip poster carousel loops
  html = html.replace(/<div id="posterCarousel"[\s\S]*?<\/div>\s*<\/section>/g,
    `<div id="posterCarousel" class="splide"><div class="splide__track"><ul id="poster-list" class="splide__list"></ul></div></div></section>`);

  // Strip destinationNavCarousel loops
  html = html.replace(/<div class="splide" id="destinationNavCarousel">[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/g,
    `<div class="splide" id="destinationNavCarousel"><div class="splide__track"><ul class="splide__list"></ul></div></div>`);

  // Strip destinationCarousel loops
  html = html.replace(/<div class="splide" id="destinationCarousel">[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/g,
    `<div class="splide" id="destinationCarousel"><div class="splide__track"><ul class="splide__list"></ul></div></div>`);

  // Strip ticketsCarousel loops
  html = html.replace(/<div id="ticketsCarousel" class="splide">[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/g,
    `<div id="ticketsCarousel" class="splide"><div class="splide__track"><ul class="splide__list"></ul></div></div>`);
  html = html.replace(/<div class="splide" id="ticketsCarousel">[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/g,
    `<div class="splide" id="ticketsCarousel"><div class="splide__track"><ul class="splide__list"></ul></div></div>`);

  // Strip blogCarousel loops
  html = html.replace(/<div class="splide" id="blogCarousel">[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/g,
    `<div class="splide" id="blogCarousel"><div class="splide__track"><ul class="splide__list"></ul></div></div>`);

  // Remove any remaining inline EJS tags
  html = html.replace(/<%[\s\S]*?%>/g, '');

  return html;
}

const pageConfigs = {
  'index.ejs': { file: 'index.html', nav: 'home', script: 'index.js' },
  'about.ejs': { file: 'about.html', nav: 'about', script: 'about.js' },
  'activity-details.ejs': { file: 'activity-details.html', nav: 'activity', script: 'activity-details.js' },
  'attraction.ejs': { file: 'attraction.html', nav: 'activity', script: 'activity-details.js' },
  'blog-details.ejs': { file: 'blog-details.html', nav: 'blog', script: 'blog-details.js' },
  'blog.ejs': { file: 'blog.html', nav: 'blog', script: 'blog.js' },
  'career.ejs': { file: 'career.html', nav: 'career', script: 'career.js' },
  'cart.ejs': { file: 'cart.html', nav: 'cart', script: 'cart.js' },
  'contact.ejs': { file: 'contact.html', nav: 'contact', script: 'contact.js' },
  'cruises.ejs': { file: 'cruises.html', nav: 'destination', script: 'packages.js' },
  'curated-itineraries.ejs': { file: 'curated-itineraries.html', nav: 'destination', script: 'packages.js' },
  'fixed-departure-details.ejs': { file: 'fixed-departure-details.html', nav: 'destination', script: 'package-details.js' },
  'fixed-departures.ejs': { file: 'fixed-departures.html', nav: 'destination', script: 'packages.js' },
  'flight-tickets.ejs': { file: 'flight-tickets.html', nav: 'destination', script: 'tickets.js' },
  'global-visa-services.ejs': { file: 'global-visa-services.html', nav: 'destination', script: 'packages.js' },
  'holiday-package.ejs': { file: 'holiday-package.html', nav: 'destination', script: 'packages.js' },
  'honeymoon-packages.ejs': { file: 'honeymoon-packages.html', nav: 'destination', script: 'packages.js' },
  'mice-tourism.ejs': { file: 'mice-tourism.html', nav: 'destination', script: 'packages.js' },
  'miscellaneous.ejs': { file: 'miscellaneous.html', nav: 'destination', script: 'packages.js' },
  'package-details.ejs': { file: 'package-details.html', nav: 'destination', script: 'package-details.js' },
  'package.ejs': { file: 'packages.html', nav: 'destination', script: 'packages.js' },
  'privacy-policy.ejs': { file: 'privacy-policy.html', nav: 'home', script: null },
  'terms-and-conditions.ejs': { file: 'terms-and-conditions.html', nav: 'home', script: null },
  'thankyou.ejs': { file: 'thankyou.html', nav: 'home', script: null },
  'tickets-details.ejs': { file: 'ticket-details.html', nav: 'tickets', script: 'ticket-details.js' },
  'tickets.ejs': { file: 'tickets.html', nav: 'tickets', script: 'tickets.js' },
  'travel-insurance.ejs': { file: 'travel-insurance.html', nav: 'destination', script: 'packages.js' },
};

let count = 0;
for (const [ejsFile, config] of Object.entries(pageConfigs)) {
  const ejsPath = path.join(viewsDir, ejsFile);
  if (!fs.existsSync(ejsPath)) continue;
  let src = fs.readFileSync(ejsPath, 'utf8');
  src = resolveIncludes(src, config.nav, config.script);
  src = cleanEjsBlocks(src);

  fs.writeFileSync(path.join(pubDir, config.file), src, 'utf8');
  console.log(`Compiled: ${ejsFile} -> public/${config.file} (with ${config.script || 'no script'})`);
  count++;
}

console.log(`\nCompleted clean conversion of ${count} pages with full JS script bindings.`);

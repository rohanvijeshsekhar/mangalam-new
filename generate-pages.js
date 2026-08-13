const fs   = require('fs');
const path = require('path');
const pub  = path.join(__dirname, 'public');

if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true });

// ─── Shared HTML blocks ─────────────────────────────────────────────────────

const HEAD_LINKS = `
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css'>
    <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/3.0.0/uicons-bold-rounded/css/uicons-bold-rounded.css'>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
    <script>tailwind.config={theme:{extend:{fontFamily:{'dm-sans':['DM Sans','sans-serif']}}}}</script>
    <style>.cart-trigger{position:relative}.cart-trigger .counter{position:absolute;top:-8px;right:-8px;background:#ef4444;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}</style>`;

const NAV = `<header class="sticky top-0 z-50 bg-white shadow-sm">
<nav class="container mx-auto px-4 py-3 flex items-center justify-between">
  <a href="/"><img src="/assets/images/logo-color.png" alt="Mangalam Tours" class="h-10"></a>
  <div class="hidden md:flex space-x-6 text-sm font-dm-sans">
    <a href="/" class="text-gray-700 hover:text-red-600">Home</a>
    <a href="/packages" class="text-gray-700 hover:text-red-600">Packages</a>
    <a href="/tickets" class="text-gray-700 hover:text-red-600">Tickets</a>
    <a href="/about" class="text-gray-700 hover:text-red-600">About</a>
    <a href="/contact" class="text-gray-700 hover:text-red-600">Contact</a>
    <a href="/blog" class="text-gray-700 hover:text-red-600">Blog</a>
  </div>
  <a href="/cart" class="cart-trigger relative p-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center">
    <div class="counter">0</div>
    <i class="fi fi-rr-shopping-cart text-gray-700 text-lg flex items-center justify-center"></i>
  </a>
</nav>
</header>`;

const NOTICE = `<div id="notice-bar" class="bg-red-600 text-white text-center text-sm font-dm-sans py-2.5 px-4" style="display:none"><span id="notice-text"></span></div>`;

const FOOTER = `<footer class="bg-black text-white py-10 mb-20 lg:mb-0">
<div class="container mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-gray-700 pb-8">
    <div><h4 class="font-bold mb-3 text-white">Top Destinations</h4><div id="footer-dests-1" class="space-y-1 text-sm text-gray-300"></div></div>
    <div><h4 class="font-bold mb-3 text-white">Top Activities</h4><div id="footer-activities" class="space-y-1 text-sm text-gray-300"></div></div>
    <div><h4 class="font-bold mb-3 text-white">Top Tickets</h4><div id="footer-tickets" class="space-y-1 text-sm text-gray-300"></div></div>
  </div>
  <div class="flex flex-col md:flex-row items-center justify-between gap-4">
    <a href="/"><img src="/assets/images/logo.png" alt="Mangalam Tours" class="h-10"></a>
    <p class="text-gray-400 text-sm">2026 Mangalam Travel &amp; Tours. All rights reserved.</p>
    <div class="flex space-x-3">
      <a href="#" class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700"><i class="fab fa-facebook-f text-white"></i></a>
      <a href="#" class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700"><i class="fab fa-instagram text-white"></i></a>
    </div>
  </div>
</div>
</footer>`;

function scripts(pageJs) {
  return `
    <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>window.SMS_OTP_EMAIL_REQUIRED=true;</script>
    <script src="./js/enquiryOtp.js"></script>
    <script src="./js/customize.js"></script>
    <script src="./js/App.js"></script>
    <script src="./js/api.js?v=20260812"></script>
    <script src="./js/render.js?v=20260812"></script>
    <script src="./js/${pageJs}?v=20260812"></script>
    <script>AOS.init({once:true,duration:700});if(typeof updateCartCount==='function')updateCartCount();</script>
  </body></html>`;
}

function page(filename, title, desc, body, jsFile) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,user-scalable=no">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#dc2626">
<title>${title} | Mangalam Travel &amp; Tours</title>
<meta name="description" content="${desc}">
<link rel="shortcut icon" href="/assets/images/logo/favicon.ico">
${HEAD_LINKS}
</head>
<body class="font-dm-sans bg-white">
${NAV}
${NOTICE}
${body}
${FOOTER}
${scripts(jsFile)}`;
  const fp = path.join(pub, filename);
  fs.writeFileSync(fp, html, 'utf8');
  console.log('Created:', filename);
}

// ─── Pages ─────────────────────────────────────────────────────────────────

page('package-details.html', 'Package Details', 'Full holiday package details, itinerary and booking',
  `<div id="package-detail-root" class="min-h-screen">
    <div class="container mx-auto px-4 py-20 text-center text-gray-400">Loading package...</div>
  </div>`, 'package-details.js');

page('ticket-details.html', 'Ticket Details', 'Attraction ticket details and booking',
  `<div id="ticket-detail-root" class="min-h-screen">
    <div class="container mx-auto px-4 py-20 text-center text-gray-400">Loading ticket...</div>
  </div>`, 'ticket-details.js');

page('activity-details.html', 'Activity Details', 'Activity and tour details with booking',
  `<div id="activity-detail-root" class="min-h-screen">
    <div class="container mx-auto px-4 py-20 text-center text-gray-400">Loading activity...</div>
  </div>`, 'activity-details.js');

page('blog.html', 'Travel Blog', 'Latest travel tips, destination guides and inspiring stories',
  `<main class="min-h-screen">
    <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 text-center">
      <h1 class="text-4xl font-bold font-[Quicksand] mb-2">Travel Blog</h1>
      <p class="text-gray-300 font-dm-sans">Travel tips, destination guides and inspiring stories</p>
    </div>
    <section class="py-12 container mx-auto px-4">
      <div id="blog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="col-span-full text-center py-20 text-gray-400">Loading posts...</div>
      </div>
    </section>
  </main>`, 'blog.js');

page('blog-details.html', 'Blog', 'Travel blog post',
  `<div id="blog-detail-root" class="min-h-screen">
    <div class="container mx-auto px-4 py-20 text-center text-gray-400">Loading post...</div>
  </div>`, 'blog-details.js');

page('about.html', 'About Us', '3 decades of travel expertise - Mangalam Travel and Tours',
  `<main class="min-h-screen">
    <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center">
      <h1 class="text-4xl font-bold font-[Quicksand] mb-3">About Us</h1>
      <p class="text-gray-300 font-dm-sans max-w-2xl mx-auto">Curating unforgettable travel experiences for over 3 decades</p>
    </div>
    <section class="py-16 container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div><img src="/assets/images/abt-img-1.webp" alt="About us" class="rounded-3xl w-full h-auto object-cover shadow-lg"></div>
        <div>
          <h2 class="text-3xl font-bold font-[Quicksand] text-gray-800 mb-6">We Believe Travel Is More Than Visiting New Places</h2>
          <p class="text-gray-600 font-dm-sans leading-relaxed mb-6">At Mangalam Travel And Tours, We Believe Travel Is More Than Just Visiting New Places — It's About Creating Stories, Embracing Cultures, And Building Memories That Last A Lifetime.</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-2xl p-5 text-center"><div class="text-3xl font-bold font-[Quicksand]">3+</div><div class="text-gray-600 text-sm font-dm-sans">Decades</div></div>
            <div class="bg-gray-50 rounded-2xl p-5 text-center"><div class="text-3xl font-bold font-[Quicksand]">10K+</div><div class="text-gray-600 text-sm font-dm-sans">Happy Travellers</div></div>
            <div class="bg-gray-50 rounded-2xl p-5 text-center"><div class="text-3xl font-bold font-[Quicksand]">50+</div><div class="text-gray-600 text-sm font-dm-sans">Destinations</div></div>
            <div class="bg-gray-50 rounded-2xl p-5 text-center"><div class="text-3xl font-bold font-[Quicksand]">500+</div><div class="text-gray-600 text-sm font-dm-sans">Packages</div></div>
          </div>
        </div>
      </div>
      <div class="text-center mb-8"><h2 class="text-3xl font-bold font-[Quicksand] text-gray-800">What Our Travellers Say</h2></div>
      <div id="testimonials-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div class="col-span-full text-center py-10 text-gray-400">Loading reviews...</div>
      </div>
      <div class="text-center mb-8"><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800">Our Partners</h2></div>
      <div id="partners-grid" class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4"></div>
    </section>
  </main>`, 'about.js');

page('contact.html', 'Contact Us', 'Get in touch with Mangalam Travel and Tours',
  `<main class="min-h-screen">
    <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 text-center">
      <h1 class="text-4xl font-bold font-[Quicksand] mb-2">Contact Us</h1>
      <p class="text-gray-300 font-dm-sans">We'd love to help you plan your next adventure</p>
    </div>
    <section class="py-16 container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-6">Send us a Message</h2>
          <form id="contact-form" class="space-y-4">
            <input type="text" name="name" required placeholder="Full Name" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <input type="email" name="email" required placeholder="Email" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <input type="tel" name="phone" placeholder="Phone" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
            <textarea name="message" rows="5" required placeholder="How can we help?" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
            <button type="submit" id="contact-submit" class="w-full bg-black text-white py-3 rounded-xl font-semibold font-dm-sans hover:bg-gray-800 transition-colors">Send Message</button>
            <div id="contact-alert" class="hidden text-center py-3 rounded-xl text-sm font-dm-sans"></div>
          </form>
        </div>
        <div>
          <h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-6">Get in Touch</h2>
          <div class="space-y-6">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fi fi-rr-marker text-red-600 text-xl flex items-center justify-center"></i></div>
              <div><h3 class="font-bold text-gray-800 font-dm-sans mb-1">Address</h3><p class="text-gray-600 font-dm-sans text-sm">5 &amp; 6, 1st Floor, Our Tower, Vellayambalam, Thiruvananthapuram, Kerala 695010</p></div>
            </div>
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0"><i class="fi fi-rr-envelope text-red-600 text-xl flex items-center justify-center"></i></div>
              <div><h3 class="font-bold text-gray-800 font-dm-sans mb-1">Email</h3><a href="mailto:enquiries@mangalamtravel.com" class="text-red-600 font-dm-sans text-sm">enquiries@mangalamtravel.com</a></div>
            </div>
          </div>
          <div class="mt-8 rounded-2xl overflow-hidden h-64 bg-gray-200">
            <iframe src="https://maps.google.com/maps?q=Mangalam+Travel+Thiruvananthapuram&output=embed" width="100%" height="100%" style="border:0" allowfullscreen loading="lazy"></iframe>
          </div>
        </div>
      </div>
    </section>
  </main>`, 'contact.js');

page('career.html', 'Careers', 'Join the Mangalam Travel and Tours team',
  `<main class="min-h-screen">
    <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 text-center">
      <h1 class="text-4xl font-bold font-[Quicksand] mb-2">Join Our Team</h1>
      <p class="text-gray-300 font-dm-sans">Be part of something extraordinary</p>
    </div>
    <section class="py-16 container mx-auto px-4 max-w-2xl">
      <h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-8 text-center">Apply Now</h2>
      <form id="career-form" class="space-y-4" enctype="multipart/form-data">
        <input type="text" name="name" required placeholder="Full Name" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
        <input type="email" name="email" required placeholder="Email" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
        <input type="tel" name="phone" required placeholder="Phone" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
        <input type="text" name="position" required placeholder="Position Applied For" class="block w-full rounded-xl border border-gray-300 py-3 px-4 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
        <input type="file" name="resume" accept=".pdf,.doc,.docx" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700">
        <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-semibold font-dm-sans hover:bg-gray-800 transition-colors">Submit Application</button>
        <div id="career-alert" class="hidden text-center py-3 rounded-xl text-sm font-dm-sans"></div>
      </form>
    </section>
  </main>`, 'career.js');

page('cart.html', 'Cart', 'Your booked items and enquiry cart',
  `<main class="min-h-screen container mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold font-[Quicksand] text-gray-800 mb-8">Your Cart</h1>
    <div id="cart-root"><div class="text-center py-20 text-gray-400">Loading cart...</div></div>
  </main>`, 'cart.js');

// Thank you page (special - no footer data loading needed)
fs.writeFileSync(path.join(pub, 'thankyou.html'), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,user-scalable=no">
<title>Thank You | Mangalam Travel &amp; Tours</title>
${HEAD_LINKS}
</head>
<body class="font-dm-sans bg-white">
${NAV}
<main class="min-h-screen flex items-center justify-center">
  <div class="text-center px-4">
    <div class="text-8xl mb-6">&#x2705;</div>
    <h1 class="text-4xl font-bold font-[Quicksand] text-gray-800 mb-4">Thank You!</h1>
    <p class="text-gray-600 font-dm-sans mb-8">Your enquiry has been received. Our team will contact you shortly.</p>
    <a href="/" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Back to Home</a>
  </div>
</main>
${FOOTER}
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script src="/public/js/api.js"></script>
<script>AOS.init();</script>
</body></html>`);
console.log('Created: thankyou.html');

page('privacy-policy.html', 'Privacy Policy', 'Mangalam Travel and Tours Privacy Policy',
  `<main class="min-h-screen container mx-auto px-4 py-16 max-w-4xl">
    <h1 class="text-4xl font-bold font-[Quicksand] text-gray-800 mb-8">Privacy Policy</h1>
    <div class="text-gray-600 font-dm-sans leading-relaxed space-y-6">
      <p>This Privacy Policy describes how Mangalam Travel &amp; Tours collects, uses, and shares information about you when you use our services.</p>
      <h2 class="text-xl font-bold font-[Quicksand] text-gray-800">Information We Collect</h2>
      <p>We collect information you provide directly to us including name, email address, phone number, and travel preferences when you make enquiries or book services.</p>
      <h2 class="text-xl font-bold font-[Quicksand] text-gray-800">How We Use Your Information</h2>
      <p>We use your information to provide and improve our services, process your bookings, and respond to your enquiries.</p>
      <h2 class="text-xl font-bold font-[Quicksand] text-gray-800">Contact</h2>
      <p>For questions about this Privacy Policy, contact us at <a href="mailto:enquiries@mangalamtravel.com" class="text-red-600">enquiries@mangalamtravel.com</a></p>
    </div>
  </main>`, 'about.js');

page('terms-and-conditions.html', 'Terms and Conditions', 'Mangalam Travel and Tours Terms and Conditions',
  `<main class="min-h-screen container mx-auto px-4 py-16 max-w-4xl">
    <h1 class="text-4xl font-bold font-[Quicksand] text-gray-800 mb-8">Terms &amp; Conditions</h1>
    <div class="text-gray-600 font-dm-sans leading-relaxed space-y-6">
      <p>By accessing and using Mangalam Travel &amp; Tours services, you accept and agree to be bound by these Terms and Conditions.</p>
      <h2 class="text-xl font-bold font-[Quicksand] text-gray-800">Bookings and Payments</h2>
      <p>All bookings are subject to availability. Prices are subject to change without notice. Full payment is required to confirm bookings.</p>
      <h2 class="text-xl font-bold font-[Quicksand] text-gray-800">Cancellation Policy</h2>
      <p>Cancellations must be made in writing. Refunds are subject to our cancellation policy which varies by package and destination.</p>
      <h2 class="text-xl font-bold font-[Quicksand] text-gray-800">Contact</h2>
      <p>For questions about these terms, contact us at <a href="mailto:enquiries@mangalamtravel.com" class="text-red-600">enquiries@mangalamtravel.com</a></p>
    </div>
  </main>`, 'about.js');

// Service / info pages
const servicePages = [
  ['attraction.html', 'Attractions', 'Top attraction tickets and activities',
   `<main class="min-h-screen"><section class="relative h-[48vh] min-h-[380px] overflow-hidden"><div class="absolute inset-0"><img src="./assets/images/activity-banner.webp" alt="Activities Banner" class="hidden lg:block w-full h-full object-cover rounded-br-[120px] md:rounded-br-[150px]"><img src="./assets/images/res-activity-banner.webp" alt="Activities Banner Mobile" class="lg:hidden w-full h-full object-cover rounded-br-[120px]"><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 rounded-br-[120px] md:rounded-br-[150px]"></div></div><div class="relative z-10 h-full flex items-end"><div class="container mx-auto px-4 pb-12"><h1 class="text-3xl md:text-5xl font-bold text-white font-[Quicksand] leading-tight drop-shadow-lg">Activities for Every Traveler</h1><p class="text-white/90 text-sm md:text-base mt-2 font-dm-sans max-w-xl drop-shadow">Experience the world's top attractions, entry tickets and unforgettable experiences</p></div></div></section><section class="py-12 container mx-auto px-4"><div id="attractions-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><div class="col-span-full text-center py-20 text-gray-400">Loading...</div></div></section></main>`,
   'attractions.js'],
  ['holiday-package.html', 'Holiday Packages', 'Curated holiday packages for every destination',
   `<main class="min-h-screen"><div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 text-center"><h1 class="text-4xl font-bold font-[Quicksand] mb-2">Holiday Packages</h1><p class="text-gray-300 font-dm-sans">Find your perfect holiday package</p></div><div class="bg-white border-b border-gray-200 py-4 sticky top-16 z-40"><div class="container mx-auto px-4 overflow-x-auto"><div id="dest-filter-bar" class="flex gap-2 min-w-max"><button class="dest-filter-btn px-4 py-2 rounded-full text-sm font-dm-sans border-2 border-gray-800 bg-gray-800 text-white" data-dest-id="" data-slug="">All</button></div></div></div><section class="py-12 container mx-auto px-4"><div id="packages-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><div class="col-span-full text-center py-20 text-gray-400">Loading...</div></div></section></main>`,
   'packages.js'],
  ['flight-tickets.html', 'Flight Tickets', 'Book domestic and international flights',
   `<main class="min-h-screen"><div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center"><h1 class="text-4xl font-bold font-[Quicksand] mb-3">Flight Tickets</h1><p class="text-gray-300 font-dm-sans">Book domestic and international flight tickets with ease</p></div><section class="py-16 container mx-auto px-4 max-w-2xl text-center"><div class="bg-gray-50 rounded-2xl p-10"><i class="fi fi-rr-plane text-6xl text-gray-300 mb-6 flex justify-center items-center"></i><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Book Your Flight</h2><p class="text-gray-600 font-dm-sans mb-8">Contact us to book flight tickets at the best rates</p><a href="/contact" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Contact Us</a></div></section></main>`,
   'about.js'],
  ['global-visa-services.html', 'Visa Services', 'Global visa services for all destinations',
   `<main class="min-h-screen"><div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center"><h1 class="text-4xl font-bold font-[Quicksand] mb-3">Visa Services</h1><p class="text-gray-300 font-dm-sans">Hassle-free visa processing for all destinations</p></div><section class="py-16 container mx-auto px-4 max-w-2xl text-center"><div class="bg-gray-50 rounded-2xl p-10"><i class="fi fi-rr-passport text-6xl text-gray-300 mb-6 flex justify-center items-center"></i><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Get Your Visa</h2><p class="text-gray-600 font-dm-sans mb-8">We handle all documentation and visa processing for you</p><a href="/contact" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Enquire Now</a></div></section></main>`,
   'about.js'],
  ['travel-insurance.html', 'Travel Insurance', 'Comprehensive travel insurance for peace of mind',
   `<main class="min-h-screen"><div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center"><h1 class="text-4xl font-bold font-[Quicksand] mb-3">Travel Insurance</h1><p class="text-gray-300 font-dm-sans">Travel with confidence and peace of mind</p></div><section class="py-16 container mx-auto px-4 max-w-2xl text-center"><div class="bg-gray-50 rounded-2xl p-10"><i class="fi fi-rr-shield-check text-6xl text-gray-300 mb-6 flex justify-center items-center"></i><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Get Covered</h2><p class="text-gray-600 font-dm-sans mb-8">Comprehensive travel insurance for individuals and families</p><a href="/contact" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Get a Quote</a></div></section></main>`,
   'about.js'],
  ['miscellaneous.html', 'Miscellaneous Services', 'Additional travel services by Mangalam',
   `<main class="min-h-screen"><div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center"><h1 class="text-4xl font-bold font-[Quicksand] mb-3">Miscellaneous Services</h1><p class="text-gray-300 font-dm-sans">Additional travel services to make your journey smooth</p></div><section class="py-16 container mx-auto px-4 max-w-2xl text-center"><p class="text-gray-600 font-dm-sans mb-8">Contact us for airport transfers, hotel bookings, and other travel services</p><a href="/contact" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Contact Us</a></section></main>`,
   'about.js'],
  ['mice-tourism.html', 'MICE Tourism', 'Corporate meetings, incentives, conferences and events',
   `<main class="min-h-screen"><div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center"><h1 class="text-4xl font-bold font-[Quicksand] mb-3">MICE Tourism</h1><p class="text-gray-300 font-dm-sans">Meetings, Incentives, Conferences and Events</p></div><section class="py-16 container mx-auto px-4 max-w-2xl text-center"><div class="bg-gray-50 rounded-2xl p-10"><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Corporate Travel Solutions</h2><p class="text-gray-600 font-dm-sans mb-8">We specialise in organising corporate events, incentive trips, and conference travel</p><a href="/contact" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Enquire Now</a></div></section></main>`,
   'about.js'],
  ['cruises.html', 'Cruises', 'Luxury cruise packages and bookings',
   `<main class="min-h-screen"><div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 text-center"><h1 class="text-4xl font-bold font-[Quicksand] mb-3">Cruises</h1><p class="text-gray-300 font-dm-sans">Discover the world from the sea</p></div><section class="py-16 container mx-auto px-4 max-w-2xl text-center"><div class="bg-gray-50 rounded-2xl p-10"><i class="fi fi-rr-ship text-6xl text-gray-300 mb-6 flex justify-center items-center"></i><h2 class="text-2xl font-bold font-[Quicksand] text-gray-800 mb-4">Book Your Cruise</h2><p class="text-gray-600 font-dm-sans mb-8">Luxury cruise packages to Mediterranean, Caribbean, and more</p><a href="/contact" class="inline-flex items-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors font-dm-sans">Enquire Now</a></div></section></main>`,
   'about.js'],
];

servicePages.forEach(([file, title, desc, body, js]) => page(file, title, desc, body, js));

// Final count
const htmlFiles = fs.readdirSync(pub).filter(f => f.endsWith('.html'));
console.log('\n=== DONE ===');
console.log('Total HTML files in /public:', htmlFiles.length);
htmlFiles.forEach(f => console.log(' -', f));

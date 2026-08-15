const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:/Users/rohan/Downloads/public_html2';

const FB_URL = 'https://www.facebook.com/MangalamTravelandTours/';
const INSTA_URL = 'https://www.instagram.com/mangalamtravelandtours/';
const WA_URL = 'https://wa.me/918714636969';
const PHONE_DISPLAY = '+91 8714636969';
const TEL_URL = 'tel:+918714636969';

const files = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Replace old facebook links
  if (content.includes('https://www.facebook.com/mangalamtours') || content.includes('facebook.com/MangalamTravelandTours')) {
    content = content.replace(/https:\/\/www\.facebook\.com\/[A-Za-z0-9_.-]+(?=["'\/])/g, (match) => {
      if (match.includes('sharer')) return match; // don't touch share buttons
      return FB_URL;
    });
    modified = true;
  }

  // 2. Replace old instagram links
  if (content.includes('instagram.com')) {
    content = content.replace(/https:\/\/www\.instagram\.com\/[A-Za-z0-9_.-]+(?=["'\/])/g, (match) => {
      return INSTA_URL;
    });
    modified = true;
  }

  // 3. Replace old whatsapp wa.me numbers
  if (content.includes('wa.me')) {
    content = content.replace(/https:\/\/wa\.me\/\d+/g, WA_URL);
    modified = true;
  }

  // 4. Replace old phone tel: links
  if (content.includes('tel:+919585541102') || content.includes('tel:+919876543210')) {
    content = content.replace(/tel:\+91(9585541102|9876543210)/g, TEL_URL);
    content = content.replace(/\+91\s*(9585541102|9876543210)/g, PHONE_DISPLAY);
    modified = true;
  }

  // 5. Update footer social icons if placeholder '#' was present
  // Footer social media icons block:
  const footerSocialRegex = /<div class="flex space-x-4">[\s\S]*?<\/div>/g;
  content = content.replace(footerSocialRegex, (match) => {
    if (match.includes('fa-facebook') || match.includes('fa-instagram') || match.includes('fa-whatsapp')) {
      return `<div class="flex space-x-4">
                            <a href="${FB_URL}" target="_blank" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="Facebook">
                                <i class="fab fa-facebook-f text-white"></i>
                            </a>
                            <a href="${WA_URL}" target="_blank" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="WhatsApp">
                                <i class="fab fa-whatsapp text-white"></i>
                            </a>
                            <a href="${INSTA_URL}" target="_blank" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="Instagram">
                                <i class="fab fa-instagram text-white"></i>
                            </a>
                        </div>`;
    }
    return match;
  });

  // 6. Update Contact Column in footer to include phone number
  const contactColRegex = /(<h3 class="text-lg font-bold mb-4">Contact<\/h3>\s*<ul class="space-y-2">\s*<li class="text-gray-300">[^<]+<\/li>)([\s\S]*?)(<\/ul>)/;
  if (contactColRegex.test(content)) {
    content = content.replace(contactColRegex, (fullMatch, addrPart, middle, closeUl) => {
      if (!middle.includes('tel:+918714636969')) {
        return `${addrPart}
                            <li><a href="${TEL_URL}" class="text-gray-300 hover:text-white transition-colors flex items-center gap-2"><i class="fas fa-phone text-xs"></i> ${PHONE_DISPLAY}</a></li>
                            <li><a href="mailto:enquiries@mangalamtravel.com" class="text-gray-300 hover:text-white transition-colors">enquiries@mangalamtravel.com</a></li>
                        ${closeUl}`;
      }
      return fullMatch;
    });
    modified = true;
  }

  // 7. Connect all "Talk to Expert" buttons to WhatsApp link
  // Pattern matching links with "Talk to Expert" or "Talk to an Expert"
  content = content.replace(/<a\s+[^>]*?href=["'][^"']*?["'][^>]*?>([\s\S]*?Talk to\s*(?:an\s*)?Expert[\s\S]*?)<\/a>/gi, (match, inner) => {
    // Keep existing classes, update href to WA_URL and ensure target="_blank"
    let updated = match;
    updated = updated.replace(/href=["'][^"']*?["']/, `href="${WA_URL}" target="_blank"`);
    if (!updated.includes('target="_blank"')) {
      updated = updated.replace('<a ', '<a target="_blank" ');
    }
    return updated;
  });

  fs.writeFileSync(filePath, content, 'utf8');

  // Also sync to public/ and backend/public/
  const publicPath = path.join(ROOT_DIR, 'public', file);
  if (fs.existsSync(path.dirname(publicPath))) fs.writeFileSync(publicPath, content, 'utf8');

  const backendPublicPath = path.join(ROOT_DIR, 'backend', 'public', file);
  if (fs.existsSync(path.dirname(backendPublicPath))) fs.writeFileSync(backendPublicPath, content, 'utf8');

  console.log(`Updated social, footer & expert buttons in ${file}`);
});

console.log('All files updated successfully!');

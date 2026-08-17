const fs = require('fs');

const contactFiles = [
  'contact.html',
  'public/contact.html',
  'backend/public/contact.html'
];

const blogDetailsFiles = [
  'blog-details.html',
  'public/blog-details.html',
  'backend/public/blog-details.html'
];

const blogFiles = [
  'blog.html',
  'public/blog.html',
  'backend/public/blog.html'
];

// 1. Fix contact.html header layout
for (const file of contactFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix early closing of flex container
  content = content.replace(
    /<\/nav>\s*<\/div>\s*<!--\s*Top Right Corner Bento Menu Icon\s*-->/gi,
    '</nav>\n\n            <!-- Top Right Corner Bento Menu Icon -->'
  );
  
  // Ensure script version query
  content = content.replace(/api\.js(\?v=[^"']*)?/g, 'api.js?v=20260817_1120');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed header layout in: ' + file);
}

// 2. Fix blog-details.html header layout & stray OTP block
for (const file of blogDetailsFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove stray OTP block before header if present
  content = content.replace(/<div class="enquiry-otp-block mt-3" data-otp-prefix="">[\s\S]*?<\/div>\s*<\/div>\s*<p id="-otpStatusMsg" class="text-sm font-dm-sans hidden mt-2"><\/p>\s*<\/div>/gi, '');
  
  // Fix early closing of flex container
  content = content.replace(
    /<\/nav>\s*<\/div>\s*<!--\s*Top Right Corner Bento Menu Icon\s*-->/gi,
    '</nav>\n\n            <!-- Top Right Corner Bento Menu Icon -->'
  );
  
  // Ensure script version query
  content = content.replace(/api\.js(\?v=[^"']*)?/g, 'api.js?v=20260817_1120');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed header layout in: ' + file);
}

// 3. Fix blog.html stray OTP block and script versions
for (const file of blogFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove stray OTP block before header if present
  content = content.replace(/<div class="enquiry-otp-block mt-3" data-otp-prefix="">[\s\S]*?<\/div>\s*<\/div>\s*<p id="-otpStatusMsg" class="text-sm font-dm-sans hidden mt-2"><\/p>\s*<\/div>/gi, '');
  
  // Ensure script version query
  content = content.replace(/api\.js(\?v=[^"']*)?/g, 'api.js?v=20260817_1120');
  content = content.replace(/blog\.js(\?v=[^"']*)?/g, 'blog.js?v=20260817_1120');
  content = content.replace(/render\.js(\?v=[^"']*)?/g, 'render.js?v=20260817_1120');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed blog scripts and stray OTP in: ' + file);
}

console.log('All files fixed.');

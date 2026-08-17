const fs = require('fs');

const indexFiles = [
  'index.html',
  'public/index.html',
  'backend/public/index.html'
];

const targetPattern = /<!--\s*Hero Section\s*-->\s*<section\s+class="[^"]*"\s+style="[^"]*background-image:[^"]*"\s+data-aos="fade-up">/gi;

const replacement = `<!-- Hero Section -->
                    <section class="relative z-20 h-screen overflow-visible" data-aos="fade-up">
                        <!-- Responsive Hero Background Picture (Landscape Desktop / Portrait Mobile, 100% Quality) -->
                        <picture class="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
                            <source media="(max-width: 767px)" srcset="./assets/images/home-hero-mobile.jpg">
                            <img src="./assets/images/home-hero-desktop.jpg" alt="Mangalam Travel & Tours" class="w-full h-full object-cover object-center">
                        </picture>
                        <div class="absolute inset-0 bg-black/20 -z-10 pointer-events-none"></div>`;

for (const file of indexFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (targetPattern.test(content)) {
    content = content.replace(targetPattern, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated hero image in:', file);
  } else {
    console.log('Target pattern not found in:', file);
  }
}

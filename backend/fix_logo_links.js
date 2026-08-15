const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:/Users/rohan/Downloads/public_html2';
const files = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace any anchor wrapping a logo that points to WhatsApp or anything other than /
  content = content.replace(/<a\s+[^>]*?href=["'][^"']*?["'][^>]*?>(\s*<img[^>]+logo[^>]+>\s*)<\/a>/gi, (match, innerImg) => {
    return `<a href="/">${innerImg}</a>`;
  });

  // Also replace any specific logo wrappers
  content = content.replace(/<a\s+href="https:\/\/wa\.me\/918714636969"\s+target="_blank">(\s*<img[^>]+logo[^>]+>\s*)<\/a>/gi, '<a href="/">$1</a>');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');

    const pubPath = path.join(ROOT_DIR, 'public', file);
    if (fs.existsSync(path.dirname(pubPath))) fs.writeFileSync(pubPath, content, 'utf8');

    const backendPubPath = path.join(ROOT_DIR, 'backend', 'public', file);
    if (fs.existsSync(path.dirname(backendPubPath))) fs.writeFileSync(backendPubPath, content, 'utf8');

    console.log(`Fixed logo link in ${file}`);
  }
});

console.log('Finished fixing all logo links!');

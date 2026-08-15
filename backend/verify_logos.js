const fs = require('fs');
const glob = fs.readdirSync('c:/Users/rohan/Downloads/public_html2').filter(f => f.endsWith('.html'));

let nonHome = 0;
glob.forEach(f => {
  const content = fs.readFileSync('c:/Users/rohan/Downloads/public_html2/' + f, 'utf8');
  const matches = content.match(/<a\s+[^>]*>[\s\S]*?<img[^>]+logo[^>]+>[\s\S]*?<\/a>/gi);
  if (matches) {
    matches.forEach(m => {
      const match = m.match(/href=["']([^"']+)["']/);
      const href = match ? match[1] : '';
      if (href !== '/') {
        console.log('Non home in', f, ':', href);
        nonHome++;
      }
    });
  }
});
if (nonHome === 0) {
  console.log('SUCCESS: All logos link strictly to / (Home)!');
}

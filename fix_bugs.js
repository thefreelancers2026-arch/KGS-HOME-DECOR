const fs = require('fs');

// 1. Fix product-listing.html filter bar
let pl = fs.readFileSync('product-listing.html', 'utf8');
const oldFilter = `<div class="bg-surface border-b border-border py-4 overflow-x-auto whitespace-nowrap px-5 md:px-12 space-x-2">`;
const newFilter = `<div class="bg-surface border-b border-border py-4 overflow-x-auto no-scrollbar" style="-webkit-overflow-scrolling: touch;">
    <div class="flex items-center gap-2 px-5 md:px-12 w-max pr-8 md:pr-12">`;
if (pl.includes(oldFilter)) {
  pl = pl.replace(oldFilter, newFilter);
  // Also replace the closing div of the filter container? Wait, the original was just one div containing buttons.
  // We added a wrapper. Let's find the closing div of that section.
  const oldEnd = `</button>\n  </div>\n<script>`;
  const newEnd = `</button>\n    </div>\n  </div>\n<script>`;
  pl = pl.replace(oldEnd, newEnd);
  // Also change `inline-block` to `shrink-0`
  pl = pl.replace(/inline-block/g, 'shrink-0');
  fs.writeFileSync('product-listing.html', pl);
}

// 2. Replace "Indian" with "export-quality" globally in all HTML files
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('modern Indian home décor')) {
    content = content.replace(/modern Indian home décor/g, 'modern export-quality home décor');
    changed = true;
  }
  
  // 3. Fix VIEW ALL REVIEWS in index.html
  if (file === 'index.html' && content.includes('VIEW ALL REVIEWS')) {
    // find the href="#" near VIEW ALL REVIEWS
    const regex = /<a href="#"([^>]*?)>VIEW ALL REVIEWS<\/a>/;
    if (regex.test(content)) {
      content = content.replace(regex, '<a href="https://www.google.com/search?q=KGS+Home+Decors+Virudhachalam#lrd=0x0:0x0,1,,," target="_blank"$1>VIEW ALL REVIEWS</a>');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed text in ' + file);
  }
}

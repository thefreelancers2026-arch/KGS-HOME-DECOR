const fs = require('fs');

const masterCategories = [
  { name: 'Furniture', handle: 'furniture', img: 'assets/images/categories/cat_sofas.png', sub: 'Premium Comfort' },
  { name: 'Décor', handle: 'decor', img: 'assets/images/categories/cat_decor.png', sub: 'Details That Matter' },
  { name: 'Wall Décor', handle: 'wall-decor', img: 'assets/images/categories/cat_wall_decor.png', sub: 'Style Your Walls' },
  { name: 'Lighting', handle: 'lighting', img: 'assets/images/categories/cat_lighting.png', sub: 'Brighten Your Space' },
  { name: 'Lifestyle & Accessories', handle: 'lifestyle', img: 'assets/images/room_zen.webp', sub: 'Everyday Elegance' },
  { name: 'Vases & Plants', handle: 'plants', img: 'assets/images/categories/cat_plants.png', sub: 'Bring Life Home' },
  { name: 'Gifts', handle: 'gifts', img: 'assets/images/categories/cat_gifts.png', sub: 'For Every Occasion' }
];

// 1. GENERATE INDEX.HTML SHOP BY CATEGORY SECTION
const indexCategoryHTML = masterCategories.map(c => `
      <a href="product-listing.html?cat=${c.handle}" class="group flex flex-col items-center gap-4 text-center w-[140px] md:w-[160px] shrink-0">
        <div class="w-full aspect-square bg-base border border-border overflow-hidden rounded-md transition-all duration-300 group-hover:border-gold group-hover:shadow-lg">
          <img src="${c.img}" alt="${c.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div>
          <h3 class="text-ink font-semibold text-[13px]">${c.name}</h3>
          <p class="text-muted text-[11px] mt-1 hidden md:block">${c.sub}</p>
        </div>
      </a>`).join('\n');

const indexContainerStart = '<div class="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8 gsap-rv">';
const indexContainerEnd = '\n    </div>\n  </div>\n</section>\n\n<!-- ══ NEW ARRIVALS';

// Read index
let idx = fs.readFileSync('index.html', 'utf8');
const beforeIndex = idx.split(indexContainerStart)[0];
const afterIndex = idx.split(indexContainerEnd)[1];
idx = beforeIndex + '<div class="flex overflow-x-auto md:flex-wrap md:justify-center gap-4 md:gap-8 gsap-rv pb-4 md:pb-0 no-scrollbar">\n' + indexCategoryHTML + '\n    </div>\n  </div>\n</section>\n\n<!-- ══ NEW ARRIVALS' + afterIndex;
fs.writeFileSync('index.html', idx);


// 2. GENERATE PRODUCT-LISTING HEADER SUBNAV & PILLS
const subnavHTML = masterCategories.map(c => `<a href="product-listing.html?cat=${c.handle}" class="hover:text-gold transition-colors">${c.name}</a>`).join('\n      <span>&middot;</span>\n      ');

const subnavString = `<p class="text-muted text-[14px] mt-1">${masterCategories.map(c => c.name).join(' · ')}</p>`;

const pillsHTML = `<button data-cat="all" class="filter-btn text-[11px] font-semibold tracking-wide uppercase px-4 py-2 border border-border text-muted hover:border-warm hover:text-ink transition-colors shrink-0">All</button>\n` + 
  masterCategories.map(c => `    <button data-cat="${c.handle}" class="filter-btn text-[11px] font-semibold tracking-wide uppercase px-4 py-2 border border-border text-muted hover:border-warm hover:text-ink transition-colors shrink-0">${c.name.replace('&', '&amp;')}</button>`).join('\n');

let pl = fs.readFileSync('product-listing.html', 'utf8');

// replace subnav in desktop header
pl = pl.replace(/<nav class="hidden md:flex items-center gap-2 text-\[14px\] text-muted mb-12" id="sub-nav">[\s\S]*?<\/nav>/, 
  `<nav class="hidden md:flex items-center gap-2 text-[14px] text-muted mb-12" id="sub-nav">\n      ${subnavHTML}\n    </nav>`);

// replace subnav paragraph
pl = pl.replace(/<p class="text-muted text-\[14px\] mt-1">.*?<\/p>/, subnavString);

// replace pills
pl = pl.replace(/<div class="flex items-center gap-2 px-5 md:px-12 w-max pr-8 md:pr-12">[\s\S]*?<\/div>\n<script>/, 
  `<div class="flex items-center gap-2 px-5 md:px-12 w-max pr-8 md:pr-12">\n${pillsHTML}\n  </div>\n<script>`);

fs.writeFileSync('product-listing.html', pl);


// 3. GENERATE FOOTER AND APPLY TO ALL HTML FILES
const newShopFooter = `<div>
      <h4 class="text-ink text-[11px] tracking-[.18em] uppercase font-bold mb-6">Shop</h4>
      <ul class="space-y-4 text-[13px] text-muted font-medium">
        <li><a href="product-listing.html" class="hover:text-gold transition-colors">All Products</a></li>
${masterCategories.map(c => `        <li><a href="product-listing.html?cat=${c.handle}" class="hover:text-gold transition-colors">${c.name}</a></li>`).join('\n')}
      </ul>
    </div>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const shopFooterRegex = /<div>\s*<h4 class="text-ink text-\[11px\] tracking-\[\.18em\] uppercase font-bold mb-6">Shop<\/h4>\s*<ul class="space-y-4 text-\[13px\] text-muted font-medium">[\s\S]*?<\/ul>\s*<\/div>/g;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (shopFooterRegex.test(content)) {
    content = content.replace(shopFooterRegex, newShopFooter);
    fs.writeFileSync(f, content);
  }
});

console.log('Categories completely synced to 7 categories across the platform.');

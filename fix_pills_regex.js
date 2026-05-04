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

const pillsHTML = `<button data-cat="all" class="filter-btn text-[11px] font-semibold tracking-wide uppercase px-4 py-2 border border-border text-muted hover:border-warm hover:text-ink transition-colors shrink-0">All</button>\n` + 
  masterCategories.map(c => `    <button data-cat="${c.handle}" class="filter-btn text-[11px] font-semibold tracking-wide uppercase px-4 py-2 border border-border text-muted hover:border-warm hover:text-ink transition-colors shrink-0">${c.name.replace('&', '&amp;')}</button>`).join('\n');

let pl = fs.readFileSync('product-listing.html', 'utf8');

// replace pills
pl = pl.replace(/<button data-cat="all"[\s\S]*?<button data-cat="gifts"[^>]*>Gifts<\/button>/, pillsHTML);

fs.writeFileSync('product-listing.html', pl);
console.log('Fixed pills in product-listing.html');

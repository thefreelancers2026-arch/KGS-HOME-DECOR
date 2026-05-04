const fs = require('fs');
const glob = require('fs').readdirSync('.');
const htmlFiles = glob.filter(f => f.endsWith('.html'));

const footerPattern = /<footer class="bg-surface pt-16 md:pt-24 pb-8 border-t border-border">[\s\S]*?<\/footer>/;

const newFooter = `<footer class="bg-surface pt-16 md:pt-24 pb-8 border-t border-border">
  <div class="max-w-[90rem] mx-auto px-5 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-12 mb-16">
    <div class="col-span-2 md:col-span-1">
      <a href="index.html" class="font-serif font-medium tracking-[.35em] text-[1.4rem] text-ink block mb-6">KGS</a>
      <p class="text-muted text-[13px] leading-[1.8] mb-8 max-w-xs">Your one-stop destination for premium modern export-quality home décor and furniture in Virudhachalam.</p>
      <div class="flex items-center gap-4">
        <a href="https://wa.me/919789182921" target="_blank" class="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:border-[#25D366] hover:text-[#25D366] transition-colors bg-white">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>
    </div>
    <div class="col-span-1">
      <h4 class="text-ink text-[11px] tracking-[.18em] uppercase font-bold mb-6">Shop</h4>
      <ul class="space-y-4 text-[13px] text-muted font-medium">
        <li><a href="product-listing.html" class="hover:text-gold transition-colors">All Products</a></li>
        <li><a href="product-listing.html?cat=furniture" class="hover:text-gold transition-colors">Sofas & Furniture</a></li>
        <li><a href="product-listing.html?cat=decor" class="hover:text-gold transition-colors">Décor</a></li>
        <li><a href="product-listing.html?cat=wall-decor" class="hover:text-gold transition-colors">Wall Décor</a></li>
        <li><a href="product-listing.html?cat=lighting" class="hover:text-gold transition-colors">Lighting</a></li>
        <li><a href="product-listing.html?cat=lifestyle" class="hover:text-gold transition-colors">Lifestyle & Accessories</a></li>
        <li><a href="product-listing.html?cat=plants" class="hover:text-gold transition-colors">Vases & Plants</a></li>
        <li><a href="product-listing.html?cat=gifts" class="hover:text-gold transition-colors">Gifts</a></li>
      </ul>
    </div>
    <div class="col-span-1">
      <h4 class="text-ink text-[11px] tracking-[.18em] uppercase font-bold mb-6">Support</h4>
      <ul class="space-y-4 text-[13px] text-muted font-medium">
        <li><a href="contact.html" class="hover:text-gold transition-colors">Contact Us</a></li>
        <li><a href="shipping-policy.html" class="hover:text-gold transition-colors">Shipping Info</a></li>
        <li><a href="returns-policy.html" class="hover:text-gold transition-colors">Returns & Refunds</a></li>
        <li><a href="order-tracking.html" class="hover:text-gold transition-colors">Track Order</a></li>
      </ul>
    </div>
    <div class="col-span-2 md:col-span-1">
      <h4 class="text-ink text-[11px] tracking-[.18em] uppercase font-bold mb-6">Company</h4>
      <ul class="space-y-4 text-[13px] text-muted font-medium">
        <li><a href="about.html" class="hover:text-gold transition-colors">Our Story</a></li>
        <li><a href="privacy-policy.html" class="hover:text-gold transition-colors">Privacy Policy</a></li>
        <li><a href="terms.html" class="hover:text-gold transition-colors">Terms of Service</a></li>
      </ul>
    </div>
  </div>
  <div class="max-w-[90rem] mx-auto px-5 md:px-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
    <p class="text-[11px] tracking-[.15em] text-muted uppercase font-medium leading-relaxed">&copy; 2026 KGS Home Décors. All rights reserved.</p>
    <div class="flex items-center gap-3 opacity-60">
      <span class="text-[10px] tracking-[.15em] font-bold uppercase text-muted text-center md:text-right">Virudhachalam's Premium Choice</span>
    </div>
  </div>
</footer>`;

let changedCount = 0;
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (footerPattern.test(content)) {
    let newContent = content.replace(footerPattern, newFooter);
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
      changedCount++;
    }
  }
});
console.log('Fixed footer in ' + changedCount + ' files.');

const fs = require('fs');

let pd = fs.readFileSync('product-detail.html', 'utf8');

// 1. Fix Thumb Strip
pd = pd.replace(
  "strip.style.cssText = 'display:flex!important';",
  "strip.style.cssText = 'display:flex!important; overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none; -webkit-overflow-scrolling:touch; padding-bottom:4px; gap:8px;';"
);
pd = pd.replace(
  "style=\"width:64px;height:80px;overflow:hidden;border:2px solid ${i===0?'#C97840':'transparent'};padding:0;background:none;cursor:pointer;flex-shrink:0;\">",
  "style=\"width:64px;height:80px;overflow:hidden;border:2px solid ${i===0?'#C97840':'transparent'};padding:0;background:none;cursor:pointer;flex-shrink:0;scroll-snap-align:start;\">"
);

// 2. Fix Trust Hook Mobile Scroll
pd = pd.replace(
  '<div class="grid grid-cols-2 gap-y-4 gap-x-2">',
  '<div class="flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-2" style="scrollbar-width:none;-webkit-overflow-scrolling:touch;">'
);
// Remove the inner divs flex wrap logic if needed, but flex items-center gap-2 is fine inside the flex container.

// 3. Add Mobile Sticky CTA Bar
// Let's find the closing </main> tag to inject the mobile CTA before it, or right after it.
const mobileCta = `
<!-- MOBILE STICKY CTA -->
<div class="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-3 px-4 z-50 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
  <button id="pd-add-mobile" class="btn-secondary flex-1 py-3 text-[11px]">Add to Cart</button>
  <a id="pd-wa-mobile" href="#" target="_blank" class="btn-primary flex-1 py-3 text-[11px] !bg-[#25D366] !border-[#25D366]">WhatsApp</a>
</div>
`;
if (!pd.includes('MOBILE STICKY CTA')) {
  pd = pd.replace('</main>', '</main>\n' + mobileCta);
}

fs.writeFileSync('product-detail.html', pd);
console.log('product-detail.html updated successfully');

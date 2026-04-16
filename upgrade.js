// KGS Home Decors - Fix encoding + apply luxury UX upgrades
// Run: node upgrade.js

const fs = require('fs');
const path = require('path');

const dir = 'd:\\KGS HOME DECOR';

// ═══ STEP 1: Fix index.html encoding ═══════════════════════════
let idxBuf = fs.readFileSync(path.join(dir, 'index.html'));

// The file has double/triple-encoded UTF-8. We need to decode it properly.
// Strategy: decode as latin1 (preserving raw bytes), then re-interpret as UTF-8
let raw = idxBuf.toString('latin1');

// Replace double-encoded sequences back to proper UTF-8
// Pattern: C3 83 C2 A9 -> C3 A9 (e-acute)
// We'll do this by re-encoding from latin1 and decoding as UTF-8 recursively

function fixMojibake(str) {
  // Convert string to Buffer using latin1, then decode as UTF-8
  try {
    let buf = Buffer.from(str, 'latin1');
    let decoded = buf.toString('utf8');
    // Check if still has mojibake (contains high bytes that form valid multi-byte UTF-8)
    if (decoded !== str && !decoded.includes('\ufffd')) {
      // Try one more round
      let buf2 = Buffer.from(decoded, 'latin1');
      let decoded2 = buf2.toString('utf8');
      if (decoded2 !== decoded && !decoded2.includes('\ufffd')) {
        return decoded2;
      }
      return decoded;
    }
    return decoded;
  } catch(e) {
    return str;
  }
}

let idx = fixMojibake(raw);

// Verify the fix worked
if (idx.includes('\u00e9cor')) {
  console.log('[OK] Encoding: e-acute fixed');
} else if (idx.includes('DÃ©cor') || idx.includes('Ã©')) {
  console.log('[WARN] Still has mojibake, trying alternative decode...');
  // Direct approach - read as utf8, replace known mojibake patterns
  idx = idxBuf.toString('utf8');
}

// Use HTML entities for safety in all cases
const entityReplacements = [
  [/DÃ©cors/g, 'D&eacute;cors'],
  [/DÃ©cor/g, 'D&eacute;cor'],
  [/dÃ©cor/g, 'd&eacute;cor'],
  [/â€"/g, '&mdash;'],
  [/â€"/g, '&ndash;'],
  [/Â·/g, '&middot;'],
  [/â˜…/g, '&#9733;'],
  [/âœ"/g, '&#10003;'],
  [/âœ¦/g, '&#10022;'],
  [/â†'/g, '&rarr;'],
  [/â­/g, '&#11088;'],
  [/Â /g, ''],
  [/ðŸšš/g, '&#128666;'],
  [/â€˜/g, '&lsquo;'],
  [/â€™/g, '&rsquo;'],
];

for (const [pattern, replacement] of entityReplacements) {
  idx = idx.replace(pattern, replacement);
}

// If we still have the proper unicode chars, convert to entities too
idx = idx.replace(/é/g, '&eacute;');
idx = idx.replace(/—/g, '&mdash;');
idx = idx.replace(/–/g, '&ndash;');
idx = idx.replace(/·/g, '&middot;');
idx = idx.replace(/★/g, '&#9733;');
idx = idx.replace(/✓/g, '&#10003;');
idx = idx.replace(/✦/g, '&#10022;');
idx = idx.replace(/→/g, '&rarr;');
idx = idx.replace(/'/g, '&rsquo;');
idx = idx.replace(/'/g, '&lsquo;');

console.log('[OK] Entity conversion complete');

// ═══ STEP 2: Typography + Color Hierarchy Upgrades ═════════════

// Trust bar icons: text-warm → text-gold (decorative only)
idx = idx.replace(/material-symbols-outlined text-\[22px\] text-warm mb-2/g, 
  'material-symbols-outlined text-[22px] text-gold mb-2');

// Section overlines: text-[10px] → text-[11px], font-medium → font-semibold
idx = idx.replace(/text-\[10px\] font-medium tracking-\[\.18em\] uppercase text-gold mb-3/g,
  'text-[11px] font-semibold tracking-[.18em] uppercase text-gold mb-3');
idx = idx.replace(/text-\[10px\] font-semibold tracking-\[\.18em\] uppercase text-gold mb-6/g,
  'text-[11px] font-semibold tracking-[.18em] uppercase text-gold mb-6');

// Instagram overline: text-muted → text-gold
idx = idx.replace(/text-\[10px\] font-medium tracking-\[\.22em\] uppercase text-muted mb-2/g,
  'text-[11px] font-semibold tracking-[.18em] uppercase text-gold mb-2');

// About stats labels
idx = idx.replace(/text-\[10px\] text-muted tracking-\[\.18em\] uppercase mt-1/g,
  'text-[11px] text-muted tracking-[.14em] uppercase mt-1');

// Hero slide overlines
idx = idx.replace(/text-warm text-\[10px\] font-semibold tracking-\[\.22em\] uppercase mb-4/g,
  'text-gold text-[11px] font-semibold tracking-[.18em] uppercase mb-4');

// Google rating badge text
idx = idx.replace(/text-white\/70 text-\[10px\] font-semibold/g,
  'text-white/70 text-[11px] font-semibold');

// Review card labels
idx = idx.replace(/text-muted text-\[10px\] mt-1\.5/g, 'text-muted text-[11px] mt-1.5');
idx = idx.replace(/text-gold text-\[10px\] font-medium mt-2/g, 'text-gold text-[11px] font-medium mt-2');

// Review stars: text-warm → text-gold
idx = idx.replace(/class="text-warm text-xs mb-1\.5"/g, 'class="text-gold text-xs mb-1.5"');

// Footer stars: text-warm → text-gold, text-[10px] → text-[11px]
idx = idx.replace(/text-warm text-\[10px\]"/g, 'text-gold text-[11px]"');

// Footer headings: text-[10px] → text-[11px]
idx = idx.replace(/text-white text-\[10px\] tracking-\[\.22em\] uppercase font-semibold/g,
  'text-white text-[11px] tracking-[.18em] uppercase font-semibold');

// Footer copyright
idx = idx.replace(/text-\[10px\] tracking-\[\.14em\] uppercase text-white\/25/g,
  'text-[11px] tracking-[.14em] uppercase text-white/25');

// Collection tile overlines
idx = idx.replace(/text-white\/60 text-\[10px\] tracking-\[\.18em\] uppercase mb-1/g,
  'text-white/60 text-[11px] tracking-[.18em] uppercase mb-1');

// Reel CTA
idx = idx.replace(/>Shop Now<\/a>/g, '>Explore Collection</a>');

// Footer tagline
idx = idx.replace(/curated for Indian homes\./g, "Virudhachalam&rsquo;s favourite home d&eacute;cor store.");

console.log('[OK] index.html typography + color hierarchy upgraded');
fs.writeFileSync(path.join(dir, 'index.html'), idx, 'utf8');
console.log('[SAVED] index.html');


// ═══ PRODUCT-LISTING.HTML ══════════════════════════════════════
let pl = fs.readFileSync(path.join(dir, 'product-listing.html'), 'utf8');

// Trust bar icons
pl = pl.replace(/material-symbols-outlined text-\[22px\] text-warm mb-2/g,
  'material-symbols-outlined text-[22px] text-gold mb-2');
// Trust bar sub-labels
pl = pl.replace(/text-muted text-\[10px\] mt-0\.5/g, 'text-muted text-[11px] mt-0.5');
// Breadcrumb tracking
pl = pl.replace(/tracking-widest font-medium mb-4/g, 'tracking-[.14em] font-medium mb-4');

fs.writeFileSync(path.join(dir, 'product-listing.html'), pl, 'utf8');
console.log('[SAVED] product-listing.html');


// ═══ PRODUCT-DETAIL.HTML ═══════════════════════════════════════
let pd = fs.readFileSync(path.join(dir, 'product-detail.html'), 'utf8');

// Breadcrumb tracking
pd = pd.replace(/tracking-widest/g, 'tracking-[.14em]');
// Category overline tracking
pd = pd.replace(/tracking-\[\.3em\]/g, 'tracking-[.18em]');
// Related card category labels
pd = pd.replace(/text-\[9\.5px\] font-semibold tracking-\[\.2em\] uppercase text-muted mb-1/g,
  'text-[11px] font-semibold tracking-[.14em] uppercase text-muted mb-1');
// Trust icon color
pd = pd.replace(/material-symbols-outlined text-\[18px\] text-warm/g,
  'material-symbols-outlined text-[18px] text-gold');

fs.writeFileSync(path.join(dir, 'product-detail.html'), pd, 'utf8');
console.log('[SAVED] product-detail.html');


// ═══ CART-CHECKOUT.HTML ════════════════════════════════════════
let cc = fs.readFileSync(path.join(dir, 'cart-checkout.html'), 'utf8');

cc = cc.replace(/tracking-widest/g, 'tracking-[.14em]');

fs.writeFileSync(path.join(dir, 'cart-checkout.html'), cc, 'utf8');
console.log('[SAVED] cart-checkout.html');


// ═══ CUSTOMER-ACCOUNT.HTML ═════════════════════════════════════
let ca = fs.readFileSync(path.join(dir, 'customer-account.html'), 'utf8');

ca = ca.replace(/tracking-widest/g, 'tracking-[.14em]');
// Wishlist category labels
ca = ca.replace(/text-\[9\.5px\] font-semibold tracking-\[\.14em\] uppercase text-muted mb-1/g,
  'text-[11px] font-semibold tracking-[.14em] uppercase text-muted mb-1');
// Default address label
ca = ca.replace(/text-\[9\.5px\] font-semibold tracking-\[\.14em\] uppercase text-gold mb-2 block/g,
  'text-[11px] font-semibold tracking-[.14em] uppercase text-gold mb-2 block');

fs.writeFileSync(path.join(dir, 'customer-account.html'), ca, 'utf8');
console.log('[SAVED] customer-account.html');

console.log('\n=== ALL 5 FILES UPGRADED SUCCESSFULLY ===');

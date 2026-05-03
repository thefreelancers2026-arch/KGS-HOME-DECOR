const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

function extractElement(html, startTag, tagName) {
  const startIndex = html.indexOf(startTag);
  if (startIndex === -1) return null;
  
  let depth = 0;
  let i = startIndex;
  const openTag = `<${tagName}`;
  const closeTag = `</${tagName}>`;
  
  while (i < html.length) {
    if (html.startsWith(openTag, i)) {
      const nextChar = html[i + openTag.length];
      if (nextChar === ' ' || nextChar === '>' || nextChar === '\n') {
        depth++;
      }
    } else if (html.startsWith(closeTag, i)) {
      depth--;
      if (depth === 0) {
        return html.substring(startIndex, i + closeTag.length);
      }
    }
    i++;
  }
  return null;
}

// 1. Extract Navbar
const navHTML = extractElement(indexHtml, '<nav id="navbar"', 'nav');
// 2. Extract Search Overlay
const searchHTML = extractElement(indexHtml, '<div id="search-overlay"', 'div');
// 3. Extract Mobile Drawer
const drawerHTML = extractElement(indexHtml, '<div id="mobile-drawer"', 'div');
// 4. Extract Drawer Overlay
const drwOvHTML = extractElement(indexHtml, '<div id="drw-ov"', 'div');
// 5. Extract Footer
const footerHTML = extractElement(indexHtml, '<footer', 'footer');

const instagramHTML = `
<!-- ══ INSTAGRAM ════════════════════════════════════════════ -->
<section class="bg-base py-20 md:py-28 border-t border-border overflow-hidden">
  <div class="max-w-[90rem] mx-auto px-5 md:px-12">
    <div class="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
      <div>
        <p class="text-[10px] font-bold tracking-[.25em] uppercase text-gold mb-3">Join Our Community</p>
        <h2 class="font-serif font-medium text-ink text-3xl md:text-4xl mb-3">Follow Us on Instagram</h2>
        <p class="text-muted text-[13px] md:text-sm">Follow <a href="https://www.instagram.com/kgshomedecors" target="_blank" class="text-ink font-semibold hover:text-gold transition-colors">@kgshomedecors</a> for daily inspiration.</p>
      </div>
      <a href="https://www.instagram.com/kgshomedecors" target="_blank" class="btn-secondary whitespace-nowrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.01" stroke-width="3"/></svg>
        Follow on Instagram
      </a>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <a href="https://www.instagram.com/kgshomedecors" target="_blank" class="group relative aspect-square overflow-hidden bg-tint rounded-md block">
        <img src="assets/images/sofa.jpg" alt="Instagram 1" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <svg viewBox="0 0 24 24" fill="white" class="w-8 h-8"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </div>
      </a>
      <a href="https://www.instagram.com/kgshomedecors" target="_blank" class="group relative aspect-square overflow-hidden bg-tint rounded-md block">
        <img src="assets/images/wall_decor.jpg" alt="Instagram 2" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <svg viewBox="0 0 24 24" fill="white" class="w-8 h-8"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </div>
      </a>
      <a href="https://www.instagram.com/kgshomedecors" target="_blank" class="group relative aspect-square overflow-hidden bg-tint rounded-md block">
        <img src="assets/images/lighting.jpg" alt="Instagram 3" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <svg viewBox="0 0 24 24" fill="white" class="w-8 h-8"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </div>
      </a>
      <a href="https://www.instagram.com/kgshomedecors" target="_blank" class="group relative aspect-square overflow-hidden bg-tint rounded-md block">
        <img src="assets/images/gifts.jpg" alt="Instagram 4" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <svg viewBox="0 0 24 24" fill="white" class="w-8 h-8"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </div>
      </a>
    </div>
  </div>
</section>
`;

let content = fs.readFileSync('product-detail.html', 'utf8');

// Replace Drw Ov
const oldDrwOv = extractElement(content, '<div id="drw-ov"', 'div');
if (oldDrwOv && drwOvHTML) {
  content = content.replace(oldDrwOv, drwOvHTML);
}

// Replace Mobile Drawer
const oldDrawer = extractElement(content, '<div id="mobile-drawer"', 'div');
if (oldDrawer && drawerHTML) {
  content = content.replace(oldDrawer, drawerHTML);
}

// Replace Search Overlay
let oldSearch = extractElement(content, '<div id="search-overlay"', 'div');
if (oldSearch && searchHTML) {
  content = content.replace(oldSearch, searchHTML);
}

// Replace Navbar (product-detail uses a different class string instead of id)
const oldNav = extractElement(content, '<nav class="sticky', 'nav');
if (oldNav && navHTML) {
  content = content.replace(oldNav, navHTML);
}

// Replace Navbar if it DOES have an ID (just in case)
const oldNavId = extractElement(content, '<nav id="navbar"', 'nav');
if (oldNavId && navHTML) {
  content = content.replace(oldNavId, navHTML);
}

// Insert Instagram before Footer
const oldFooter = extractElement(content, '<footer', 'footer');
if (oldFooter && footerHTML) {
  content = content.replace(/<!-- ══ INSTAGRAM [\s\S]*?<\/section>\n/g, '');
  content = content.replace(oldFooter, instagramHTML + '\n\n' + footerHTML);
}

// Max Widths
content = content.replace(/max-w-7xl/g, 'max-w-[90rem]');
content = content.replace(/px-10/g, 'px-12');

fs.writeFileSync('product-detail.html', content);
console.log('Updated product-detail.html');

/**
 * KGS Home Décors — Playwright User Journey Audit
 * Tests every critical user flow and reports bugs.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:8000';
const BUGS = [];
const WARNINGS = [];
let consoleErrors = [];

function bug(page, msg) { BUGS.push(`[BUG] ${page}: ${msg}`); }
function warn(page, msg) { WARNINGS.push(`[WARN] ${page}: ${msg}`); }

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  // ═══════════════════════════════════════════════
  // 1. HOMEPAGE AUDIT
  // ═══════════════════════════════════════════════
  console.log('\n━━━ 1. HOMEPAGE ━━━');
  const home = await context.newPage();
  consoleErrors = [];
  home.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  home.on('pageerror', e => consoleErrors.push(e.message));

  const homeResp = await home.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  if (!homeResp || homeResp.status() >= 400) bug('Homepage', `HTTP ${homeResp?.status()}`);
  else console.log('  ✓ Homepage loaded');

  // Announcement bar
  const annBar = await home.$('.bg-ink.text-center');
  if (!annBar) bug('Homepage', 'Announcement bar missing');
  else console.log('  ✓ Announcement bar present');

  // Navbar links
  const navLinks = await home.$$('nav .hidden.md\\:flex a.nav-link');
  if (navLinks.length < 5) bug('Homepage', `Navbar only has ${navLinks.length} links (expected 6)`);
  else console.log(`  ✓ Navbar has ${navLinks.length} links`);

  // Hero section
  const hero = await home.$('#hero-slider, .hero-slide, [class*="hero"]');
  if (!hero) warn('Homepage', 'Hero section not found by selector');
  else console.log('  ✓ Hero section present');

  // Shop by Category (not "Shop by Room")
  const catHeading = await home.textContent('#collections h2');
  if (catHeading && catHeading.includes('Room')) bug('Homepage', 'Still says "Shop by Room" — should be "Shop by Category"');
  else if (catHeading && catHeading.includes('Category')) console.log('  ✓ "Shop by Category" heading correct');

  // Category bento grid images
  const catImages = await home.$$('#collections .col-tile img');
  for (let i = 0; i < catImages.length; i++) {
    const src = await catImages[i].getAttribute('src');
    const naturalWidth = await catImages[i].evaluate(el => el.naturalWidth);
    if (naturalWidth === 0) bug('Homepage', `Category image ${i} failed to load: ${src}`);
  }
  console.log(`  ✓ ${catImages.length} category images checked`);

  // Best Sellers section — wait for products
  await home.waitForTimeout(3000);
  const bestSellers = await home.$('#dynamic-best-sellers');
  if (bestSellers) {
    const bsDisplay = await bestSellers.evaluate(el => getComputedStyle(el).display);
    const bsCards = await home.$$('#dynamic-best-sellers > *');
    if (bsDisplay === 'none' || bsCards.length === 0) bug('Homepage', 'Best Sellers section empty — products not loading from Supabase');
    else console.log(`  ✓ Best Sellers: ${bsCards.length} products loaded`);
  }

  // New Arrivals
  const newArrivals = await home.$('#dynamic-new-arrivals');
  if (newArrivals) {
    const naCards = await home.$$('#dynamic-new-arrivals > *');
    if (naCards.length === 0) warn('Homepage', 'New Arrivals section empty');
    else console.log(`  ✓ New Arrivals: ${naCards.length} products loaded`);
  }

  // WhatsApp FAB
  const waFab = await home.$('#wa-float, a[aria-label*="WhatsApp"]');
  if (!waFab) warn('Homepage', 'WhatsApp FAB not found');
  else console.log('  ✓ WhatsApp FAB present');

  // Search overlay
  const searchBtn = await home.$('button[aria-label="Search"], button[onclick*="openSearch"]');
  if (searchBtn) {
    await searchBtn.click();
    await home.waitForTimeout(500);
    const overlay = await home.$('#search-overlay');
    const overlayVisible = overlay ? await overlay.evaluate(el => getComputedStyle(el).display !== 'none') : false;
    if (!overlayVisible) bug('Homepage', 'Search overlay did not open');
    else {
      console.log('  ✓ Search overlay opens');
      // Type in search
      const searchInput = await home.$('#search-input');
      if (searchInput) {
        await searchInput.type('clock', { delay: 80 });
        await home.waitForTimeout(1500);
        const results = await home.$$('#search-results a, #search-results .search-result-item');
        if (results.length === 0) warn('Homepage', 'Search returned no results for "clock"');
        else console.log(`  ✓ Search returned ${results.length} results`);
      }
      // Close search
      const closeBtn = await home.$('#search-overlay button[aria-label*="Close"], #search-overlay button[onclick*="closeSearch"]');
      if (closeBtn) await closeBtn.click();
    }
  }

  // Console errors
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => bug('Homepage', `JS Error: ${e.substring(0, 120)}`));
  } else {
    console.log('  ✓ No JS console errors');
  }

  // Footer
  const footer = await home.$('footer');
  if (!footer) bug('Homepage', 'Footer missing');
  else console.log('  ✓ Footer present');

  await home.close();

  // ═══════════════════════════════════════════════
  // 2. PRODUCT LISTING AUDIT
  // ═══════════════════════════════════════════════
  console.log('\n━━━ 2. PRODUCT LISTING ━━━');
  const listing = await context.newPage();
  consoleErrors = [];
  listing.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  listing.on('pageerror', e => consoleErrors.push(e.message));

  await listing.goto(BASE + '/product-listing.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('  ✓ Product listing loaded');

  // Wait for products to load
  await listing.waitForTimeout(3000);
  const prodGrid = await listing.$('#product-grid');
  const prodGridDisplay = prodGrid ? await prodGrid.evaluate(el => getComputedStyle(el).display) : 'none';
  const prodCards = await listing.$$('#product-grid .prod-card');
  if (prodGridDisplay === 'none' || prodCards.length === 0) {
    bug('Listing', 'Product grid is empty — no products rendered');
  } else {
    console.log(`  ✓ ${prodCards.length} products rendered`);
  }

  // Check product card structure
  if (prodCards.length > 0) {
    const firstCard = prodCards[0];
    const img = await firstCard.$('.prod-img img');
    const name = await firstCard.$('h3');
    const price = await firstCard.$('.text-warm, [class*="price"]');
    const addBtn = await firstCard.$('button[onclick*="addToCart"]');
    const waBtn = await firstCard.$('a[class*="whatsapp"]');

    if (!img) bug('Listing', 'Product card missing image');
    if (!name) bug('Listing', 'Product card missing name');
    if (!price) bug('Listing', 'Product card missing price');
    if (!addBtn) bug('Listing', 'Product card missing Add to Cart button');
    if (!waBtn) warn('Listing', 'Product card missing WhatsApp button');

    // Check image is object-contain (not cropped)
    if (img) {
      const fit = await img.evaluate(el => getComputedStyle(el).objectFit);
      if (fit !== 'contain') bug('Listing', `Product image using object-fit:${fit} instead of contain — images will be cropped`);
      else console.log('  ✓ Product images using object-contain (no cropping)');
    }

    // Click product → should navigate to product-detail.html
    const prodLink = await firstCard.$('a[href*="product-detail"]');
    if (prodLink) {
      const href = await prodLink.getAttribute('href');
      if (!href.includes('.html')) bug('Listing', `Product link missing .html: "${href}"`);
      else console.log(`  ✓ Product link correct: ${href}`);
    } else {
      bug('Listing', 'Product card has no link to product detail page');
    }
  }

  // Category filter test
  const filterBtns = await listing.$$('.filter-btn');
  console.log(`  ✓ ${filterBtns.length} category filter pills`);
  if (filterBtns.length > 1) {
    // Click "Furniture" filter
    const furnitureBtn = await listing.$('.filter-btn[data-cat="furniture"]');
    if (furnitureBtn) {
      await furnitureBtn.click();
      await listing.waitForTimeout(2000);
      const url = listing.url();
      if (!url.includes('cat=furniture')) warn('Listing', 'Furniture filter did not update URL');
      else console.log('  ✓ Category filter navigates correctly');
    }
  }

  // Sort dropdown
  const sortSelect = await listing.$('#sort-select');
  if (!sortSelect) warn('Listing', 'Sort dropdown missing');
  else console.log('  ✓ Sort dropdown present');

  // Console errors
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => bug('Listing', `JS Error: ${e.substring(0, 120)}`));
  } else {
    console.log('  ✓ No JS console errors');
  }

  await listing.close();

  // ═══════════════════════════════════════════════
  // 3. PRODUCT DETAIL AUDIT
  // ═══════════════════════════════════════════════
  console.log('\n━━━ 3. PRODUCT DETAIL ━━━');

  // First get a valid product handle
  const tempPage = await context.newPage();
  await tempPage.goto(BASE + '/product-listing.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await tempPage.waitForTimeout(3000);
  const firstLink = await tempPage.$('#product-grid a[href*="product-detail.html"]');
  let detailUrl = BASE + '/product-detail.html';
  if (firstLink) {
    const href = await firstLink.getAttribute('href');
    detailUrl = BASE + '/' + href;
  }
  await tempPage.close();

  const detail = await context.newPage();
  consoleErrors = [];
  detail.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  detail.on('pageerror', e => consoleErrors.push(e.message));

  const detailResp = await detail.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  if (!detailResp || detailResp.status() >= 400) {
    bug('Detail', `Product detail page returned HTTP ${detailResp?.status()} for ${detailUrl}`);
  } else {
    console.log(`  ✓ Product detail loaded: ${detailUrl.split('?')[1] || 'no handle'}`);
  }

  await detail.waitForTimeout(3000);

  // Product name
  const pdName = await detail.$('#pd-name');
  if (pdName) {
    const nameText = await pdName.textContent();
    if (!nameText || nameText === '...' || nameText.length < 3) bug('Detail', `Product name not loaded: "${nameText}"`);
    else console.log(`  ✓ Product name: "${nameText}"`);
  } else {
    bug('Detail', 'Product name element #pd-name missing');
  }

  // Product price
  const pdPrice = await detail.$('#pd-price');
  if (pdPrice) {
    const priceText = await pdPrice.textContent();
    if (!priceText || priceText === '...' || !priceText.includes('₹')) bug('Detail', `Price not loaded: "${priceText}"`);
    else console.log(`  ✓ Price: ${priceText}`);
  }

  // Product image
  const mainImg = await detail.$('#main-img');
  if (mainImg) {
    const src = await mainImg.getAttribute('src');
    const naturalWidth = await mainImg.evaluate(el => el.naturalWidth);
    if (!src || src === '') bug('Detail', 'Main product image has no src');
    else if (naturalWidth === 0) bug('Detail', `Main image failed to load: ${src}`);
    else console.log(`  ✓ Main image loaded (${naturalWidth}px wide)`);
  } else {
    bug('Detail', 'Main image element #main-img missing');
  }

  // CTA buttons
  const addCartBtn = await detail.$('#pd-add, #pd-add-mobile');
  if (!addCartBtn) bug('Detail', 'Add to Cart button missing');
  else console.log('  ✓ Add to Cart button present');

  const waBtn = await detail.$('#pd-wa, #pd-wa-mobile, a[class*="whatsapp"]');
  if (!waBtn) bug('Detail', 'WhatsApp order button missing');
  else console.log('  ✓ WhatsApp button present');

  // Trust badges
  const trustSection = await detail.$$('.border-t .grid-cols-2 .flex.items-center');
  if (trustSection.length < 3) warn('Detail', `Only ${trustSection.length} trust badges (expected 4)`);
  else console.log(`  ✓ ${trustSection.length} trust badges present`);

  // Tabs
  const tabs = await detail.$$('.tab-btn');
  if (tabs.length < 3) warn('Detail', `Only ${tabs.length} tabs (expected 3: Description, Specs, Delivery)`);
  else {
    console.log(`  ✓ ${tabs.length} tabs present`);
    // Test tab switching
    if (tabs.length >= 2) {
      await tabs[1].click();
      await detail.waitForTimeout(300);
      const panels = await detail.$$('.tab-panel');
      const activePanel = await detail.$('.tab-panel.active');
      if (!activePanel) warn('Detail', 'Tab switching broken — no active panel after click');
      else console.log('  ✓ Tab switching works');
    }
  }

  // Related products
  const relatedGrid = await detail.$('#related-grid');
  if (relatedGrid) {
    const relatedCards = await detail.$$('#related-grid > *');
    if (relatedCards.length === 0) warn('Detail', 'Related products section empty');
    else console.log(`  ✓ ${relatedCards.length} related products`);
  }

  // Breadcrumb
  const breadcrumb = await detail.$('nav [class*="breadcrumb"], nav .flex.items-center.gap-2');
  if (!breadcrumb) warn('Detail', 'Breadcrumb navigation missing');
  else console.log('  ✓ Breadcrumb present');

  // Navbar consistency check
  const detailNavLinks = await detail.$$('nav .hidden.md\\:flex a.nav-link');
  if (detailNavLinks.length < 5) bug('Detail', `Detail navbar only has ${detailNavLinks.length} links (should match other pages)`);
  else console.log(`  ✓ Navbar consistent: ${detailNavLinks.length} links`);

  // Font check - should be Jost not DM Sans
  const fontFamily = await detail.evaluate(() => getComputedStyle(document.body).fontFamily);
  if (fontFamily.includes('DM Sans')) bug('Detail', `Still using DM Sans font: ${fontFamily}`);
  else console.log(`  ✓ Font: ${fontFamily.substring(0, 40)}`);

  // Console errors
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => bug('Detail', `JS Error: ${e.substring(0, 120)}`));
  } else {
    console.log('  ✓ No JS console errors');
  }

  await detail.close();

  // ═══════════════════════════════════════════════
  // 4. CART FLOW AUDIT
  // ═══════════════════════════════════════════════
  console.log('\n━━━ 4. CART FLOW ━━━');
  const cart = await context.newPage();
  consoleErrors = [];
  cart.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  cart.on('pageerror', e => consoleErrors.push(e.message));

  await cart.goto(BASE + '/cart-checkout.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('  ✓ Cart page loaded');

  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => bug('Cart', `JS Error: ${e.substring(0, 120)}`));
  } else {
    console.log('  ✓ No JS console errors');
  }
  await cart.close();

  // ═══════════════════════════════════════════════
  // 5. BROKEN LINKS AUDIT (all core pages)
  // ═══════════════════════════════════════════════
  console.log('\n━━━ 5. BROKEN LINKS ━━━');
  const linkPage = await context.newPage();
  const PAGES_TO_CHECK = ['index.html', 'product-listing.html', 'about.html', 'contact.html', 'cart-checkout.html'];
  const checkedUrls = new Set();
  let brokenCount = 0;

  for (const pg of PAGES_TO_CHECK) {
    await linkPage.goto(BASE + '/' + pg, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
    const links = await linkPage.$$eval('a[href]', els => els.map(a => a.href).filter(h => h.startsWith('http')));

    for (const url of links) {
      if (checkedUrls.has(url) || url.includes('wa.me') || url.includes('tel:') || url.includes('instagram')) continue;
      checkedUrls.add(url);
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        try {
          const r = await linkPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 });
          if (r && r.status() >= 400) {
            bug('Links', `Broken: ${url} → HTTP ${r.status()} (found on ${pg})`);
            brokenCount++;
          }
        } catch (e) {
          bug('Links', `Failed: ${url} → ${e.message.substring(0, 80)} (found on ${pg})`);
          brokenCount++;
        }
      }
    }
  }
  if (brokenCount === 0) console.log(`  ✓ All ${checkedUrls.size} internal links valid`);
  else console.log(`  ✗ ${brokenCount} broken links found`);

  await linkPage.close();

  // ═══════════════════════════════════════════════
  // 6. MOBILE RESPONSIVENESS AUDIT
  // ═══════════════════════════════════════════════
  console.log('\n━━━ 6. MOBILE (375x812) ━━━');
  const mobile = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    isMobile: true, hasTouch: true
  });
  const mPage = await mobile.newPage();
  consoleErrors = [];
  mPage.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  mPage.on('pageerror', e => consoleErrors.push(e.message));

  await mPage.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('  ✓ Mobile homepage loaded');

  // Horizontal overflow check
  const hasOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (hasOverflow) bug('Mobile', 'Horizontal scroll detected — layout overflow');
  else console.log('  ✓ No horizontal overflow');

  // Mobile menu button
  const menuBtn = await mPage.$('button[aria-label="Menu"], button[onclick*="openDrw"]');
  if (menuBtn) {
    await menuBtn.click();
    await mPage.waitForTimeout(500);
    const drawer = await mPage.$('#mobile-drawer');
    if (drawer) {
      const transform = await drawer.evaluate(el => getComputedStyle(el).transform);
      if (transform === 'none' || transform.includes('matrix(1')) {
        console.log('  ✓ Mobile drawer opens');
        // Close it
        const closeBtn = await mPage.$('#mobile-drawer button[onclick*="closeDrw"]');
        if (closeBtn) await closeBtn.click();
      } else {
        bug('Mobile', 'Mobile drawer did not open visually');
      }
    }
  } else {
    bug('Mobile', 'Mobile menu button not found');
  }

  // Mobile product detail — sticky CTA
  await mPage.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await mPage.waitForTimeout(3000);
  const mobileSticky = await mPage.$('#mobile-sticky');
  if (mobileSticky) {
    const stickyDisplay = await mobileSticky.evaluate(el => getComputedStyle(el).display);
    if (stickyDisplay === 'none') warn('Mobile', 'Mobile sticky CTA bar is hidden');
    else console.log('  ✓ Mobile sticky CTA bar visible');
  } else {
    bug('Mobile', 'Mobile sticky CTA bar #mobile-sticky missing');
  }

  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => bug('Mobile', `JS Error: ${e.substring(0, 120)}`));
  } else {
    console.log('  ✓ No mobile JS errors');
  }

  await mPage.close();
  await mobile.close();

  // ═══════════════════════════════════════════════
  // REPORT
  // ═══════════════════════════════════════════════
  console.log('\n\n' + '═'.repeat(60));
  console.log('  KGS AUDIT REPORT');
  console.log('═'.repeat(60));

  if (BUGS.length === 0 && WARNINGS.length === 0) {
    console.log('\n  🎉 ZERO BUGS FOUND! Site is clean.\n');
  } else {
    if (BUGS.length > 0) {
      console.log(`\n  🔴 ${BUGS.length} BUGS:\n`);
      BUGS.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
    }
    if (WARNINGS.length > 0) {
      console.log(`\n  🟡 ${WARNINGS.length} WARNINGS:\n`);
      WARNINGS.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
    }
  }
  console.log('\n' + '═'.repeat(60) + '\n');

  await browser.close();
}

run().catch(e => { console.error('Audit failed:', e); process.exit(1); });

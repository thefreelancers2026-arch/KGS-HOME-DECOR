/* ═══════════════════════════════════════════════════════════
   KGS Home Décors — Service Worker
   Cache-first for static assets, network-first for API
═══════════════════════════════════════════════════════════ */
const CACHE_NAME = 'kgs-v9';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/product-listing.html',
  '/product-detail.html',
  '/cart-checkout.html',
  '/wishlist.html',
  '/about.html',
  '/contact.html',
  '/assets/js/store.js',
  '/assets/js/config.js',
  '/assets/js/supabase-client.js',
  '/assets/images/favicon.svg',
  '/assets/images/hero_sofa.png',
  '/manifest.json'
];

// Install — pre-cache critical assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first for API, cache-first for static
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Network-first for Supabase API calls
  if (url.hostname.includes('supabase')) {
    e.respondWith(
      fetch(e.request)
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cache new static assets on the fly
        if (response.ok && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.svg'))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});

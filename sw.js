// =============================================
// SERVICE WORKER v5.0 — Auto cache clear
// =============================================

const CACHE_NAME = 'flighthunt-v5.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/js/utils.js',
  '/js/scrapers.js',
  '/js/app.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// INSTALL — cache fresh assets
self.addEventListener('install', function(event) {
  console.log('[SW] Installing v5.0...');
  // Skip waiting forces immediate activation
  // This means new code runs straight away
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.allSettled(
        STATIC_ASSETS.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn('[SW] Could not cache:', url, err);
          });
        })
      );
    })
  );
});

// ACTIVATE — delete ALL old caches immediately
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating v5.0 — clearing old caches...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          // Delete every cache that is not current version
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(function() {
      console.log('[SW] Old caches cleared');
      // Take control of all open tabs immediately
      return self.clients.claim();
    }).then(function() {
      // Tell all open tabs to reload with new code
      return self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'SW_UPDATED', version: '5.0' });
        });
      });
    })
  );
});

// FETCH — network first, then cache
// This ensures latest code always loads
self.addEventListener('fetch', function(event) {
  var request = event.request;

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip browser extensions
  if (request.url.startsWith('chrome-extension://')) return;
  if (request.url.startsWith('moz-extension://'))    return;

  // JS files — ALWAYS fetch fresh from network
  // Never serve JS from cache (prevents stale code)
  if (request.url.includes('/js/')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(function() {
          // Offline fallback — serve from cache
          return caches.match(request);
        })
    );
    return;
  }

  // Cross-origin requests (CDN, APIs) — network only
  if (!request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(request).catch(function() {
        return caches.match(request);
      })
    );
    return;
  }

  // Everything else — network first, cache fallback
  event.respondWith(
    fetch(request, { cache: 'no-cache' })
      .then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(function() {
        return caches.match(request).then(function(cached) {
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// MESSAGE — handle reload request from app
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

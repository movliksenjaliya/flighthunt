// =============================================
// SERVICE WORKER — FlightHunt PWA
// Offline support + cache management
// =============================================

const CACHE_NAME = 'flighthunt-v4.0';
const STATIC_ASSETS  = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/scrapers.js',
  '/js/utils.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// =============================================
// INSTALL — cache static assets
// =============================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing FlightHunt Service Worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        // Cache each asset individually so one failure doesn't break all
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(err =>
              console.warn(`[SW] Failed to cache: ${url}`, err)
            )
          )
        );
      })
      .then(() => {
        console.log('[SW] Install complete');
        return self.skipWaiting();
      })
  );
});

// =============================================
// ACTIVATE — clean old caches
// =============================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activated, claiming clients');
      return self.clients.claim();
    })
  );
});

// =============================================
// FETCH — network-first for API, cache-first for assets
// =============================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip browser extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Skip cross-origin requests (booking sites, APIs)
  // These should ALWAYS go to network for fresh prices
  const isCrossOrigin = url.origin !== self.location.origin;
  if (isCrossOrigin) {
    // Network only for external APIs — don't cache flight prices
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Network unavailable' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // ---- For our own assets: Cache-first, fallback to network ----
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Serve from cache, update in background
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse;
      }

      // Not in cache — fetch from network
      return fetch(request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          // Cache the new response
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback — return cached index.html for navigation
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});

// =============================================
// PUSH NOTIFICATIONS (Price Alerts)
// =============================================

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'FlightHunt Alert', body: event.data.text() };
  }

  const options = {
    body:    data.body || 'Flight price alert!',
    icon:    '/icons/icon-192.png',
    badge:   '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' },
    actions: [
      { action: 'view',   title: '

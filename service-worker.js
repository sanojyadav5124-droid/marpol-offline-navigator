// Service Worker for offline-first PWA
// Caches app shell and allows network-first fallback to offline content

const CACHE_NAME = 'marpol-nav-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/service-worker-register.js',
  '/js/app.js',
  '/js/geo_areas.js',
  '/js/geo_engine.js',
  '/js/state.js',
  '/js/route_import.js',
  '/js/compliance.js',
  '/js/xlsx_import.js',
  '/js/rtz_import.js',
  '/js/zip_reader.js',
  '/js/simulator.js',
  '/js/report.js',
  '/js/world_map.js'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[Service Worker] Cache add error (some assets may not be available):', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and external URLs for now
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        console.log('[Service Worker] Cache hit:', request.url);
        return response;
      }
      return fetch(request).then((response) => {
        // Don't cache error responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // Cache successful responses for future offline use
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Return cached version if fetch fails
        return caches.match(request).then((response) => {
          if (response) return response;
          // Return offline fallback if available
          if (request.destination === 'document') {
            return caches.match('/');
          }
        });
      });
    })
  );
});

// Background sync for data updates when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-marpol-data') {
    console.log('[Service Worker] Background sync triggered');
    event.waitUntil(
      fetch('/api/marpol-data').then((response) => {
        if (response.ok) {
          localStorage.setItem('lastDataSync', new Date().toISOString());
          return response.json();
        }
      }).catch((err) => {
        console.log('[Service Worker] Sync failed (offline):', err);
      })
    );
  }
});

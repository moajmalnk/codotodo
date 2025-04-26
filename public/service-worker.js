const CACHE_NAME = 'codo-todo-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.chunk.css',
  '/static/js/main.chunk.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/offline.html'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  // Force waiting service worker to become active
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.error('SW install error:', err))
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
});

// Fetch Event Strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        // Clone the request for fetch and cache
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((networkResponse) => {
            // Only cache valid responses (status 200, basic type)
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== 'basic'
            ) {
              return networkResponse;
            }

            // Clone response for cache
            const responseToCache = networkResponse.clone();

            // Use waitUntil to ensure cache put completes
            event.waitUntil(
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache))
                .catch((err) => console.error('SW cache put error:', err))
            );

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
      .catch((err) => {
        console.error('SW fetch error:', err);
        // Optionally, fallback to offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
}); 
const CACHE_NAME = 'fstore-auth-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// Install: cache semua aset inti
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: buang cache lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first untuk aset lokal, network-first untuk yang lain
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    // Cache-first untuk file lokal
    e.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, copy)).catch(() => {});
          return res;
        }).catch(() => caches.match('./index.html'));
      })
    );
  }
  // Biarkan CDN/eksternal langsung ke network (Tailwind, Google Fonts)
});
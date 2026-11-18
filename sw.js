// MAISON D'OR service worker — scope-relative (works under /maison-d-or/ on GitHub Pages).
// The page document is NETWORK-FIRST so updates show on the next launch, not one launch late;
// static assets fall back to cache for offline play.
const CACHE_PREFIX = 'maison-dor-pwa-';
const CACHE_NAME = `${CACHE_PREFIX}v3`;
const SCOPE = self.registration.scope;
const CORE = [SCOPE, `${SCOPE}index.html`, `${SCOPE}manifest.webmanifest`, `${SCOPE}icon.svg`];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Navigations / the app document: network-first, cache only as offline fallback.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request, { cache: 'no-cache' });
        if (response.ok) cache.put(`${SCOPE}index.html`, response.clone());
        return response;
      } catch {
        return (await cache.match(`${SCOPE}index.html`)) || (await cache.match(SCOPE)) || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache-first, then network (and cache what we fetch).
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  })());
});

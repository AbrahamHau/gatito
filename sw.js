const CACHE = 'gatito-v1';
const FILES = ['/gatito/', '/gatito/index.html', '/gatito/manifest.json', '/gatito/icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('script.google.com') ||
      e.request.url.includes('youtube.com')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

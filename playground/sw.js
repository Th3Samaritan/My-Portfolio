/* ============================================================
   sw.js — The GYM service worker

   Cache-first strategy: serve from cache when available, falling
   back to network. On install, cache the app shell so the GYM
   works offline from the first visit.
   ============================================================ */

const CACHE = 'the-gym-v2';
const SHELL = [
  '/playground/',
  '/playground/index.html',
  '/playground/config.js',
  '/playground/manifest.json',
  '/playground/icon.svg',
  '/playground/css/app.css',
  '/playground/js/app.js',
  '/playground/js/store.js',
  '/playground/js/runner.js',
  '/playground/js/grader.js',
  '/playground/js/editor.js',
  '/playground/js/ui.js',
  '/playground/js/identity.js',
  '/playground/js/leaderboard.js',
  '/playground/js/view-learn.js',
  '/playground/js/view-challenge.js',
  '/playground/js/view-assessment.js',
  '/playground/js/view-hall.js',
  '/playground/js/views-core.js',
  '/playground/data/curriculum.js',
  '/playground/data/assessments.js',
  '/playground/data/lessons-python.js',
  '/playground/data/lessons-rust.js',
  '/playground/data/lessons-java.js',
  '/playground/data/lessons-web.js',
  '/playground/data/track-python.js',
  '/playground/data/track-rust.js',
  '/playground/data/track-java.js',
  '/playground/data/track-web.js',
];

/* ---- install: pre-cache the app shell ---- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

/* ---- activate: clean old caches ---- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ---- fetch: cache-first, then network ---- */
self.addEventListener('fetch', (event) => {
  // Only handle GET requests to our own origin
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

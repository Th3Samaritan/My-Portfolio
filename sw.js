// Define a cache name
const CACHE_NAME = 'abdulsamad-portfolio-v1';

// List all the files and assets to cache
// IMPORTANT: All paths must be absolute from the root of the domain
const URLS_TO_CACHE = [
  '/My-Portfolio/index.html',
  '/My-Portfolio/notebook.html',
  '/My-Portfolio/blog.html',
  '/My-Portfolio/assets/profile-pic.JPG',
  '/My-Portfolio/assets/cybersecurity-project.jpg',
  '/My-Portfolio/assets/software-project.jpg',
  '/My-Portfolio/assets/ml-project.jpg',
  '/My-Portfolio/assets/materials-project.jpg',
  '/My-Portfolio/assets/my-cv.pdf',
  'https://cdn.tailwindcss.com',
  'https://cdn.tailwindcss.com/3.4.1?plugins=typography',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://cdn.skypack.dev/three@0.132.2/build/three.module.js',
  'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js',
  'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf'
];

// 1. Install Event: Cache all the core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache. Caching app shell...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to cache app shell:', err);
      })
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Serve from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we found a match in the cache, return it
        if (response) {
          return response;
        }

        // Otherwise, fetch from the network
        return fetch(event.request).then(
          response => {
            // If the response is not valid, just return it
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

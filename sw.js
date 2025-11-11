// Define a cache name
const CACHE_NAME = 'abdulsamad-portfolio-v1';

// List all the files and assets to cache
// IMPORTANT: All paths must be absolute from the root of the domain
const URLS_TO_CACHE = [
  '/My-Portfolio/index.html',
  '/My-Portfolio/notebook.html',
  '/My-Portfolio/blog.html',
  '/My-Portfolio/notebook.md', // <-- ADDED THIS
  '/My-Portfolio/assets/profile-pic.JPG',
  '/My-Portfolio/assets/cybersecurity-project.jpg',
  '/My-Portfolio/assets/software-project.jpg',
  '/My-Portfolio/assets/ml-project.jpg',
  '/My-Portfolio/assets/materials-project.jpg',
  '/My-Portfolio/assets/my-cv.pdf',
  'https://cdn.tailwindcss.com',
  'https://cdn.tailwindcss.com/3.4.1?plugins=typography,forms', // <-- UPDATED (added forms)
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://cdn.skypack.dev/three@0.132.2/build/three.module.js',
  'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js',
  'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
  'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js',
  '/My-Portfolio/blog-posts/index.json',
  '/My-Portfolio/blog-posts/web-cache-vulnerability.md',
  '/My-Portfolio/blog-posts/enlightened.md',
  '/My-Portfolio/blog-posts/grit-on-cybersecurity.md',
  '/My-Portfolio/blog-posts/test-of-grit.md',
  '/My-Portfolio/blog-posts/dont-limit-yourself.md',
  '/My-Portfolio/blog-posts/searching-the-web-with-ai.md',
  '/My-Portfolio/blog-posts/gifting-back-to-the-community.md',
  '/My-Portfolio/blog-posts/first-of-many-alchemy.md'
];

// 1. Install Event: Cache all the core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        // Use addAll with caching strategy to prevent partial cache
        const cachePromises = URLS_TO_CACHE.map(urlToCache => {
          return caches.open(CACHE_NAME).then(cache => {
            return fetch(new Request(urlToCache, { cache: 'reload' })) // Fetch fresh copy
              .then(response => {
                if (!response.ok) {
                  // Don't fail the entire install if a non-critical asset (like 3D model) fails
                  console.warn(`Failed to fetch and cache ${urlToCache}: ${response.status} ${response.statusText}`);
                  return Promise.resolve(); // Continue
                }
                return cache.put(urlToCache, response);
              }).catch(err => {
                 console.warn(`Failed to fetch ${urlToCache}: ${err}`);
              });
          });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('All files cached successfully');
        return self.skipWaiting(); // Activate the new service worker immediately
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
    }).then(() => {
      return self.clients.claim(); // Take control of all open clients
    })
  );
});

// 3. Fetch Event: Serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If we have a match in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // If no match, try to fetch it from the network
        return fetch(event.request).then(
          response => {
            // Optional: If you want to cache new requests dynamically
            // Be careful with this, as it can cache API responses or other data
            // For this portfolio, explicit caching on install is safer.
            return response;
          }
        ).catch(error => {
          // Handle fetch errors (e.g., offline)
          // You could return a custom offline page here if you had one
          console.log('Fetch failed; returning offline fallback (if available)', error);
        });
      })
  );
});
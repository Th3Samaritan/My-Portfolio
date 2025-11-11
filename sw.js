// Define a cache name
const CACHE_NAME = 'abdulsamad-portfolio-v1.5'; // Incremented version

// List all the files and assets to cache
// IMPORTANT: All paths must be absolute from the root of the domain
const URLS_TO_CACHE = [
  '/My-Portfolio/index.html',
  '/My-Portfolio/notebook.html',
  '/My-Portfolio/blog.html',
  
  // NEW Notebook structure
  '/My-Portfolio/notebook-pages/index.json',
  '/My-Portfolio/notebook-pages/pentesting-checklists.md',
  '/My-Portfolio/notebook-pages/code-snippets.md',
  '/My-Portfolio/notebook-pages/my-library.md',
  '/My-Portfolio/notebook-pages/miscellany.md',
  
  '/My-Portfolio/assets/profile-pic.JPG',
  '/My-Portfolio/assets/cybersecurity-project.jpg',
  '/My-Portfolio/assets/software-project.jpg',
  '/My-Portfolio/assets/ml-project.jpg',
  '/My-Portfolio/assets/materials-project.jpg',
  '/My-Portfolio/assets/my-cv.pdf',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700;900&display=swap', // Added Merriweather font
  'https://cdn.skypack.dev/three@0.132.2/build/three.module.js',
  'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js',
  'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js',
  'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js',
  'https://cdn.tailwindcss.com/3.4.1?plugins=typography',
  
  // Blog posts
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
        console.log('Opened cache. Caching core files...');
        // We use addAll to fetch and cache all the URLs
        // If any fetch fails, the whole install fails.
        return Promise.all(
          URLS_TO_CACHE.map(url => {
            // Handle fonts that might be tricky to cache
            if (url.startsWith('https://fonts.googleapis.com')) {
                return fetch(url).then(response => {
                    if (response.ok) return cache.put(url, response);
                    return Promise.resolve(); // Don't fail install for fonts
                }).catch(err => {
                    console.warn(`Failed to cache font ${url}: ${err}`);
                });
            }
            // Cache all other files
            return cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}: ${err}`);
            });
          })
        );
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
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch Event: Serve from cache first, then network
self.addEventListener('fetch', event => {
  // Use a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        
        // If the resource is in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // We don't dynamically cache new requests here to keep the cache clean
            // Only the files in URLS_TO_CACHE are cached on install.
            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetch failed:', error, event.request.url);
          // You could return a custom offline page here if you had one
        });
      })
  );
});
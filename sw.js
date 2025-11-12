// A unique name for the cache
const CACHE_NAME = 'abdulsamad-portfolio-v1';

// All the URLs to cache for offline use
// This list MUST be updated every time you add a new file (page, image, post)
const URLS_TO_CACHE = [
    // Core Pages
    '/My-Portfolio/',
    '/My-Portfolio/index.html',
    '/My-Portfolio/blog.html',
    '/My-Portfolio/notebook.html',
    '/My-Portfolio/gallery.html',
    '/My-Portfolio/manifest.json',

    // Assets
    '/My-Portfolio/assets/profile-pic.JPG',
    '/My-Portfolio/assets/cybersecurity-project.jpg',
    '/My-Portfolio/assets/software-project.jpg',
    '/My-Portfolio/assets/ml-project.jpg',
    '/My-Portfolio/assets/materials-project.jpg',
    '/My-Portfolio/assets/my-cv.pdf',

    // Blog Files
    '/My-Portfolio/blog-posts/index.json',
    '/My-Portfolio/blog-posts/web-cache-vulnerability.md',
    '/My-Portfolio/blog-posts/enlightened.md',
    '/My-Portfolio/blog-posts/grit-on-cybersecurity.md',
    '/My-Portfolio/blog-posts/test-of-grit.md',
    '/My-Portfolio/blog-posts/dont-limit-yourself.md',
    '/My-Portfolio/blog-posts/searching-the-web-with-ai.md',
    '/My-Portfolio/blog-posts/gifting-back-to-the-community.md',
    '/My-Portfolio/blog-posts/first-of-many-alchemy.md',

    // Notebook Files
    '/My-Portfolio/notebook-pages/index.json',
    '/My-Portfolio/notebook-pages/pentesting-checklists.md',
    '/My-Portfolio/notebook-pages/code-snippets.md',
    '/My-Portfolio/notebook-pages/my-library.md',
    '/My-Portfolio/notebook-pages/miscellany.md',
    
    // Gallery Files
    '/My-Portfolio/models-data/index.json',
    // Note: 3D models themselves are NOT cached by default, as they can be very large.

    // CDNs (Scripts and Fonts)
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js',
    'https://cdn.skypack.dev/three@0.132.2/build/three.module.js',
    'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js',
    'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js'
];

// Install event: open cache and add all URLs
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache, adding all files...');
                return cache.addAll(URLS_TO_CACHE);
            })
            .catch(err => {
                console.error('Failed to open cache: ', err);
            })
    );
});

// Activate event: clean up old caches
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

// Fetch event: serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If the request is in the cache, return it
                if (response) {
                    return response;
                }
                
                // Otherwise, fetch from the network
                return fetch(event.request);
            })
    );
});
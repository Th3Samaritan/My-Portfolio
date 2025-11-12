const CACHE_NAME = 'abdulsamad-portfolio-v1';
const GITHUB_REPO_PATH = '/My-Portfolio';

// URLs to cache
const URLS_TO_CACHE = [
    // Core HTML
    `${GITHUB_REPO_PATH}/`,
    `${GITHUB_REPO_PATH}/index.html`,
    `${GITHUB_REPO_PATH}/blog.html`,
    `${GITHUB_REPO_PATH}/notebook.html`,
    `${GITHUB_REPO_PATH}/gallery.html`,
    
    // PWA Manifest
    `${GITHUB_REPO_PATH}/manifest.json`,

    // Assets
    `${GITHUB_REPO_PATH}/assets/profile-pic.JPG`,
    `${GITHUB_REPO_PATH}/assets/cybersecurity-project.jpg`,
    `${GITHUB_REPO_PATH}/assets/software-project.jpg`,
    `${GITHUB_REPO_PATH}/assets/ml-project.jpg`,
    `${GITHUB_REPO_PATH}/assets/materials-project.jpg`,
    `${GITHUB_REPO_PATH}/assets/my-cv.pdf`,

    // Blog JSON and Markdown
    `${GITHUB_REPO_PATH}/blog-posts/index.json`,
    `${GITHUB_REPO_PATH}/blog-posts/web-cache-vulnerability.md`,
    `${GITHUB_REPO_PATH}/blog-posts/enlightened.md`,
    `${GITHUB_REPO_PATH}/blog-posts/grit-on-cybersecurity.md`,
    `${GITHUB_REPO_PATH}/blog-posts/test-of-grit.md`,
    `${GITHUB_REPO_PATH}/blog-posts/dont-limit-yourself.md`,
    `${GITHUB_REPO_PATH}/blog-posts/searching-the-web-with-ai.md`,
    `${GITHUB_REPO_PATH}/blog-posts/gifting-back-to-the-community.md`,
    `${GITHUB_REPO_PATH}/blog-posts/first-of-many-alchemy.md`,

    // Notebook JSON and Markdown
    `${GITHUB_REPO_PATH}/notebook-pages/index.json`,
    `${GITHUB_REPO_PATH}/notebook-pages/pentesting-checklists.md`,
    `${GITHUB_REPO_PATH}/notebook-pages/code-snippets.md`,
    `${GITHUB_REPO_PATH}/notebook-pages/my-library.md`,
    `${GITHUB_REPO_PATH}/notebook-pages/miscellany.md`,
    
    // Gallery JSON and Models
    `${GITHUB_REPO_PATH}/models-data/index.json`,
    `${GITHUB_REPO_PATH}/models-data/drone_g-es-313-01.glb`,
    `${GITHUB_REPO_PATH}/models-data/spring.glb`,
    `${GITHUB_REPO_PATH}/models-data/aspbs.glb`,
    `${GITHUB_REPO_PATH}/models-data/servo_cover.glb`,
    `${GITHUB_REPO_PATH}/models-data/sugarcane_grinder.glb`,

    // CDNs (Fonts, Tailwind, JS Libs)
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js',
    'https://cdn.skypack.dev/three@0.132.2/build/three.module.js',
    'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js',
    'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js',
    // --- ADDED DRACO DECODER ---
    'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/DRACOLoader.js',
    'https://www.gstatic.com/draco/v1/decoders/draco_decoder.wasm',
    'https://www.gstatic.com/draco/v1/decoders/draco_decoder.js'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache:', CACHE_NAME);
                // We use addAll which will fail if any single request fails.
                // We use { mode: 'no-cors' } for CDN requests to avoid opaque responses
                // This is a simplified caching, a more robust solution would handle CDN failures gracefully.
                const cdnRequests = URLS_TO_CACHE
                    .filter(url => url.startsWith('https://'))
                    .map(url => new Request(url, { mode: 'no-cors' }));
                    
                const localRequests = URLS_TO_CACHE
                    .filter(url => !url.startsWith('https://'));

                return Promise.all([
                    cache.addAll(localRequests),
                    ...cdnRequests.map(req => cache.add(req))
                ]);
            })
            .then(() => self.skipWaiting()) // Activate the new SW immediately
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all open clients
    );
});

// Fetch event (Network first, then Cache)
// This strategy ensures users always get the freshest content if they are online.
// If they are offline, they will get the cached version.
self.addEventListener('fetch', event => {
    // For navigation requests (HTML pages), use Network First
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Check if we received a valid response
                    if (response && response.status === 200) {
                        // Clone the response and put it in the cache
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed, try to get it from the cache
                    // For navigation, this will serve the offline page
                    return caches.match(event.request)
                        .then(response => {
                            // If we have it in cache, return it.
                            // If not, fall back to a specific offline page (or just fail)
                            return response || caches.match(`${GITHUB_REPO_PATH}/index.html`);
                        });
                })
        );
        return;
    }

    // For all other requests (CSS, JS, images, models), use Cache First
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Not in cache - go to network
                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response and put it in the cache
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
const CACHE_NAME = 'abdulsamad-portfolio-v2';
const GITHUB_REPO_PATH = '/My-Portfolio';

const URLS_TO_CACHE = [
    // Core HTML
    `${GITHUB_REPO_PATH}/`,
    `${GITHUB_REPO_PATH}/index.html`,
    `${GITHUB_REPO_PATH}/blog.html`,
    `${GITHUB_REPO_PATH}/notebook.html`,
    `${GITHUB_REPO_PATH}/gallery.html`,
    `${GITHUB_REPO_PATH}/404.html`,

    // CSS & JS
    `${GITHUB_REPO_PATH}/styles.css`,
    `${GITHUB_REPO_PATH}/main.js`,

    // PWA Manifest & Favicon
    `${GITHUB_REPO_PATH}/manifest.json`,
    `${GITHUB_REPO_PATH}/assets/favicon.svg`,

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

    // Gallery JSON (models are large, cache on demand)
    `${GITHUB_REPO_PATH}/models-data/index.json`,

    // CDNs
    'https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js',
    'https://www.gstatic.com/draco/v1/decoders/draco_decoder.wasm',
    'https://www.gstatic.com/draco/v1/decoders/draco_decoder.js'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache:', CACHE_NAME);
                const cdnRequests = URLS_TO_CACHE
                    .filter(url => url.startsWith('https://'))
                    .map(url => new Request(url, { mode: 'no-cors' }));

                const localRequests = URLS_TO_CACHE
                    .filter(url => !url.startsWith('https://'));

                return Promise.all([
                    cache.addAll(localRequests),
                    ...cdnRequests.map(req => cache.add(req).catch(() => {
                        console.warn('Failed to cache CDN resource:', req.url);
                    }))
                ]);
            })
            .then(() => self.skipWaiting())
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
        }).then(() => self.clients.claim())
    );
});

// Fetch event (Network first for navigation, Cache first for assets)
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request)
                        .then(response => response || caches.match(`${GITHUB_REPO_PATH}/index.html`));
                })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) return response;

                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
                    return response;
                });
            })
    );
});
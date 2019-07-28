importScripts('/idb.js');

const idbPromise = idb.open('store', 1, (db) => {
    db.createObjectStore('')
});


const trimCache = (cacheName, maxItems) => {
    caches.open(cacheName)
        .then(cache => {
            cache.keys()
                .then(keys => {
                    if (keys.length > maxItems) {
                        cache.delete(keys[0])
                            .then(() => trimCache(cacheName, maxItems))
                    }
                })
        })
};

const STATIC_CACHE_VERSION='static-v1';
const DYNAMIC_CACHE_VERSION='dynamic-v2';
const STATIC_FILES = [
    '/favicon.ico',
    '/manifest.json',
    '/idb.js',
    '/static/js/bundle.js',
    '/static/js/0.chunk.js',
    '/static/js/main.chunk.js',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing service worker', event);
    event.waitUntil(
        caches.open(STATIC_CACHE_VERSION)
            .then((cache) => {
            console.log('[Service Worker] Precaching App Shell');
            cache.addAll(STATIC_FILES);
        })
    )
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating service worker', event);
    event.waitUntil(
      caches.keys()
          .then(keyList => {
              return Promise.all(keyList.map(key => {
                  if (key !== STATIC_CACHE_VERSION && key !== DYNAMIC_CACHE_VERSION) {
                      console.log('[Service Worker] Removing old cache', key);
                      return caches.delete(key);
                  }
                  return null;
              }))
          })
    );
    return self.clients.claim();
});

const isInArray = (str, arr) => {
    return arr.some(url => {
        return str.indexOf(url) > -1
    });
};

self.addEventListener('fetch', (event) => {
    const urls = [
        'http://localhost:8888',
        '/api',
    ];
    const fetchOnly = [
        'sockjs-node',
        'fonts.gstatic.com',
        '.map',
    ];
    let fetchOnlyMatch = fetchOnly.some(url => {
        return event.request.url.indexOf(url) > -1
    });
    if (fetchOnlyMatch) {
        event.respondWith(fetch(event.request));
        return;
    }
    let match = isInArray(event.request.url, urls);
    const staticFileUrl = isInArray(event.request.url, STATIC_FILES);
    if (staticFileUrl) {
        event.respondWith(
            caches.match(event.request)
        );
        return;
    }
    if (match) {
        event.respondWith(
            caches.open(DYNAMIC_CACHE_VERSION)
                .then((cache) => {
                    return fetch(event.request)
                        .then(response => {
                            if (event.request.method === "GET") {
                                // clone() because .put is using response object
                                cache.put(event.request.url, response.clone());
                            }

                            return response
                        })
                })
        );
        return;
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response)
                    return response;
                return fetch(event.request)
                    .then(response => {
                        return caches.open(DYNAMIC_CACHE_VERSION)
                            .then(cache => {
                                if (event.request.method === "GET") {
                                    // clone() because .put is using response object
                                    cache.put(event.request.url, response.clone());
                                }
                                return response
                            })
                    })
                    .catch(error => {
                        console.log(error);
                        // return caches.open(STATIC_CACHE_VERSION)
                        //     .then(cache => {
                        //         return cache.match('/')
                        //     })
                    })

            })
    );
});
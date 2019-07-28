importScripts('/idb.js');
importScripts('/camelize.js');

const idbPromise = idb.open('store', 1, (db) => {
    if (!db.objectStoreNames.contains('chats')) {
        db.createObjectStore('chats', {keyPath: 'id'})
    }
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

const STATIC_CACHE_VERSION='static-v0';
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
                    let resp = null;
                    return fetch(event.request)
                        .then(response => {
                            resp = response;
                            const clonedResponse = resp.clone();
                            return clonedResponse.json()
                        })
                        .then(data => {
                            resp.data = camelizeKeys(data);
                            if (event.request.method === "GET") {
                                // clone() because .put is using response object
                                cache.put(event.request.url, resp.clone());
                            }
                            return resp
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
                let resp = null;
                return fetch(event.request)
                    .then(response => {
                        resp = response;
                        const clonedResponse = resp.clone();
                        return clonedResponse.json()
                    })
                    .then(data => {
                        return caches.open(DYNAMIC_CACHE_VERSION)
                            .then(cache => {
                                resp.data = camelizeKeys(data);
                                if (event.request.method === "GET") {
                                    // clone() because .put is using response object
                                    cache.put(event.request.url, resp.clone());
                                }
                                return resp
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
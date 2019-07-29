importScripts('/idb.js');
importScripts('/camelize.js');
importScripts('/utility.js');

const STATIC_CACHE_VERSION='static-v1';
const DYNAMIC_CACHE_VERSION='dynamic-v2';
const STATIC_FILES = [
    '/favicon.ico',
    '/manifest.json',
    '/camelize.js',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing service worker', event);
    event.waitUntil(
        caches.open(STATIC_CACHE_VERSION)
            .then((cache) => {
                console.log('[Service Worker] Precaching App Shell');
                // Concat because it could not find localhost:3000 in fetch logic below
                cache.addAll(STATIC_FILES.concat(['/']));
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
        '/static',
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
                            data = camelizeKeys(data);
                            if (event.request.method === "GET") {
                                if (event.request.url.indexOf('/messages') === event.request.url.length-9) {
                                    writeData('chats', {
                                        id: 'chats',
                                        ...data
                                    });
                                    console.log('updated chats', data);
                                } else {
                                    // clone() because .put is using response object
                                    cache.put(event.request.url, resp.clone());
                                }
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
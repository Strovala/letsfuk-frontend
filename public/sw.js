// if ('function' === typeof importScripts) {
//     importScripts(
//         'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
//     );
//     /* global workbox */
//     if (workbox) {
//         console.log('Workbox is loaded');
//
//         /* injection point for manifest files.  */
//         workbox.precaching.precacheAndRoute([
//   {
//     "url": "index.html",
//     "revision": "d2a94abbbb6e9fdb54ea40f8998ed951"
//   },
//   {
//     "url": "precache-manifest.fc208bfb44074e6a30c0832a218418a9.js",
//     "revision": "fc208bfb44074e6a30c0832a218418a9"
//   },
//   {
//     "url": "service-worker.js",
//     "revision": "7f52ecdbf7d98bebe31ccad6b6756a01"
//   },
//   {
//     "url": "static/css/main.9d0a7263.chunk.css",
//     "revision": "75f92abd25be4ef7c31e6ce2de7136f7"
//   },
//   {
//     "url": "static/js/2.b0ea6e1e.chunk.js",
//     "revision": "056fe95a2d181abc34ac8276bb73fd5a"
//   },
//   {
//     "url": "static/js/main.9d5b9a70.chunk.js",
//     "revision": "18ae0a6d3131c271f096e5b9f37a0d1b"
//   },
//   {
//     "url": "static/js/runtime~main.a8a9905a.js",
//     "revision": "238c9148d722c1b6291779bd879837a1"
//   }
// ]);
//
//         /* custom cache rules*/
//         workbox.routing.registerNavigationRoute('/index.html', {
//             blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
//         });
//
//         workbox.routing.registerRoute(
//             /\.(?:png|gif|jpg|jpeg)$/,
//             workbox.strategies.cacheFirst({
//                 cacheName: 'images',
//                 plugins: [
//                     new workbox.expiration.Plugin({
//                         maxEntries: 60,
//                         maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//                     }),
//                 ],
//             })
//         );
//
//     } else {
//         console.log('Workbox could not be loaded. No Offline support');
//     }
// }
const STATIC_CACHE_VERSION='static-v0';
const DYNAMIC_CACHE_VERSION='dynamic-v1';

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing service worker', event);
    event.waitUntil(
        caches.open(STATIC_CACHE_VERSION)
            .then((cache) => {
            console.log('[Service Worker] Precaching App Shell');
            cache.addAll([
                '/',
                '/favicon.ico',
                '/manifest.json',
                '/static/js/bundle.js',
                '/static/js/0.chunk.js',
                '/static/js/0.chunk.js.map',
                '/static/js/main.chunk.js',
                'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
            ]);
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
//
// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.open(DYNAMIC_CACHE_VERSION)
//             .then((cache) => {
//                 return fetch(event.request)
//                     .then(response => {
//                         return response.json()
//                     })
//                     .then(response => {
//                         response.data = response
//                         // clone() because .put is using response object
//                         cache.put(event.request.url, response.clone());
//                         return response
//                     })
//             })
//     );
// });

self.addEventListener('fetch', (event) => {
    const urls = [
        'http://localhost:8888',
        '/api',
        'sockjs-node'
    ];
    let match = urls.some(url => {
        return event.request.url.indexOf(url) > -1
    });
    if (match) {
        event.respondWith(
            caches.open(DYNAMIC_CACHE_VERSION)
                .then((cache) => {
                    return fetch(event.request)
                        .then(response => {
                            // clone() because .put is using response object
                            cache.put(event.request.url, response.clone());
                            return response
                        })
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response)
                        return response;
                    return fetch(event.request)
                        .then(response => {
                            return caches.open(DYNAMIC_CACHE_VERSION)
                                .then(cache => {
                                    // clone() because .put is using response object
                                    cache.put(event.request.url, response.clone());
                                    return response
                                })
                        })
                        .catch(error => {
                            return caches.open(STATIC_CACHE_VERSION)
                                .then(cache => {
                                    return cache.match('/')
                                })
                        })

                })
        );
    }
});
if ('function' === typeof importScripts) {
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
    );
    /* global workbox */
    if (workbox) {
        console.log('Workbox is loaded');

        /* injection point for manifest files.  */
        workbox.precaching.precacheAndRoute([
          {
            "url": "camelize.js",
            "revision": "39c1d316b164fbb20a1c21c41013ba3b"
          },
          {
            "url": "idb.js",
            "revision": "1be734559ee6f3fcec2274321fea1286"
          },
          {
            "url": "index.html",
            "revision": "5adc4e1dd3bc2585e0dbf37a734e3918"
          },
          {
            "url": "sw.js",
            "revision": "ed88322339d91d0f1c572fdb4dac911e"
          },
          {
            "url": "utility.js",
            "revision": "f314a5008d212bcd01c523bd2b4eaca4"
          }
        ]);

        /* custom cache rules*/
        workbox.routing.registerNavigationRoute('/index.html', {
            blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
        });

        workbox.routing.registerRoute(
            /\.(?:png|gif|jpg|jpeg)$/,
            workbox.strategies.cacheFirst({
                cacheName: 'images',
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 60,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                    }),
                ],
            })
        );

    } else {
        console.log('Workbox could not be loaded. No Offline support');
    }
}
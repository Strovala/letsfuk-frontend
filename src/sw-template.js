if ('function' === typeof importScripts) {
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
    );
    importScripts('/idb.js');
    importScripts('/camelize.js');
    importScripts('/utility.js');

    /* global workbox */
    if (workbox) {
        console.log('Workbox is loaded');

        /* injection point for manifest files.  */
        workbox.precaching.precacheAndRoute([]);

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

        workbox.routing.registerRoute(
            /.*(?:googleapis|gstatic)\.com.*$/,
            workbox.strategies.staleWhileRevalidate({
                cacheName: 'google-fonts'
            })
        );

        workbox.routing.registerRoute(/.*(?:api\/messages\/?)$/, (args) => {
            return fetch(args.event.request)
                .then(response => {
                    const clonedResp = response.clone();
                    return clonedResp.json()
                        .then(data => {
                            data = camelizeKeys(data);
                            writeData('chats', Object.assign({
                                id: 'chats',
                            }, data));
                            console.log('updated chats', data);
                            return response
                        })
                })
        });

        workbox.routing.registerRoute(/.*(?:api\/messages\/).+$/, (args) => {
            return fetch(args.event.request)
                .then(response => {
                    const clonedResp = response.clone();
                    return clonedResp.json()
                        .then(data => {
                            data = camelizeKeys(data);
                            writeData('messages', Object.assign({
                                id: data.receiver.id,
                            }, data));
                            console.log('updated messages', data);
                            return response
                        })
                })
        });

        workbox.routing.registerRoute(
            /.*(?:api\/whoami\/?)$/,
            workbox.strategies.networkFirst({
                cacheName: 'whoami'
            })
        );

        workbox.routing.registerRoute(
            /.*(?:api\/users\/(.+)\/station\/?)$/,
            workbox.strategies.networkFirst({
                cacheName: 'station'
            })
        );

    } else {
        console.log('Workbox could not be loaded. No Offline support');
    }
}
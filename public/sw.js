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
    "url": "img/icons/icon_24x24.png",
    "revision": "e9c01d2a303066b7a7b2ff7c67678871"
  },
  {
    "url": "img/icons/icon_48x48.png",
    "revision": "5f8f453cf4810fb456590248a9623e56"
  },
  {
    "url": "img/icons/icon_96x96.png",
    "revision": "d8293affec8a4ab8c763f0e2c65b704b"
  },
  {
    "url": "index.html",
    "revision": "5adc4e1dd3bc2585e0dbf37a734e3918"
  },
  {
    "url": "utility.js",
    "revision": "657913ab2a72d50e43daf038ae1eff8f"
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

        workbox.routing.registerRoute(
            /.*(?:fonts.googleapis|fonts.gstatic)\.com.*$/,
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


        self.addEventListener('notificationclick', event => {
            console.log('Notification was clicked', event);
            const notification = event.notification;
            const action = event.action;

            console.log(notification);
            console.log(action);
            event.waitUntil(
                clients.matchAll()
                    .then(clis => {
                        const client = clis.find(c => (
                            c.visibilityState === 'visible'
                        ));
                        console.log('CLient', client);
                        if (client !== undefined) {
                            client.navigate('http://localhost:3000');
                            client.focus();
                        } else {
                            clients.openWindow("http://localhost:3000")
                        }
                        notification.close();
                    })
            )
        });

        self.addEventListener('notificationclose', event => {
            console.log('Notification was closed')
        });

        self.addEventListener('push', event => {
            console.log('Push Notification received', event);
            let data = {text: "...", sender: {username: "someone"}};
            if (event.data) {
                data = JSON.parse(event.data.text())
            }
            const options = {
                body: data.text,
                icon: "img/icons/icon_96x96.png",
                lang: "en-US", //BCP 47
                vibrate: [100, 50, 200],
                badge: "img/icons/icon_96x96.png",
                tag: "new-message",
                renotify: true
            };
            console.log('Push event', `You have new message from ${data.sender.username}`);
            event.waitUntil(
                self.registration.showNotification(`You have new message from ${data.sender.username}`, options)
            )
        });


    } else {
        console.log('Workbox could not be loaded. No Offline support');
    }
}

self.addEventListener("pushsubscriptionchange", event => {
    console.log('Changed push subscription', event);
});
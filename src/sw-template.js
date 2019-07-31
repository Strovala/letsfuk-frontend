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
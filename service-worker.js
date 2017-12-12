(function() {
    'use strict';

    var staticCacheName = 'pwa-demo-v1';

    var filesToCache = [
        '.',
        'styles/style.css',
        'images/favicon.ico',
        'images/offline.svg' // An offline replacement for the remote image.
    ];

    self.addEventListener('install', function(event) {
        console.log('Installing new service worker...');

        self.skipWaiting();

        event.waitUntil(
            caches.open(staticCacheName).then(function(cache) {
                return cache.addAll(filesToCache);
            })
        );
    });

    self.addEventListener('activate', function(event) {
        console.log('Activating new service worker...');

        var cacheWhitelist = [staticCacheName];

        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });

    self.addEventListener('fetch', function(event) {
        console.log('Fetching the url: ', event.request.url);

        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache.');
                    return response;
                }

                console.log('Trying to get ', event.request.url, ' from network.');

                if (event.request.url.indexOf('2017.drupalyug.ru') > -1) {
                    return fetch(event.request).catch(function (reason) {
                        console.log('Replaced ', event.request.url, ' with the offline image from cache.');
                        return caches.match('images/offline.svg');
                    });
                }

                return fetch(event.request);
            })
        );
    });

})();

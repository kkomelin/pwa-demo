(function() {
    'use strict';

    var staticCacheName = 'pwa-demo-v1';

    var filesToCache = [
        '.',
        'index.html',
        'style.css',
        'favicon.ico',
        'offline.png' // An offline replacement for the logo.
    ];

    self.addEventListener('install', function(event) {
        console.log('Installing new service worker...');

        // !!!
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
        console.log('Trying to fetch the following url: ', event.request.url);

        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache.');
                    return response;
                }

                if (event.request.url.indexOf('2017.drupalyug.ru') > -1) {
                    return fetch(event.request).catch(function (reason) {
                        console.log('Replaced ', event.request.url, ' with the offline image from cache.');
                        return caches.match('offline.png');
                    });
                }

                console.log('Network request for ', event.request.url);
                return fetch(event.request);
            })
        );
    });

})();

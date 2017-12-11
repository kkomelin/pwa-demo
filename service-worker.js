
(function() {
    'use strict';

    var cacheName = 'pwa-demo-v1';
    var offlineImageURI = 'offline.png';
    var filesToCache = [
        '.',
        'index.html',
        'style.css',
        'favicon.ico',
        offlineImageURI
    ];

    self.addEventListener('install', function(event) {
        event.waitUntil(
            caches.open(cacheName).then(function(cache) {
                return cache.addAll(filesToCache);
            })
        );
    });

    self.addEventListener('fetch', function(event) {

        console.log('Fetch event for ', event.request.url);

        var requestURL = new URL(event.request.url);

        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache.');
                    return response;
                }

                if (requestURL.hostname === '2017.drupalyug.ru') {
                    return caches.match(offlineImageURI);
                }

                console.log('Network request for ', event.request.url);
                return fetch(event.request);
            })
        );
    });

})();

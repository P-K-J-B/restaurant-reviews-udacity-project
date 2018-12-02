var cacheVersion = '1.1';
var cacheFiles = [
	'./',
	'index.html',
	'restaurant.html',
	'css/styles.css',
	'css/responsive.css',
	'data/',
	'img/',
	'js/dbhelper.js',
	'js/main.js',
	'js/restaurant_info.js',
	'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Installed');
	e.waitUntil(
		caches.open(cacheVersion).then(function(cache) {
			console.log('[ServiceWorker] Caching');
			return cache.addAll(cacheFiles);
		})
	);
});

self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activated');
	e.waitUntil(
		caches.keys().then(function(cacheVersions) {
			return Promise.all(cacheVersions.map(function(thisVersion) {
				if (thisVersion !== cacheVersion) {
					console.log(`[ServiceWorker] Changing cache version from ${thisVersion} to ${cacheVersion}`);
					return caches.delete(thisVersion);
				}
			}))
		})
	);
});

self.addEventListener('fetch', function(e) {
	//console.log('[ServiceWorker] Fetching', e.request.url);
	e.respondWith(
    caches.match(e.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(e.request);
      }
    )
  );
});
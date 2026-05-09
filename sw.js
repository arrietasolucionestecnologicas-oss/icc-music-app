const CACHE_NAME = 'icc-music-cache-v2'; // El cambio a v2 obliga al celular a borrar la memoria vieja

const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './icon-192.png',
  './icon-512.png'
];

// INSTALACIÓN Y REEMPLAZO FORZADO
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza a que el nuevo Service Worker se instale de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ACTIVACIÓN Y LIMPIEZA DE BASURA
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            // Borra cualquier caché anterior que esté causando pantalla blanca
            return caches.delete(cacheName); 
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de la página instantáneamente
  );
});

// ESTRATEGIA: NETWORK-FIRST (Primero Internet, luego Memoria)
self.addEventListener('fetch', event => {
  // Las peticiones a Google Apps Script siempre van a internet
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para la App: Intenta descargar lo más nuevo de GitHub. 
  // Si no hay internet, entonces saca la copia de seguridad de la memoria.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar y guardar la versión fresca en el caché
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Solo si falla (no hay internet), usa el caché
        return caches.match(event.request);
      })
  );
});

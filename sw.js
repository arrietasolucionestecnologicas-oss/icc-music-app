const CACHE_NAME = 'icc-music-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js?v=8.1',
  './style.css',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché instalados');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Estrategia Network-Only para la API de Google Apps Script (Datos siempre frescos)
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Estrategia Cache-First para la UI y recursos estáticos
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna del caché local si existe
        }
        
        // Si no está en caché, lo busca en la red
        return fetch(event.request).then(
          function(networkResponse) {
            // No cachear respuestas inválidas o peticiones que no sean GET
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' || event.request.method !== 'GET') {
              return networkResponse;
            }

            // Clonar la respuesta para guardarla en caché y luego retornarla
            var responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Borra cachés antiguos si se actualiza la versión
          }
        })
      );
    })
  );
});

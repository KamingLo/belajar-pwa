// public/sw.js

const CACHE_NAME = 'task-maker-cache-v1';

// Daftar file minimal agar aplikasi bisa terbuka offline
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/logo_pelita-192.png',
  '/logo_pelita-192.png',
  // Tambahkan path CSS atau JS utama jika kamu tahu namanya, 
  // tapi Next.js biasanya menangani ini secara dinamis di bagian fetch.
];

// 1. Install: Simpan aset dasar
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activate: Bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch: Strategi Offline (Stale-While-Revalidate)
self.addEventListener('fetch', (event) => {
  // Hanya proses permintaan GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          // Simpan salinan respon terbaru ke cache
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Jika offline total dan tidak ada di cache, bisa arahkan ke halaman offline khusus jika ada
        });

        // Kembalikan dari cache jika ada, jika tidak tunggu dari network
        return cachedResponse || fetchedResponse;
      });
    })
  );
});
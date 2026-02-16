// public/sw.js

const CACHE_NAME = 'task-maker-cache-v1';

// Daftar file minimal agar aplikasi bisa terbuka offline
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Tambahkan path CSS atau JS utama jika kamu tahu namanya, 
  // tapi Next.js biasanya menangani ini secara dinamis di bagian fetch.
];

// 1. Install & Cache file dasar
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 3. Strategi: Network First, then Cache (And Store to Cache)
self.addEventListener('fetch', (event) => {
  // Hanya proses request GET (halaman, gambar, js, css)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jika berhasil ambil dari internet, simpan salinannya ke cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Jika internet mati/gagal, cari di cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Jika tidak ada di cache sama sekali, tampilkan error (opsional)
        });
      })
  );
});

const CACHE_NAME = 'wa-direct-v2'; // Versi dinaikkan
const ASSETS = [
  './', // Menandakan root/index.html
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/css/intlTelInput.css',
  'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/intlTelInput.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Menggunakan map untuk menangani kegagalan satu per satu agar tidak gagal total
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => console.warn(`Gagal memuat aset: ${url}`, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate Event - Untuk menghapus cache lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Return dari cache, jika tidak ada baru ambil dari network
      return response || fetch(e.request).catch(() => {
        // Opsional: berikan fallback jika offline total dan aset tidak ada di cache
      });
    })
  );
});

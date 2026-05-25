const CACHE = "meihua-v2";
const URLS = [
    "./index.html",
    "./yijing_data.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(URLS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;
    e.respondWith(
        caches.match(e.request).then(
            (cached) => cached || fetch(e.request).then((resp) => {
                if (resp.ok) {
                    const clone = resp.clone();
                    caches.open(CACHE).then((cache) => {
                        cache.put(e.request, clone);
                    });
                }
                return resp;
            }).catch(() => cached)
        )
    );
});

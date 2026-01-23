const PRECACHE = "sanctuary-precache-v5";
const RUNTIME = "sanctuary-runtime-v5";

const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  "/",
  OFFLINE_URL,
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if (self.registration?.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) =>
          k === PRECACHE || k === RUNTIME ? null : caches.delete(k),
        ),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only same-origin
  if (url.origin !== self.location.origin) return;

  // Never cache API routes (user-specific by nature)
  if (url.pathname.startsWith("/api/")) return;

  // Next.js App Router: avoid caching RSC/Flight responses
  const accept = req.headers.get("accept") || "";
  const isRsc =
    req.headers.get("RSC") === "1" ||
    accept.includes("text/x-component") ||
    url.searchParams.has("_rsc");

  if (isRsc) return;

  // Treat all navigations as network-first with offline fallback.
  // IMPORTANT: Do NOT cache the navigation response (avoids caching user-specific HTML).
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          return preload || (await fetch(req));
        } catch {
          const cache = await caches.open(PRECACHE);
          return (
            (await cache.match(OFFLINE_URL)) ||
            (await cache.match("/")) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  // Only cache "safe" static assets.
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === OFFLINE_URL;

  const isNextImage = url.pathname.startsWith("/_next/image");

  // Extra guard: never cache potential HTML
  const looksLikeHtml = accept.includes("text/html");

  // Static assets + Next Image: stale-while-revalidate
  if ((isStaticAsset || isNextImage) && !looksLikeHtml) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME);
        const cached = await cache.match(req);

        const fetchPromise = fetch(req)
          .then((res) => {
            // Cache only successful basic/cors responses
            if (
              res &&
              (res.type === "basic" || res.type === "cors") &&
              res.ok
            ) {
              // Respect server no-store/private if present
              const cc = res.headers.get("cache-control") || "";
              if (!/\bno-store\b/i.test(cc) && !/\bprivate\b/i.test(cc)) {
                cache.put(req, res.clone());
              }
            }
            return res;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })(),
    );
    return;
  }

  // Everything else: network-only (avoids caching JSON/data/user pages by accident)
  // This is the key “avoid user-specific caching” rule.
  return;
});

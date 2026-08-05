// Offline fallback for exchange-rate data. Scoped narrowly to
// api.frankfurter.dev — this is not a full offline-first PWA (no app
// shell precaching, no manifest/install prompt), just a network-first,
// cache-fallback layer for the one external API this app depends on.
//
// Strategy per request:
//   1. Try the network.
//   2. On success: cache the response, tag it "live", return it.
//   3. On failure (offline) or a 5xx: fall back to whatever's cached for
//      this exact URL, tag it "stale", return it — UNLESS the cached
//      entry is older than MAX_STALE_AGE_MS, in which case let the
//      original failure propagate instead of showing possibly-misleading
//      old data.
//
// The app reads the X-Fx-Cache-Status header on the response (see
// services/http-client.ts) to know whether it's looking at live or
// stale data, and X-Fx-Cached-At to show "synced X ago".

const CACHE_NAME = "fx-checker-rates-v1";
const RATES_HOST = "api.frankfurter.dev";
const MAX_STALE_AGE_MS = 1000 * 60 * 60 * 24; // 24 hours

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(
            (key) => key.startsWith("fx-checker-rates-") && key !== CACHE_NAME,
          )
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.hostname !== RATES_HOST) {
    return; // not ours — let the browser handle it as usual
  }

  event.respondWith(handleRatesRequest(event.request));
});

async function handleRatesRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const tagged = tagResponse(networkResponse, "live", Date.now());
      await cache.put(request, tagged.clone());
      return tagged;
    }

    if (networkResponse.status >= 500) {
      const fallback = await readCacheIfFresh(cache, request);
      if (fallback) return fallback;
    }

    return networkResponse;
  } catch {
    const fallback = await readCacheIfFresh(cache, request);
    if (fallback) return fallback;
    throw new Error(
      "Network unavailable and no usable cached data for this request.",
    );
  }
}

async function readCacheIfFresh(cache, request) {
  const cached = await cache.match(request);
  if (!cached) return null;

  const cachedAt = Number(cached.headers.get("X-Fx-Cached-At"));
  const age = Date.now() - cachedAt;

  if (Number.isNaN(cachedAt) || age > MAX_STALE_AGE_MS) return null;

  return tagResponse(cached, "stale", cachedAt);
}

// Clones the response with two extra headers: X-Fx-Cache-Status (what
// the app reads to decide whether to show the offline banner) and
// X-Fx-Cached-At (when this body was actually fetched — read back on
// the next request to enforce MAX_STALE_AGE_MS, and re-sent to the app
// so the banner can show "synced X ago" using the real fetch time, not
// whenever it happens to be re-served).
function tagResponse(response, status, cachedAt) {
  const headers = new Headers(response.headers);
  headers.set("X-Fx-Cache-Status", status);
  headers.set("X-Fx-Cached-At", String(cachedAt));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

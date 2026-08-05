"use client";

import * as React from "react";

/**
 * Renders nothing — registers the offline-rates service worker once, on
 * mount (see public/sw.js). Its scope covers the whole origin regardless
 * of which page happens to mount this first, so a single registration
 * per session is enough.
 */
const ServiceWorkerRegistration = () => {
  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration can fail in perfectly ordinary situations (Safari
      // private browsing, some corporate proxies) — the app already
      // works fully without it, just without the offline rates
      // fallback, so there's nothing actionable to surface here.
    });
  }, []);

  return null;
};

ServiceWorkerRegistration.displayName = "ServiceWorkerRegistration";

export default ServiceWorkerRegistration;

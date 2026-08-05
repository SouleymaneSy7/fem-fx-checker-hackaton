import axios from "axios";

import { HTTP_TIMEOUT_MS } from "@/constants";
import { env } from "@/env";
import { useOfflineStore } from "@/store";

export const httpClient = axios.create({
  baseURL: env.NEXT_PUBLIC_EXCHANGE_API_BASE, // https://api.frankfurter.dev/v2
  timeout: HTTP_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => {
    // Set by public/sw.js when it served this response — "live" means
    // the network actually answered just now, "stale" means the service
    // worker fell back to its cache. Read here rather than per-hook so
    // every caller of httpClient benefits without its own logic.
    const cacheStatus = response.headers["x-fx-cache-status"];

    if (cacheStatus === "stale") {
      useOfflineStore.getState().markStale();
    } else if (cacheStatus === "live") {
      useOfflineStore.getState().markFresh();
    }

    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Network request failed";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

"use client";

import { SWRConfig } from "swr";

import { SWR_RETRY_COUNT, SWR_RETRY_INTERVAL_MS } from "@/constants";
import type { SWRProviderPropsType } from "@/types/ui.types";

export function SWRProvider({ children }: SWRProviderPropsType) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: SWR_RETRY_COUNT,
        errorRetryInterval: SWR_RETRY_INTERVAL_MS,
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error("[SWR] error:", error);
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

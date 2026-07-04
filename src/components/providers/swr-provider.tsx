"use client";

import { SWRConfig } from "swr";

type SWRProviderPropsType = {
  children: React.ReactNode;
};

export function SWRProvider({ children }: SWRProviderPropsType) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
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

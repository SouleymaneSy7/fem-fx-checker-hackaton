"use client";

import * as React from "react";

// `useLayoutEffect` warns when it runs on the server (no DOM to measure
// against there). This is only ever needed in the browser — here, to
// hydrate the converter store from the URL before the first paint — so it
// falls back to `useEffect` during SSR and resolves to the real thing once
// this module runs on the client.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

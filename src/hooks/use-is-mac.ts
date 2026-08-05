"use client";

import * as React from "react";

/**
 * `navigator.platform` only exists once mounted on the client. Starting at
 * `false` keeps the server render and the first client paint identical
 * (both show "Ctrl"/"Alt") — no hydration mismatch — then flips to the Mac
 * symbols right after mount if applicable.
 *
 */

type NavigatorWithUAData = Navigator & {
  userAgentData?: { platform?: string };
};

export const useIsMac = () => {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    const nav = navigator as NavigatorWithUAData;
    const platform = nav.userAgentData?.platform ?? nav.userAgent;

    setIsMac(/Mac|iPhone|iPad|iPod/.test(platform));
  }, []);

  return isMac;
};

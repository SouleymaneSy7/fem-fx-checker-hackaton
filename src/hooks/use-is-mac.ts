import * as React from "react";

/**
 * `navigator.platform` only exists once mounted on the client. Starting at
 * `false` keeps the server render and the first client paint identical
 * (both show "Ctrl"/"Alt") — no hydration mismatch — then flips to the Mac
 * symbols right after mount if applicable.
 *
 */

const userAgentData = navigator as Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

export const useIsMac = () => {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    const platform =
      userAgentData.userAgentData?.platform ?? navigator.userAgent;

    setIsMac(/Mac|iPhone|iPad|iPod/.test(platform));
  }, []);

  return isMac;
};

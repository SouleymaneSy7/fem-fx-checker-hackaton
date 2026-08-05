"use client";

import * as React from "react";

import { XIcon } from "@/components/icons";
import { useOfflineStore } from "@/store";
import { formatRelativeTime } from "@/utils";

const OfflineBanner = () => {
  const isStale = useOfflineStore((state) => state.isStale);
  const lastFreshAt = useOfflineStore((state) => state.lastFreshAt);

  const [isDismissed, setIsDismissed] = React.useState(false);

  // Re-arms the banner for a fresh offline episode even after an earlier
  // one was dismissed — going stale again after having recovered is
  // worth surfacing again, not silenced forever by one past dismissal.
  const wasStaleRef = React.useRef(isStale);
  React.useEffect(() => {
    if (isStale && !wasStaleRef.current) setIsDismissed(false);
    wasStaleRef.current = isStale;
  }, [isStale]);

  if (!isStale || isDismissed) return null;

  return (
    // biome-ignore lint/a11y/useSemanticElements: <div role="status"> is the standard React pattern for accessible live regions — <output> is semantically wrong for loading state
    <div
      role="status"
      className="flex items-center justify-center gap-step-150 border-destructive/30 border-b bg-destructive/10 px-step-200 py-step-100"
    >
      <p className="preset-6 text-destructive uppercase">
        You're offline — showing the last rates we could reach
        {lastFreshAt &&
          ` (synced ${formatRelativeTime(new Date(lastFreshAt).toISOString())})`}
        .
      </p>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss offline notice"
        className="focus-ring rounded-sm text-destructive"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
};

export default OfflineBanner;

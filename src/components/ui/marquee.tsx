"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { MarqueePropsType } from "@/types";

const MIN_REPEAT_COUNT = 2;

function Marquee({
  className,
  ...delegatedProps
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      {...delegatedProps}
    />
  );
}

function MarqueeHeader({
  className,
  ...delegatedProps
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-0 bottom-0 left-0 z-10 flex items-center gap-step-100 bg-primary px-step-200 py-step-150",
        className,
      )}
      {...delegatedProps}
    />
  );
}

function MarqueeTitle({
  className,
  ...delegatedProps
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("preset-5-med text-neutral-900 uppercase", className)}
      {...delegatedProps}
    />
  );
}

function MarqueeContent({
  children,
  gap = 0,
  duration = 30,
  pauseOnHover = true,
  className,
}: MarqueePropsType) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = React.useState(MIN_REPEAT_COUNT);

  React.useLayoutEffect(() => {
    const trackEl = trackRef.current;
    const viewportEl = trackEl?.parentElement;
    if (!trackEl || !viewportEl) return;

    const recalculate = () => {
      setRepeatCount((current) => {
        const oneSetWidth = trackEl.scrollWidth / current;
        if (!oneSetWidth) return current;

        const needed = Math.ceil(viewportEl.clientWidth / oneSetWidth) + 1;
        const nextCount = Math.max(MIN_REPEAT_COUNT, needed);

        return nextCount === current ? current : nextCount;
      });
    };

    recalculate();

    const resizeObserver = new ResizeObserver(recalculate);
    resizeObserver.observe(viewportEl);
    resizeObserver.observe(trackEl);

    return () => resizeObserver.disconnect();
  }, []);

  // A stable, append-only pool: index N keeps the same key forever once
  // assigned. repeatCount shrinking/growing back and forth (e.g. during a
  // window resize drag) no longer hands out fresh UUIDs for copies that
  // already existed, so React doesn't tear down and remount them.
  const keysRef = React.useRef<string[]>([]);

  const copyKeys = React.useMemo(() => {
    while (keysRef.current.length < repeatCount) {
      keysRef.current.push(crypto.randomUUID());
    }
    return keysRef.current.slice(0, repeatCount);
  }, [repeatCount]);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className={cn(
        "flex w-max animate-marquee-scroll motion-reduce:animate-none",
        pauseOnHover && "hover:paused",
        className,
      )}
      style={
        {
          gap: `${gap}px`,
          "--marquee-duration": `${duration}s`,
          "--marquee-distance": `-${100 / repeatCount}%`,
        } as React.CSSProperties
      }
    >
      {copyKeys.map((copyKey) => (
        <React.Fragment key={copyKey}>{children}</React.Fragment>
      ))}
    </div>
  );
}

Marquee.displayName = "Marquee";
MarqueeHeader.displayName = "MarqueeHeader";
MarqueeTitle.displayName = "MarqueeTitle";
MarqueeContent.displayName = "MarqueeContent";

export { Marquee, MarqueeContent, MarqueeHeader, MarqueeTitle };

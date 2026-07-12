"use client";

import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TruncateTooltipPropsType } from "@/types/ui.types";

/**
 * Wraps a single line of text that may be cut off by Tailwind's
 * `truncate` and only renders a tooltip with the full value once the
 * text is actually clipped (`scrollWidth > clientWidth`) — a currency
 * name that already fits never gets a redundant tooltip.
 *
 * The tree shape (Tooltip > Trigger > span) never changes between the
 * truncated/not-truncated states — only whether `TooltipContent` is
 * rendered — so the `span` never unmounts/remounts and the
 * ResizeObserver below keeps watching the same node across re-renders.
 */
const TruncateTooltip = ({
  children,
  content,
  className,
  side,
}: TruncateTooltipPropsType) => {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  React.useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const checkTruncation = () => {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };

    checkTruncation();

    const resizeObserver = new ResizeObserver(checkTruncation);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span ref={textRef} className={cn("truncate", className)}>
          {children}
        </span>
      </TooltipTrigger>

      {isTruncated && (
        <TooltipContent side={side}>{content ?? children}</TooltipContent>
      )}
    </Tooltip>
  );
};

TruncateTooltip.displayName = "TruncateTooltip";

export default TruncateTooltip;

"use client";

import * as React from "react";
import { toast } from "sonner";

import { CheckIcon, ShareIcon } from "@/components/icons";
import { SHORTCUT_EVENTS } from "@/constants";
import type { ShareButtonPropsType } from "@/types";
import { buildConverterSearchParams } from "@/utils";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "../ui";

const COPIED_RESET_MS = 2000;

const ShareButton = ({
  fromCurrency,
  toCurrency,
  amount,
  disabled,
  className,
}: ShareButtonPropsType) => {
  const [isCopied, setIsCopied] = React.useState(false);

  // Built straight from the store's current values rather than
  // `window.location.href` — the URL bar itself is debounced by
  // ConverterUrlSync, so reading it here could grab a stale query string.
  const buildShareUrl = () => {
    const params = buildConverterSearchParams({
      from: fromCurrency,
      to: toCurrency,
      amount,
    });

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  // Prefers the native share sheet where available (mostly mobile
  // browsers) and falls back to a clipboard copy everywhere else — same
  // pattern as most "share" buttons across the web.
  const handleShare = async () => {
    const url = buildShareUrl();
    const shareData = {
      title: "FX Checker",
      text: `1 ${fromCurrency} to ${toCurrency} — check the live rate on FX Checker.`,
      url,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch {
        // AbortError when the user dismisses the native share sheet — not
        // an actual failure, so no fallback or error toast is needed.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      toast.success("Link copied to your clipboard.");
      setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    } catch {
      toast.error(
        "Couldn't copy the link — copy it from the address bar instead.",
      );
    }
  };

  // Keyboard shortcut (S, see constants/shortcut-registry.ts).
  // `handleShare` is read through a ref rather than listed as a
  // dependency: it's a new closure on every render (it closes over
  // `fromCurrency`/`toCurrency`/`amount`, which change on every keystroke
  // in the amount field), so depending on it directly would tear down and
  // re-add the window listener far more often than necessary.
  const handleShareRef = React.useRef(handleShare);
  handleShareRef.current = handleShare;

  React.useEffect(() => {
    const handleShareShortcut = () => {
      if (!disabled) handleShareRef.current();
    };

    window.addEventListener(
      SHORTCUT_EVENTS.shareActivePair,
      handleShareShortcut,
    );
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.shareActivePair,
        handleShareShortcut,
      );
  }, [disabled]);

  const label = `Share: ${fromCurrency} to ${toCurrency}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={"default"}
          aria-label={label}
          disabled={disabled}
          onClick={handleShare}
          className={className}
        >
          {isCopied ? (
            <CheckIcon className="text-foreground" />
          ) : (
            <ShareIcon className="text-foreground" />
          )}
          {isCopied ? "Copied" : "Share"}
        </Button>
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default ShareButton;

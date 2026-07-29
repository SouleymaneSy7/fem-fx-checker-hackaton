"use client";

import * as React from "react";
import { RANGE_BY_CODE, SHORTCUT_EVENTS } from "@/constants";
import type { FocusCurrencySearchDetail, SetRateRangeDetail } from "@/types";

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
};

export function useKeyboardShortcuts() {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = (event.ctrlKey || event.metaKey) && !event.altKey;

      if (isCtrlOrCmd && event.code === "KeyK") {
        event.preventDefault();

        window.dispatchEvent(
          new CustomEvent<FocusCurrencySearchDetail>(
            SHORTCUT_EVENTS.focusCurrencySearch,
            { detail: { target: "send" } },
          ),
        );
        return;
      }

      if (isCtrlOrCmd && event.code === "KeyS") {
        event.preventDefault();

        window.dispatchEvent(new CustomEvent(SHORTCUT_EVENTS.swapCurrencies));
        return;
      }

      const isRangeCombo = event.altKey && !event.ctrlKey && !event.metaKey;
      const range = isRangeCombo ? RANGE_BY_CODE[event.code] : undefined;

      if (range) {
        event.preventDefault();

        window.dispatchEvent(
          new CustomEvent<SetRateRangeDetail>(SHORTCUT_EVENTS.setRateRange, {
            detail: { range },
          }),
        );
        return;
      }

      if (event.key === "?" && !isTypingTarget(event.target)) {
        event.preventDefault();

        window.dispatchEvent(
          new CustomEvent(SHORTCUT_EVENTS.toggleShortcutsHelp),
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

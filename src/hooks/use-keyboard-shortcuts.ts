"use client";

import * as React from "react";

import { SHORTCUT_REGISTRY } from "@/constants";
import type { ShortcutMatcherType, ShortcutModifiersType } from "@/types";

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

const matchesModifiers = (
  event: KeyboardEvent,
  modifiers: ShortcutModifiersType | undefined,
): boolean => {
  const wantsMod = modifiers?.mod ?? false;
  const wantsAlt = modifiers?.alt ?? false;
  const wantsShift = modifiers?.shift ?? false;

  return (
    (event.ctrlKey || event.metaKey) === wantsMod &&
    event.altKey === wantsAlt &&
    event.shiftKey === wantsShift
  );
};

// `code`-based matchers check the exact modifier state (so e.g. Ctrl+K
// doesn't also fire on Ctrl+Shift+K) and are meant for modifier combos,
// where the PHYSICAL key position is what matters (same convention as
// the browser's own Ctrl+1...9 tab shortcuts).
//
// `key`-based matchers are for bare, no-modifier mnemonic shortcuts (F,
// 1...6, ?) and match the CHARACTER actually produced — case-insensitive,
// and deliberately NOT re-checking Shift, since `.key` already reflects
// whatever the active layout + Shift state produced. Re-checking Shift
// here is exactly what made these unreachable on AZERTY, where typing a
// digit always needs Shift and letters like A/Q sit on swapped physical
// keys vs QWERTY. Ctrl/Alt/Meta ARE still checked so an unrelated
// OS/browser combo that happens to produce the same character (e.g.
// Ctrl+F for the browser's Find) can't misfire a bare shortcut.
const matchesShortcut = (
  event: KeyboardEvent,
  matcher: ShortcutMatcherType,
): boolean => {
  if (matcher.code) {
    if (event.code !== matcher.code) return false;
    if (!matchesModifiers(event, matcher.modifiers)) return false;
  } else if (matcher.key) {
    if (event.key.toLowerCase() !== matcher.key.toLowerCase()) return false;
    if (event.ctrlKey || event.metaKey || event.altKey) return false;
  } else {
    return false;
  }

  if (matcher.requireNotTyping && isTypingTarget(event.target)) return false;

  return true;
};

// Finds the first registry group with a matching matcher for this event
// and dispatches its CustomEvent — using that matcher's own `buildDetail`
// so a "family" (e.g. the 6 history-range keys) can share one group but
// send a different payload per key. Stops at the first match so two
// shortcuts can never both fire off a single keydown.
const tryDispatchShortcut = (event: KeyboardEvent): void => {
  for (const group of SHORTCUT_REGISTRY) {
    for (const matcher of group.matchers) {
      if (!matchesShortcut(event, matcher)) continue;

      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent(group.eventName, {
          detail: matcher.buildDetail?.(event),
        }),
      );
      return;
    }
  }
};

export function useKeyboardShortcuts() {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      tryDispatchShortcut(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

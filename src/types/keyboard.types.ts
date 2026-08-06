import type { ConverterSectionValueType } from "./converter.types";
import type { RateRangeType } from "./rate.types";

export type FocusCurrencySearchDetail = { target: "send" | "receive" };
export type SetRateRangeDetail = { range: RateRangeType };
export type SwitchTabDetail = { section: ConverterSectionValueType };

/* ── Shortcut registry ────────────────────────────────────────────────
 * Single declarative source of truth for every keyboard shortcut — see
 * constants/shortcut-registry.ts for the actual list. The hook
 * (use-keyboard-shortcuts.ts) matches KeyboardEvents against these
 * definitions and dispatches `eventName`; the help panel
 * (shortcuts-help.tsx) renders the very same list, so a new shortcut
 * only ever needs to be added in one place.
 * ─────────────────────────────────────────────────────────────────── */

// Abstract, platform-independent modifier flags. "mod" means Ctrl on
// Windows/Linux and Cmd on Mac — both are treated as interchangeable,
// same as the previous ad-hoc `isCtrlOrCmd` check.
export type ShortcutModifiersType = {
  mod?: boolean;
  alt?: boolean;
  shift?: boolean;
};

// Exactly one of `code`/`key` per matcher — pick based on what the
// shortcut actually needs:
// - `code` (KeyboardEvent.code): the PHYSICAL key position, unaffected by
//   layout or Shift. Use this for modifier combos (Ctrl+K, Alt+1...6):
//   apps conventionally teach "hold the modifier, hit the key in that
//   position" regardless of what character it types — the same reason
//   browsers' own Ctrl+1...9 tab shortcuts work identically on any layout.
// - `key` (KeyboardEvent.key): the CHARACTER actually produced, already
//   accounting for layout + Shift. Use this for bare, no-modifier
//   mnemonic shortcuts (F, 1...6, ?): on AZERTY, typing a digit requires
//   Shift and A/Q are swapped vs QWERTY, so a `code`-based, implicit
//   no-Shift match is simply unreachable there — `key` sidesteps that
//   entirely by matching the character the person actually typed.
export type ShortcutMatcherType = (
  | { code: string; key?: never }
  | { key: string; code?: never }
) & {
  modifiers?: ShortcutModifiersType;
  // Bare keys (no modifier) must not fire while the user is typing in a
  // field — modifier combos (Ctrl/Alt+...) are safe either way, matching
  // the previous behavior of Ctrl+K / Ctrl+S / Alt+1...6.
  requireNotTyping?: boolean;
  buildDetail?: (event: KeyboardEvent) => unknown;
};

// `third` covers 3-segment combos (e.g. Ctrl+Shift+K) — optional since
// almost every shortcut only ever needs two.
export type ShortcutDisplayKeysType =
  | string[]
  | { first: string; second: string; third?: string };

export type ShortcutGroupType = {
  id: string;
  label: string;
  // Precise usage scope, shown as secondary text under the label in the
  // help panel. Several shortcuts only work while a specific tab is
  // mounted (Radix Tabs unmounts inactive TabsContent, so their window
  // listener isn't even registered anywhere else) — this makes that
  // explicit instead of leaving it to guesswork.
  description: string;
  eventName: string;
  // 1 matcher for a simple shortcut, several for a "family" that shares
  // one help-panel row but dispatches a different detail per key (e.g.
  // the 6 history-range keys, or the 6 tab-switch keys).
  matchers: ShortcutMatcherType[];
  displayKeys: ShortcutDisplayKeysType;
};

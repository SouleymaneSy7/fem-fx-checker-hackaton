import type {
  ConverterSectionValueType,
  FocusCurrencySearchDetail,
  SetRateRangeDetail,
  ShortcutGroupType,
  SwitchTabDetail,
} from "@/types";
import { RANGE_BY_KEY } from "./ranges";
import { SHORTCUT_EVENTS } from "./shortcuts";

// Resolved to the platform-specific symbol (⌘/Ctrl, ⌥/Alt) by
// shortcuts-help.tsx at render time via useIsMac() — kept as an
// abstract token here since this file has no access to that hook.
export const MOD_KEY_TOKEN = "$mod";
export const ALT_KEY_TOKEN = "$alt";

// Mirrors the tab order in components/layout/tab-nav.tsx's `SECTIONS` —
// kept as its own small map (rather than importing SECTIONS, which also
// carries display labels this registry doesn't need) so this file has no
// dependency on a specific tab UI component. Keep both in sync if the
// tab order ever changes. Alt+digit is a modifier combo, so it stays
// `code`-based like Ctrl+K/Ctrl+S — see the ShortcutMatcherType comment
// in types/keyboard.types.ts for why.
const TAB_SECTION_BY_CODE: Record<string, ConverterSectionValueType> = {
  Digit1: "history",
  Digit2: "compare",
  Digit3: "historicalRates",
  Digit4: "favorites",
  Digit5: "alerts",
  Digit6: "log",
};

// Single declarative source of truth for every keyboard shortcut in the
// app. use-keyboard-shortcuts.ts matches KeyboardEvents against these
// definitions and dispatches `eventName` as a window CustomEvent;
// shortcuts-help.tsx renders this very same list. Adding a new shortcut
// only ever means adding one entry here — no other file needs to change
// to make it both functional and documented.
export const SHORTCUT_REGISTRY: ShortcutGroupType[] = [
  {
    id: "focus-send-search",
    label: "Open the currency search for Send",
    description: "Available everywhere",
    eventName: SHORTCUT_EVENTS.focusCurrencySearch,
    matchers: [
      {
        code: "KeyK",
        modifiers: { mod: true },
        buildDetail: (): FocusCurrencySearchDetail => ({ target: "send" }),
      },
    ],
    displayKeys: { first: MOD_KEY_TOKEN, second: "K" },
  },
  {
    id: "focus-receive-search",
    label: "Open the currency search for Receive",
    description: "Available everywhere",
    eventName: SHORTCUT_EVENTS.focusCurrencySearch,
    matchers: [
      {
        // Ctrl/Cmd+R alone is out (page reload) and Ctrl/Cmd+Shift+R is
        // also taken (hard refresh) — reusing K with an extra Shift
        // pairs naturally with Send's own Ctrl/Cmd+K instead.
        code: "KeyK",
        modifiers: { mod: true, shift: true },
        buildDetail: (): FocusCurrencySearchDetail => ({
          target: "receive",
        }),
      },
    ],
    displayKeys: { first: MOD_KEY_TOKEN, second: "Shift", third: "K" },
  },
  {
    id: "focus-amount-input",
    label: "Jump to the Send amount field",
    description: "Available everywhere",
    eventName: SHORTCUT_EVENTS.focusAmountInput,
    matchers: [{ key: "/", requireNotTyping: true }],
    displayKeys: ["/"],
  },
  {
    id: "swap-currencies",
    label: "Swap the Send and Receive currencies",
    description: "Available everywhere",
    eventName: SHORTCUT_EVENTS.swapCurrencies,
    matchers: [{ code: "KeyS", modifiers: { mod: true } }],
    displayKeys: { first: MOD_KEY_TOKEN, second: "S" },
  },
  {
    id: "favorite-active-pair",
    label: "Pin the pair you're converting",
    description: "Adds or removes it from Favorites",
    eventName: SHORTCUT_EVENTS.favoriteActivePair,
    matchers: [{ key: "f", requireNotTyping: true }],
    displayKeys: ["F"],
  },
  {
    id: "log-active-pair",
    label: "Save this conversion to your log",
    description: "Adds or removes it from your Log",
    eventName: SHORTCUT_EVENTS.logActivePair,
    matchers: [{ key: "l", requireNotTyping: true }],
    displayKeys: ["L"],
  },
  {
    id: "open-alert-popover",
    label: "Set a rate alert on this pair",
    description: "Opens the alert popover",
    eventName: SHORTCUT_EVENTS.openAlertPopover,
    matchers: [{ key: "a", requireNotTyping: true }],
    displayKeys: ["A"],
  },
  {
    id: "share-active-pair",
    label: "Share the pair you're converting",
    description: "Copies a link or opens the native share sheet",
    eventName: SHORTCUT_EVENTS.shareActivePair,
    matchers: [{ key: "s", requireNotTyping: true }],
    displayKeys: ["S"],
  },
  {
    id: "copy-rate",
    label: "Copy the current rate",
    description: "Copies the rate number on its own",
    eventName: SHORTCUT_EVENTS.copyRate,
    matchers: [{ key: "c", requireNotTyping: true }],
    displayKeys: ["C"],
  },
  {
    id: "toggle-theme",
    label: "Switch between light and dark mode",
    description: "Available everywhere",
    eventName: SHORTCUT_EVENTS.toggleTheme,
    matchers: [{ key: "t", requireNotTyping: true }],
    displayKeys: ["T"],
  },
  {
    id: "toggle-compare-view",
    label: "Switch between table and chart",
    description: "Compare tab only",
    eventName: SHORTCUT_EVENTS.toggleCompareView,
    matchers: [{ key: "v", requireNotTyping: true }],
    displayKeys: ["V"],
  },
  {
    id: "open-compare-currency-picker",
    label: "Add a currency to compare",
    description: "Compare tab only",
    eventName: SHORTCUT_EVENTS.openCompareCurrencyPicker,
    matchers: [{ key: "n", requireNotTyping: true }],
    displayKeys: ["N"],
  },
  {
    id: "export-log-csv",
    label: "Export your log as CSV",
    description: "Log tab only",
    eventName: SHORTCUT_EVENTS.exportLogCsv,
    matchers: [{ key: "e", requireNotTyping: true }],
    displayKeys: ["E"],
  },
  {
    id: "switch-tab",
    label: "Jump to a tab",
    description:
      "1 - History, 2 - Compare, 3 - Historical Rates, 4 - Favorites, 5 - Alerts, 6 - Log",
    eventName: SHORTCUT_EVENTS.switchTab,
    matchers: Object.entries(TAB_SECTION_BY_CODE).map(([code, section]) => ({
      code,
      modifiers: { alt: true },
      buildDetail: (): SwitchTabDetail => ({ section }),
    })),
    displayKeys: { first: ALT_KEY_TOKEN, second: "1...6" },
  },
  {
    id: "set-rate-range",
    label: "Change the chart's time range",
    description: "Historical Rates chart: 1 through 6 = 1D, 1W, 1M, 3M, 1Y, 5Y",
    eventName: SHORTCUT_EVENTS.setRateRange,
    matchers: Object.entries(RANGE_BY_KEY).map(([key, range]) => ({
      key,
      requireNotTyping: true,
      buildDetail: (): SetRateRangeDetail => ({ range }),
    })),
    displayKeys: ["1...6"],
  },
  {
    id: "toggle-shortcuts-help",
    label: "Show or hide this panel",
    description: "Available everywhere",
    eventName: SHORTCUT_EVENTS.toggleShortcutsHelp,
    matchers: [{ key: "?", requireNotTyping: true }],
    displayKeys: ["?"],
  },
];

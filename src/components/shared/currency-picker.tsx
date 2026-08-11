"use client";

import * as React from "react";

import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  SearchIcon,
  XIcon,
} from "@/components/icons";
import { POPULAR_CURRENCIES, SHORTCUT_EVENTS } from "@/constants";
import { useIsMac, useRecentPairMutations } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  CurrencyOptionType,
  CurrencyPickerPropsType,
  FocusCurrencySearchDetail,
  RecentPairType,
  SelectRecentPairDetail,
} from "@/types";
import { List, Title, VisuallyHidden } from "../common";
import {
  Badge,
  buttonVariants,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Skeleton,
  Spinner,
} from "../ui";
import { CurrencyFlag } from "./currency-flag";
import SearchInput from "./search-input";

const CurrencyPicker = ({
  value,
  onValueChange,
  currencies,
  popularCodes = POPULAR_CURRENCIES,
  recentPairs = [],
  label,
  className,
  isLoading,
  focusShortcutTarget,
}: CurrencyPickerPropsType) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const { removeRecentPair } = useRecentPairMutations();

  const selected = currencies.find((currency) => currency.code === value);

  const filtered = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return currencies;

    return currencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(normalizedQuery) ||
        currency.name.toLowerCase().includes(normalizedQuery),
    );
  }, [currencies, query]);

  const popular = filtered.filter((currency) =>
    popularCodes.includes(currency.code),
  );

  const others = filtered.filter(
    (currency) => !popularCodes.includes(currency.code),
  );

  const handleSelect = (code: string) => {
    onValueChange(code);
    setOpen(false);
    setQuery("");
  };

  // Applies a full from→to pair in one click — dispatched as a window
  // event (like swapCurrencies) rather than a prop callback, since both
  // the Send and Receive pickers need to trigger the same cross-field
  // update without either one holding a reference to the other's setter.
  const handleSelectRecentPair = (pair: RecentPairType) => {
    setOpen(false);
    setQuery("");

    window.dispatchEvent(
      new CustomEvent<SelectRecentPairDetail>(
        SHORTCUT_EVENTS.selectRecentPair,
        {
          detail: {
            fromCurrency: pair.fromCurrency,
            toCurrency: pair.toCurrency,
          },
        },
      ),
    );
  };

  // "Ctrl/Cmd+K" (Send) or "Ctrl/Cmd+Shift+K" (Receive) shortcut → open
  // this picker if it's the target one. Radix's Popover already
  // auto-focuses the first focusable element (the search input) as soon
  // as the content mounts, so no manual ref/focus call is needed here.
  React.useEffect(() => {
    if (!focusShortcutTarget) return;

    const handleFocusSearch = (event: Event) => {
      const detail = (event as CustomEvent<FocusCurrencySearchDetail>).detail;
      if (detail?.target === focusShortcutTarget) setOpen(true);
    };

    window.addEventListener(
      SHORTCUT_EVENTS.focusCurrencySearch,
      handleFocusSearch,
    );
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.focusCurrencySearch,
        handleFocusSearch,
      );
  }, [focusShortcutTarget]);

  const isMac = useIsMac();
  const modKey = isMac ? "⌘" : "Ctrl";

  // Only Send and Receive pass focusShortcutTarget — any other
  // CurrencyPicker instance simply renders no shortcut hint.
  const shortcutKeys =
    focusShortcutTarget === "send"
      ? { firstKey: modKey, secondKey: "K" }
      : focusShortcutTarget === "receive"
        ? { firstKey: modKey, secondKey: "Shift", thirdKey: "K" }
        : undefined;

  const shortcutAriaKeys =
    focusShortcutTarget === "send"
      ? "Control+K Meta+K"
      : focusShortcutTarget === "receive"
        ? "Control+Shift+K Meta+Shift+K"
        : undefined;

  const renderOption = (currency: CurrencyOptionType) => {
    const isSelected = currency.code === value;

    return (
      <li>
        <button
          type="button"
          role="option"
          aria-selected={isSelected}
          onClick={() => handleSelect(currency.code)}
          className={cn(
            "preset-4 flex w-full cursor-pointer items-center gap-step-150 rounded-sm border border-transparent px-step-100 py-step-150 text-left transition-colors",
            "hover:border-muted-foreground",
          )}
        >
          <CurrencyFlag currencyCode={currency.code} isLoading={isLoading} />

          <span className="preset-4 shrink-0 text-foreground">
            {currency.code ?? "---"}
          </span>

          <span className="preset-5 min-w-0 flex-1 truncate text-muted-foreground">
            {currency.name ?? "---"}
          </span>

          {isSelected && <CheckIcon className="text-foreground" />}
        </button>
      </li>
    );
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setQuery("");
      }}
    >
      <PopoverTrigger
        type="button"
        aria-label={label}
        aria-keyshortcuts={shortcutAriaKeys}
        className={cn(buttonVariants({ variant: "popover" }), className)}
      >
        <CurrencyFlag
          currencyCode={selected?.code ?? ""}
          isLoading={isLoading}
          size={20}
        />

        {isLoading ? (
          <Skeleton className="h-4 w-7 bg-neutral-400" />
        ) : (
          <span className="preset-4 text-neutral-50 uppercase">
            {selected?.code ?? "---"}
          </span>
        )}

        <ChevronDownIcon
          size={12}
          className={cn(
            "text-neutral-50 transition-transform",
            open && "rotate-180",
          )}
        />
      </PopoverTrigger>

      {/* PopoverContent is now the flex column: fixed total height, the
          search bar keeps its natural height at the top, ScrollArea
          (flex-1 min-h-0) fills whatever's left and is the only part
          that scrolls. Width lives here too (310px/376px per Figma). */}
      <PopoverContent className="flex h-115 w-77.5 flex-col gap-step-125 p-step-100 md:w-94">
        <SearchInput
          icon={SearchIcon}
          keys={shortcutKeys}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search currencies..."
          aria-label="Search currencies"
        />

        <ScrollArea className="min-h-0 w-full flex-1">
          {recentPairs.length > 0 && !query && (
            <div className="space-y-step-050 pb-step-050">
              <div className="flex w-full items-center justify-between gap-step-150 border-border border-b p-step-100">
                <Title
                  level="h4"
                  className="preset-5 text-neutral-200 uppercase"
                >
                  Recent
                </Title>

                <Badge variant={"muted"}>{recentPairs.length}</Badge>
              </div>

              <List
                as="div"
                items={recentPairs}
                keyExtractor={(pair) => pair.id}
                className="flex flex-wrap gap-step-075 px-step-100 py-step-075"
                renderItem={(pair) => (
                  <div
                    className={cn(
                      "flex items-center gap-step-025 rounded-full border border-neutral-500 bg-neutral-600 py-step-050 pr-step-050 pl-step-125 transition-colors",
                      "hover:border-neutral-400 hover:bg-neutral-500",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectRecentPair(pair)}
                      aria-label={`Switch to ${pair.fromCurrency} to ${pair.toCurrency}`}
                      className="preset-5 focus-ring flex cursor-pointer items-center gap-step-075 rounded-full text-foreground uppercase"
                    >
                      <span>{pair.fromCurrency}</span>
                      <ArrowRightIcon size={10} className="text-neutral-200" />
                      <span>{pair.toCurrency}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeRecentPair(pair.id)}
                      aria-label={`Remove recent pair: ${pair.fromCurrency} to ${pair.toCurrency}`}
                      className="focus-ring flex cursor-pointer items-center justify-center rounded-full p-step-075 text-neutral-200 transition-colors hover:bg-neutral-400 hover:text-foreground"
                    >
                      <XIcon size={10} />
                    </button>
                  </div>
                )}
              />
            </div>
          )}

          {/* `w-0 min-w-full`, not `w-full`: Radix's ScrollArea Viewport
              wraps children in an internal `display: table; min-width:
              100%` div we can't style directly (see scroll-area.tsx). A
              plain block child lets that table grow to fit its widest
              un-wrapped content — e.g. a long currency name under
              `truncate` — because a `width:auto` block reports its
              content's size upward. `width:0` stops that reporting;
              `min-width:100%` still stretches it to fill the space that's
              actually available. */}
          <div role="listbox" aria-label={label} className="w-0 min-w-full">
            <VisuallyHidden aria-live="polite">
              {isLoading
                ? "Loading currencies"
                : `${filtered.length} currencies found`}
            </VisuallyHidden>

            {popular.length > 0 && (
              <div className="space-y-step-050 pb-step-050">
                <div className="flex w-full items-center justify-between gap-step-150 border-border border-b p-step-100">
                  <Title
                    level="h4"
                    className="preset-5 text-neutral-200 uppercase"
                  >
                    Popular
                  </Title>

                  <Badge variant={"muted"}>{popular.length}</Badge>
                </div>

                <List
                  aria-label="Popular"
                  items={popular}
                  keyExtractor={(currency) => currency.code}
                  renderItem={renderOption}
                />
              </div>
            )}

            {others.length > 0 && (
              <div className="space-y-step-050">
                <div className="flex w-full items-center justify-between gap-step-150 border-border border-b p-step-100">
                  <Title
                    level="h4"
                    className="preset-5 text-neutral-200 uppercase"
                  >
                    {popular.length > 0 ? "Other currencies" : "Currencies"}
                  </Title>

                  <Badge variant={"muted"}>{others.length}</Badge>
                </div>

                <List
                  aria-label="Other currencies"
                  items={others}
                  keyExtractor={(currency) => currency.code}
                  renderItem={renderOption}
                />
              </div>
            )}

            {filtered.length === 0 &&
              (isLoading ? (
                <div className="flex items-center justify-center gap-step-100 px-step-150 py-step-200">
                  <Spinner aria-hidden="true" className="text-neutral-200" />
                  <p className="preset-5 text-neutral-200">
                    Loading currencies...
                  </p>
                </div>
              ) : (
                <p className="preset-5 px-step-150 py-step-200 text-center text-neutral-200">
                  No currency matches "{query}".
                </p>
              ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencyPicker;

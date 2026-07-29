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

  // "Ctrl+K" / "Cmd+K" shortcut → open this picker if it's the target one.
  // Radix's Popover already auto-focuses the first focusable element (the
  // search input) as soon as the content mounts, so no manual ref/focus
  // call is needed here.
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
  const keyboards = { firstKey: modKey, secondKey: "K" };

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
            "w-full cursor-pointer border border-transparent flex items-center gap-step-150 rounded-sm px-step-100 py-step-150 text-left preset-4 transition-colors",
            "hover:border-muted-foreground",
          )}
        >
          <CurrencyFlag currencyCode={currency.code} isLoading={isLoading} />

          <span className="flex-1 md:flex-none preset-4 text-foreground">
            {currency.code}
          </span>

          <span className="hidden md:inline flex-1 preset-5 text-muted-foreground truncate">
            {currency.name}
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
        aria-keyshortcuts={
          focusShortcutTarget === "send" ? "Control+K Meta+K" : undefined
        }
        className={cn(buttonVariants({ variant: "popover" }), className)}
      >
        <CurrencyFlag
          currencyCode={selected?.code ?? ""}
          isLoading={isLoading}
          size={20}
        />

        {isLoading ? (
          <Skeleton className="w-7 h-4 bg-neutral-400" />
        ) : (
          <span className="preset-4 uppercase text-neutral-50">
            {selected?.code ?? "———"}
          </span>
        )}

        <ChevronDownIcon
          size={12}
          className={cn(
            "transition-transform text-neutral-50",
            open && "rotate-180",
          )}
        />
      </PopoverTrigger>

      <PopoverContent>
        <ScrollArea className="h-115 w-78 md:w-114 flex-col gap-step-125 p-step-100">
          <SearchInput
            icon={SearchIcon}
            keys={focusShortcutTarget === "send" ? keyboards : undefined}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search currencies..."
            aria-label="Search currencies"
          />

          {recentPairs.length > 0 && !query && (
            <div className="space-y-step-050 pb-step-050">
              <div className="p-step-100 flex items-center justify-between gap-step-150 w-full border-b border-border">
                <Title
                  level="h4"
                  className="preset-5 uppercase text-neutral-200"
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
                      "flex items-center gap-step-025 rounded-full border border-neutral-500 bg-neutral-600 py-step-050 pl-step-125 pr-step-050 transition-colors",
                      "hover:border-neutral-400 hover:bg-neutral-500",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectRecentPair(pair)}
                      aria-label={`Switch to ${pair.fromCurrency} to ${pair.toCurrency}`}
                      className="flex items-center gap-step-075 preset-5 uppercase text-foreground cursor-pointer focus-ring rounded-full"
                    >
                      <span>{pair.fromCurrency}</span>
                      <ArrowRightIcon size={10} className="text-neutral-200" />
                      <span>{pair.toCurrency}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeRecentPair(pair.id)}
                      aria-label={`Remove recent pair: ${pair.fromCurrency} to ${pair.toCurrency}`}
                      className="flex items-center justify-center rounded-full p-step-075 text-neutral-200 transition-colors cursor-pointer hover:bg-neutral-400 hover:text-foreground focus-ring"
                    >
                      <XIcon size={10} />
                    </button>
                  </div>
                )}
              />
            </div>
          )}

          <div role="listbox" aria-label={label} className="w-full">
            <VisuallyHidden aria-live="polite">
              {isLoading
                ? "Loading currencies"
                : `${filtered.length} currencies found`}
            </VisuallyHidden>

            {popular.length > 0 && (
              <div className="space-y-step-050 pb-step-050">
                <div className="p-step-100 flex items-center justify-between gap-step-150 w-full border-b border-border">
                  <Title
                    level="h4"
                    className="preset-5 uppercase text-neutral-200"
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
                <div className="p-step-100 flex items-center justify-between gap-step-150 w-full border-b border-border">
                  <Title
                    level="h4"
                    className="preset-5 uppercase text-neutral-200"
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
                <p className="px-step-150 py-step-200 text-center preset-5 text-neutral-200">
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

"use client";

import * as React from "react";

import List from "@/components/common/list";
import Title from "@/components/common/title";
import VisuallyHidden from "@/components/common/visually-hidden";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import SearchInput from "@/components/shared/search-input";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SHORTCUT_EVENTS } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import type {
  CurrencyOptionType,
  CurrencyPickerPropsType,
  FocusCurrencySearchDetail,
} from "@/types/data.types";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { CurrencyFlag } from "./currency-flag";

const DEFAULT_POPULAR_CODES = ["USD", "EUR", "GBP"];

const CurrencyPicker = ({
  value,
  onValueChange,
  currencies,
  popularCodes = DEFAULT_POPULAR_CODES,
  label,
  className,
  focusShortcutTarget,
}: CurrencyPickerPropsType) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

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
          <CurrencyFlag currencyCode={currency.code} />

          <span className="preset-4 text-foreground">{currency.code}</span>

          <span className="flex-1 preset-5 text-muted-foreground truncate">
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
        <CurrencyFlag currencyCode={selected?.code ?? ""} />

        <span className="preset-4 uppercase text-neutral-50">
          {selected?.code ?? "——"}
        </span>

        <ChevronDownIcon
          size={12}
          className={cn(
            "transition-transform text-neutral-50",
            open && "rotate-180",
          )}
        />
      </PopoverTrigger>

      <PopoverContent className="w-full">
        <ScrollArea className="max-h-115 flex flex-col gap-step-125 w-94 p-step-100">
          <SearchInput
            icon={SearchIcon}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search currencies..."
            aria-label="Search currencies"
          />

          <div role="listbox" aria-label={label}>
            <VisuallyHidden aria-live="polite">
              {filtered.length} currencies found
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

            {filtered.length === 0 && (
              <p className="px-step-150 py-step-200 text-center preset-5 text-neutral-200">
                No currency matches “{query}”.
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencyPicker;

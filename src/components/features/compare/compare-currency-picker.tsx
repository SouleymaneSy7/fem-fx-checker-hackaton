"use client";

import * as React from "react";

import { List, VisuallyHidden } from "@/components/common";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { CurrencyFlag, SearchInput } from "@/components/shared";
import {
  buttonVariants,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { SHORTCUT_EVENTS } from "@/constants";
import { cn } from "@/lib/utils";
import type { CompareCurrencyPickerPropsType } from "@/types";

const CompareCurrencyPicker = ({
  currencies,
  onSelect,
  isLoading,
  disabled,
  disabledLabel,
  openShortcut,
  className,
}: CompareCurrencyPickerPropsType) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return currencies;

    return currencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(normalizedQuery) ||
        currency.name.toLowerCase().includes(normalizedQuery),
    );
  }, [currencies, query]);

  const handleSelect = (code: string) => {
    onSelect(code);
    setOpen(false);
    setQuery("");
  };

  // Keyboard shortcut (N, see constants/shortcut-registry.ts). ComparePanel
  // sets `openShortcut` on both the table and chart instance, but Radix
  // Tabs only ever mounts one of the two at a time (whichever view is
  // active), so only one listener ends up registered — no extra routing
  // needed to target "whichever picker is currently visible".
  React.useEffect(() => {
    if (!openShortcut) return;

    const handleOpenShortcut = () => {
      if (!disabled) setOpen(true);
    };

    window.addEventListener(
      SHORTCUT_EVENTS.openCompareCurrencyPicker,
      handleOpenShortcut,
    );
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.openCompareCurrencyPicker,
        handleOpenShortcut,
      );
  }, [openShortcut, disabled]);

  const triggerLabel = disabled
    ? (disabledLabel ?? "Add a currency to compare")
    : "Add a currency to compare";

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (disabled) return;
        setOpen(nextOpen);
        if (!nextOpen) setQuery("");
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(disabled && "cursor-not-allowed")}>
            <PopoverTrigger
              type="button"
              aria-label={triggerLabel}
              aria-keyshortcuts={openShortcut ? "N" : undefined}
              disabled={disabled}
              className={cn(
                buttonVariants({ variant: "secondary", size: "icon" }),
                className,
              )}
            >
              <PlusIcon className="text-foreground" />
            </PopoverTrigger>
          </span>
        </TooltipTrigger>

        <TooltipContent>{triggerLabel}</TooltipContent>
      </Tooltip>

      {/* PopoverContent is now the flex column: fixed total height, the
          search bar keeps its natural height at the top, ScrollArea
          (flex-1 min-h-0) fills whatever's left and is the only part
          that scrolls. Width lives here too (310px/376px per Figma). */}
      <PopoverContent className="flex h-90 w-77.5 flex-col gap-step-125 p-step-100 md:w-94">
        <SearchInput
          icon={SearchIcon}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search currencies..."
          aria-label="Search currencies to add"
        />

        <ScrollArea className="min-h-0 w-full flex-1">
          {/* `w-0 min-w-full`, not `w-full`: Radix's ScrollArea Viewport
              wraps children in an internal `display: table; min-width:
              100%` div we can't style directly (see scroll-area.tsx). A
              plain block child lets that table grow to fit its widest
              un-wrapped content — e.g. a long currency name under
              `truncate` — because a `width:auto` block reports its
              content's size upward. `width:0` stops that reporting;
              `min-width:100%` still stretches it to fill the space
              that's actually available. */}
          <div
            role="listbox"
            aria-label="Add a currency"
            className="w-0 min-w-full"
          >
            <VisuallyHidden aria-live="polite">
              {isLoading
                ? "Loading currencies"
                : `${filtered.length} currencies found`}
            </VisuallyHidden>

            <List
              items={filtered}
              keyExtractor={(currency) => currency.code}
              renderItem={(currency) => (
                <li>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => handleSelect(currency.code)}
                    className={cn(
                      "preset-4 flex w-full cursor-pointer items-center gap-step-150 rounded-sm border border-transparent px-step-100 py-step-150 text-left transition-colors",
                      "hover:border-muted-foreground",
                    )}
                  >
                    <CurrencyFlag
                      currencyCode={currency.code}
                      isLoading={isLoading}
                    />

                    <span className="preset-4 shrink-0 text-foreground">
                      {currency.code}
                    </span>

                    <span className="preset-5 min-w-0 flex-1 truncate text-muted-foreground">
                      {currency.name}
                    </span>
                  </button>
                </li>
              )}
            />

            {filtered.length === 0 && (
              <p className="preset-5 px-step-150 py-step-200 text-center text-neutral-200">
                {query
                  ? `No currency matches "${query}".`
                  : "You've added every available currency."}
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CompareCurrencyPicker;

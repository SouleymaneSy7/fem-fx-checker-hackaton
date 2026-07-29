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
import { cn } from "@/lib/utils";
import type { CompareCurrencyPickerPropsType } from "@/types";

const CompareCurrencyPicker = ({
  currencies,
  onSelect,
  isLoading,
  disabled,
  disabledLabel,
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

      <PopoverContent>
        <ScrollArea className="h-90 flex-col gap-step-125 p-step-100">
          <SearchInput
            icon={SearchIcon}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search currencies..."
            aria-label="Search currencies to add"
          />

          <div role="listbox" aria-label="Add a currency" className="w-full">
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

                    <span className="preset-4 flex-1 text-foreground md:flex-none">
                      {currency.code}
                    </span>

                    <span className="preset-5 hidden flex-1 truncate text-muted-foreground md:inline">
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

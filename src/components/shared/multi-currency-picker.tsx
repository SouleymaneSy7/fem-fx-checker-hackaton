"use client";

import * as React from "react";

import { List, VisuallyHidden } from "@/components/common";
import { PlusIcon, SearchIcon } from "@/components/icons";
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
import type { MultiCurrencyPickerPropsType } from "@/types";
import { CurrencyFlag } from "./currency-flag";
import SearchInput from "./search-input";

// Generic "selected set of currencies, editable via chips + an add
// trigger" control — the shared shape behind the ticker, compare table,
// and compare chart currency lists in Settings > Preferences. Same
// pattern as CompareCurrencyPicker + CompareChartCurrencyChips combined,
// generalized over a plain string[] instead of a specific store.
const MultiCurrencyPicker = ({
  selected,
  onChange,
  currencies,
  maxSelected,
  label = "Add a currency",
  className,
}: MultiCurrencyPickerPropsType) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const isFull = maxSelected !== undefined && selected.length >= maxSelected;

  const disabledLabel =
    maxSelected !== undefined
      ? `Full (${selected.length}/${maxSelected}) — remove one to add another`
      : "";

  const addable = React.useMemo(
    () => currencies.filter((currency) => !selected.includes(currency.code)),
    [currencies, selected],
  );

  const filtered = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return addable;

    return addable.filter(
      (currency) =>
        currency.code.toLowerCase().includes(normalizedQuery) ||
        currency.name.toLowerCase().includes(normalizedQuery),
    );
  }, [addable, query]);

  const handleAdd = (code: string) => {
    onChange([...selected, code]);
    setOpen(false);
    setQuery("");
  };

  const handleRemove = (code: string) => {
    onChange(selected.filter((current) => current !== code));
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-step-075", className)}>
      <List
        as="div"
        items={selected}
        keyExtractor={(code) => code}
        className="flex flex-wrap gap-step-075"
        renderItem={(code) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleRemove(code)}
                aria-label={`Remove ${code}`}
                className="group preset-5 focus-ring flex cursor-pointer items-center gap-step-075 rounded-full border border-neutral-500 bg-neutral-600 py-step-075 pr-step-075 pl-step-100 text-foreground uppercase transition-colors hover:border-destructive/40 hover:bg-destructive/10"
              >
                <CurrencyFlag currencyCode={code} size={16} />
                <span>{code}</span>
                <span
                  aria-hidden="true"
                  className="preset-4 text-neutral-200 leading-none transition-colors group-hover:text-destructive"
                >
                  ×
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Remove {code}</TooltipContent>
          </Tooltip>
        )}
      />

      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (isFull) return;
          setOpen(nextOpen);
          if (!nextOpen) setQuery("");
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(isFull && "cursor-not-allowed")}>
              <PopoverTrigger
                type="button"
                aria-label={isFull ? disabledLabel : label}
                disabled={isFull}
                className={buttonVariants({
                  variant: "secondary",
                  size: "icon",
                })}
              >
                <PlusIcon className="text-foreground" />
              </PopoverTrigger>
            </span>
          </TooltipTrigger>
          <TooltipContent>{isFull ? disabledLabel : label}</TooltipContent>
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

            <div role="listbox" aria-label={label} className="w-full">
              <VisuallyHidden aria-live="polite">
                {`${filtered.length} currencies found`}
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
                      onClick={() => handleAdd(currency.code)}
                      className={cn(
                        "preset-4 flex w-full cursor-pointer items-center gap-step-150 rounded-sm border border-transparent px-step-100 py-step-150 text-left transition-colors",
                        "hover:border-muted-foreground",
                      )}
                    >
                      <CurrencyFlag currencyCode={currency.code} />
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
    </div>
  );
};

MultiCurrencyPicker.displayName = "MultiCurrencyPicker";

export default MultiCurrencyPicker;

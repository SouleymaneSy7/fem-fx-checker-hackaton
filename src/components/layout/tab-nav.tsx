"use client";

import * as React from "react";

import List from "@/components/common/list";
import { ChevronDown2Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites-store";
import { useLogStore } from "@/store/log-store";

export type ConverterSectionValueType =
  | "history"
  | "compare"
  | "favorites"
  | "log";

type TabNavPropsType = {
  value: ConverterSectionValueType;
  onValueChange: (value: ConverterSectionValueType) => void;
  favoritesCount?: number;
  logCount?: number;
};

const SECTIONS: { value: ConverterSectionValueType; label: string }[] = [
  { value: "history", label: "History" },
  { value: "compare", label: "Compare" },
  { value: "favorites", label: "Favorites" },
  { value: "log", label: "Log" },
];

const TabNav = ({ value, onValueChange }: TabNavPropsType) => {
  const [open, setOpen] = React.useState(false);

  const favoritesCount = useFavoritesStore((state) => state.favorites.length);
  const logCount = useLogStore((state) => state.entries.length);

  const countByValue: Partial<Record<ConverterSectionValueType, number>> = {
    favorites: favoritesCount,
    log: logCount,
  };

  const activeSection =
    SECTIONS.find((section) => section.value === value) ?? SECTIONS[0];
  const activeCount = countByValue[activeSection.value];

  const handleSelect = (nextValue: ConverterSectionValueType) => {
    onValueChange(nextValue);
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* Desktop / tablet — horizontal tabs */}
      <TabsList aria-label="Converter sections" className="hidden md:flex">
        {SECTIONS.map((section) => {
          const count = countByValue[section.value];

          return (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
              {count !== undefined && <Badge>{count}</Badge>}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Mobile — collapses into a dropdown */}
      <div className="md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            type="button"
            aria-label={`Converter sections: ${activeSection.label}`}
            className={cn(
              "flex w-full h-10 items-center justify-between gap-step-150 rounded-md border border-neutral-400 bg-card px-step-150",
              "preset-3 uppercase text-foreground transition-colors",
              "hover:border-neutral-500 hover:bg-neutral-500 focus-ring",
            )}
          >
            <span className="flex items-center gap-step-100">
              {activeSection.label}
              {activeCount !== undefined && <Badge>{activeCount}</Badge>}
            </span>

            <ChevronDown2Icon
              size={16}
              className={cn(
                "text-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </PopoverTrigger>

          <PopoverContent className="w-(--radix-popover-trigger-width) rounded-10 border-neutral-500 dark:border-neutral-600 bg-card p-step-100">
            <div role="listbox" aria-label="Converter sections">
              <List
                items={SECTIONS}
                keyExtractor={(section) => section.value}
                renderItem={(section) => {
                  const isActive = section.value === value;
                  const count = countByValue[section.value];

                  return (
                    <li>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelect(section.value)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between gap-step-150 rounded-sm border border-transparent px-step-100 py-step-125 text-left preset-3 uppercase transition-colors",
                          isActive ? "text-foreground" : "text-neutral-200",
                          "hover:border-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span>{section.label}</span>
                        {count !== undefined && <Badge>{count}</Badge>}
                      </button>
                    </li>
                  );
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </React.Fragment>
  );
};

export default TabNav;

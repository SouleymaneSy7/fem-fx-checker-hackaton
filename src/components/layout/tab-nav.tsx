"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { List } from "@/components/common";
import { ChevronDown2Icon } from "@/components/icons";
import { CONVERTER_SECTIONS, SPRING_PANEL } from "@/constants";
import { cn } from "@/lib/utils";
import { useAlertsStore, useFavoritesStore, useLogStore } from "@/store";
import type { ConverterSectionValueType, TabNavPropsType } from "@/types";
import {
  Badge,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TabsList,
  TabsTrigger,
} from "../ui";

const TAB_INDICATOR_LAYOUT_ID = "tab-nav-indicator";

const TabNav = ({ value, onValueChange }: TabNavPropsType) => {
  const [open, setOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const favoritesCount = useFavoritesStore((state) => state.favorites.length);
  const alertsCount = useAlertsStore((state) => state.alerts.length);
  const logCount = useLogStore((state) => state.entries.length);

  const countByValue: Partial<Record<ConverterSectionValueType, number>> = {
    favorites: favoritesCount,
    alerts: alertsCount,
    log: logCount,
  };

  const activeSection =
    CONVERTER_SECTIONS.find((section) => section.value === value) ??
    CONVERTER_SECTIONS[0];
  const activeCount = countByValue[activeSection.value];

  const handleSelect = (nextValue: ConverterSectionValueType) => {
    onValueChange(nextValue);
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* Desktop / tablet — horizontal tabs */}
      <TabsList aria-label="Converter sections" className="hidden md:flex">
        {CONVERTER_SECTIONS.map((section) => {
          const count = countByValue[section.value];
          const isActive = section.value === value;

          return (
            <TabsTrigger key={section.value} value={section.value}>
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={TAB_INDICATOR_LAYOUT_ID}
                  className="-bottom-px absolute inset-x-0 h-0.5 rounded-full bg-primary"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
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
              "flex h-10 w-full items-center justify-between gap-step-150 rounded-md border border-neutral-400 bg-card px-step-150",
              "preset-3 text-foreground uppercase transition-colors",
              "focus-ring hover:border-neutral-500 hover:bg-neutral-500",
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

          <PopoverContent className="w-(--radix-popover-trigger-width) rounded-10 border-neutral-500 bg-card p-step-100 dark:border-neutral-600">
            <div role="listbox" aria-label="Converter sections">
              <List
                items={CONVERTER_SECTIONS}
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
                          "preset-3 flex w-full cursor-pointer items-center justify-between gap-step-150 rounded-sm border border-transparent px-step-100 py-step-125 text-left uppercase transition-colors",
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

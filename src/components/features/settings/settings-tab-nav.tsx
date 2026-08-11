"use client";

import { motion } from "motion/react";
import * as React from "react";

import { List } from "@/components/common";
import { ChevronDown2Icon } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { SETTINGS_SECTIONS, SPRING_PANEL } from "@/constants";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  SettingsSectionValueType,
  SettingsTabNavPropsType,
} from "@/types";

const SETTINGS_TAB_INDICATOR_LAYOUT_ID = "settings-tab-indicator";

const SettingsTabNav = ({ value, onValueChange }: SettingsTabNavPropsType) => {
  const [open, setOpen] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeSection =
    SETTINGS_SECTIONS.find((section) => section.value === value) ??
    SETTINGS_SECTIONS[0];

  const handleSelect = (nextValue: SettingsSectionValueType) => {
    onValueChange(nextValue);
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* Desktop / tablet — horizontal tabs */}
      <TabsList aria-label="Settings sections" className="hidden md:flex">
        {SETTINGS_SECTIONS.map((section) => {
          const isActive = section.value === value;

          return (
            <TabsTrigger key={section.value} value={section.value}>
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={SETTINGS_TAB_INDICATOR_LAYOUT_ID}
                  className="-bottom-px absolute inset-x-0 h-0.5 rounded-full bg-primary"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              {section.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Mobile — collapses into a dropdown */}
      <div className="md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            type="button"
            aria-label={`Settings sections: ${activeSection.label}`}
            className={cn(
              "flex h-10 w-full items-center justify-between gap-step-150 rounded-md border border-neutral-400 bg-card px-step-150",
              "preset-3 text-foreground uppercase transition-colors",
              "focus-ring hover:border-neutral-500 hover:bg-neutral-500",
            )}
          >
            <span>{activeSection.label}</span>

            <ChevronDown2Icon
              size={16}
              className={cn(
                "text-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </PopoverTrigger>

          <PopoverContent className="w-(--radix-popover-trigger-width) rounded-10 border-neutral-500 bg-card p-step-100 dark:border-neutral-600">
            <div role="listbox" aria-label="Settings sections">
              <List
                items={SETTINGS_SECTIONS}
                keyExtractor={(section) => section.value}
                renderItem={(section) => {
                  const isActive = section.value === value;

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

export default SettingsTabNav;

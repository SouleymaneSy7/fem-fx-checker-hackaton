"use client";

import * as React from "react";

import List from "@/components/common/list";
import Title from "@/components/common/title";
import { QuestionIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SHORTCUT_EVENTS } from "@/constants";
import { useIsMac } from "@/hooks/use-is-mac";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "../ui/kbd";

const ShortcutsHelp = () => {
  const [open, setOpen] = React.useState(false);

  const isMac = useIsMac();
  const modKey = isMac ? "⌘" : "Ctrl";
  const altKey = isMac ? "⌥" : "Alt";

  React.useEffect(() => {
    const handleToggle = () => setOpen((current) => !current);
    window.addEventListener(SHORTCUT_EVENTS.toggleShortcutsHelp, handleToggle);

    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.toggleShortcutsHelp,
        handleToggle,
      );
  }, []);

  const shortcuts = [
    {
      id: "shortcuts-search",
      label: "Search Send currency",
      keys: { first: modKey, second: "K" },
    },
    {
      id: "shortcuts-swap",
      label: "Swap currencies",
      keys: { first: modKey, second: "S" },
    },
    {
      id: "shortcuts-range",
      label: "History range",
      keys: { first: altKey, second: "1...6" },
    },
    { id: "shortcuts-toggle", label: "Toggle this panel", keys: ["?"] },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            type="button"
            aria-label="Keyboard shortcuts"
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon-md" }),
              "fixed bottom-step-250 right-step-250 z-40 rounded-full shadow-none",
            )}
          >
            <QuestionIcon
              size={20}
              className="text-foreground [&_svg:not([class*='size-'])]:size-5"
            />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Keyboard shortcuts (press ?)</TooltipContent>
      </Tooltip>

      <PopoverContent
        side="top"
        sideOffset={10}
        className="w-full max-w-74 sm:max-w-95 space-y-step-200 p-step-250"
      >
        <Title level="h3" className="preset-4 uppercase text-neutral-200">
          Keyboard shortcuts
        </Title>

        <List
          items={shortcuts}
          keyExtractor={(shortcut) => shortcut.id}
          className="flex flex-col gap-step-150"
          renderItem={(shortcut) => (
            <li className="flex flex-wrap items-center justify-between gap-step-200">
              <span className="flex items-center gap-step-050">
                {Array.isArray(shortcut.keys) ? (
                  shortcut.keys.map((key) => <Kbd key={key}>{key}</Kbd>)
                ) : (
                  <KbdGroup>
                    <Kbd>{shortcut.keys.first}</Kbd>
                    <span className="hidden md:inline text-neutral-200">+</span>
                    <Kbd>{shortcut.keys.second}</Kbd>
                  </KbdGroup>
                )}
              </span>

              <span className="preset-4 uppercase text-foreground">
                {shortcut.label}
              </span>
            </li>
          )}
        />
      </PopoverContent>
    </Popover>
  );
};

ShortcutsHelp.displayName = "ShortcutsHelp";

export default ShortcutsHelp;

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
import { SHORTCUT_EVENTS } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "../ui/kbd";

const uaData = navigator as Navigator & {
  userAgentData?: {
    platform?: string;
  };
};

/**
 * `navigator.platform` only exists once mounted on the client. Starting at
 * `false` keeps the server render and the first client paint identical
 * (both show "Ctrl"/"Alt") — no hydration mismatch — then flips to the Mac
 * symbols right after mount if applicable.
 *
 */
const useIsMac = () => {
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    const platform = uaData.userAgentData?.platform ?? navigator.userAgent;

    setIsMac(/Mac|iPhone|iPad|iPod/.test(platform));
  }, []);

  return isMac;
};

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
      id: crypto.randomUUID(),
      label: "Search Send currency",
      keys: { first: modKey, second: "K" },
    },
    {
      id: crypto.randomUUID(),
      label: "Swap currencies",
      keys: { first: modKey, second: "S" },
    },
    {
      id: crypto.randomUUID(),
      label: "History range",
      keys: { first: altKey, second: "1...6" },
    },
    { id: crypto.randomUUID(), label: "Toggle this panel", keys: ["?"] },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label="Keyboard shortcuts"
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon-lg" }),
          "fixed bottom-step-250 right-step-250 z-40 rounded-full shadow-none",
        )}
      >
        <QuestionIcon size={32} className="text-foreground" />
      </PopoverTrigger>

      <PopoverContent
        side="top"
        sideOffset={10}
        className="w-full max-w-90 space-y-step-200 p-step-250"
      >
        <Title level="h3" className="preset-4 uppercase text-neutral-200">
          Keyboard shortcuts
        </Title>

        <List
          items={shortcuts}
          keyExtractor={(shortcut) => shortcut.id}
          className="flex flex-col gap-step-150"
          renderItem={(shortcut) => (
            <li className="flex items-center justify-between gap-step-200">
              <span className="flex items-center gap-step-050">
                {Array.isArray(shortcut.keys) ? (
                  shortcut.keys.map((key) => <Kbd key={key}>{key}</Kbd>)
                ) : (
                  <KbdGroup>
                    <Kbd>{shortcut.keys.first}</Kbd>
                    <span className="text-neutral-200">+</span>
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

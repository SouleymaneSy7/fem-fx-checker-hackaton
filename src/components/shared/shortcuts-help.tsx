"use client";

import * as React from "react";

import { QuestionIcon } from "@/components/icons";
import {
  ALT_KEY_TOKEN,
  MOD_KEY_TOKEN,
  SHORTCUT_EVENTS,
  SHORTCUT_REGISTRY,
} from "@/constants";
import { useIsMac } from "@/hooks";
import { cn } from "@/lib/utils";
import { List, Title } from "../common";
import {
  buttonVariants,
  Kbd,
  KbdGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui";

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

  // Resolves the registry's platform-independent tokens ($mod/$alt) into
  // the symbol this platform actually uses. The registry itself stays
  // free of any React/DOM dependency so use-keyboard-shortcuts.ts can
  // import it too.
  const resolveKeyLabel = (key: string) => {
    if (key === MOD_KEY_TOKEN) return modKey;
    if (key === ALT_KEY_TOKEN) return altKey;
    return key;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            type="button"
            aria-label="Keyboard shortcuts"
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon-md" }),
              "fixed right-step-250 bottom-step-250 z-40 rounded-full shadow-none",
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
        className="w-full max-w-74 space-y-step-200 p-step-250 sm:max-w-95"
      >
        <Title level="h3" className="preset-4 text-neutral-200 uppercase">
          Keyboard shortcuts
        </Title>

        <ScrollArea className="h-80 pr-step-100">
          <List
            items={SHORTCUT_REGISTRY}
            keyExtractor={(group) => group.id}
            className="flex flex-col gap-step-150"
            renderItem={(group) => (
              <React.Fragment>
                <li className="flex flex-col gap-step-100">
                  <div className="flex items-center gap-step-025">
                    {Array.isArray(group.displayKeys) ? (
                      group.displayKeys.map((key) => (
                        <Kbd key={key}>{resolveKeyLabel(key)}</Kbd>
                      ))
                    ) : (
                      <KbdGroup>
                        <Kbd>{resolveKeyLabel(group.displayKeys.first)}</Kbd>
                        <span className="hidden text-neutral-200 md:inline">
                          +
                        </span>
                        <Kbd>{resolveKeyLabel(group.displayKeys.second)}</Kbd>
                        {group.displayKeys.third && (
                          <React.Fragment>
                            <span className="hidden text-neutral-200 md:inline">
                              +
                            </span>
                            <Kbd>
                              {resolveKeyLabel(group.displayKeys.third)}
                            </Kbd>
                          </React.Fragment>
                        )}
                      </KbdGroup>
                    )}
                  </div>

                  <p className="preset-5 text-foreground">
                    {group.label} - {group.description}
                  </p>
                </li>

                <Separator className="my-step-100" />
              </React.Fragment>
            )}
          />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

ShortcutsHelp.displayName = "ShortcutsHelp";

export default ShortcutsHelp;

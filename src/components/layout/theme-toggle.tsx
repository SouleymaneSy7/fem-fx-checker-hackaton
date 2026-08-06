"use client";

import * as React from "react";

import { SHORTCUT_EVENTS } from "@/constants";
import { useThemeStore } from "@/store";
import { AdjustHalfIcon } from "../icons";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "../ui";

const ThemeToggle = () => {
  const [mounted, setMounted] = React.useState(false);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Keeps <html>'s class in sync with the store. The inline script in
  // layout.tsx only handles the very first paint — every toggle after
  // that goes through this effect.
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme, mounted]);

  // Keyboard shortcut (T, see constants/shortcut-registry.ts).
  // `toggleTheme` is a Zustand action and stays referentially stable
  // across renders, so no ref indirection is needed here (unlike the
  // callbacks in share-button.tsx / converter-bottom.tsx).
  React.useEffect(() => {
    const handleThemeShortcut = () => toggleTheme();

    window.addEventListener(SHORTCUT_EVENTS.toggleTheme, handleThemeShortcut);
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.toggleTheme,
        handleThemeShortcut,
      );
  }, [toggleTheme]);

  const activeTheme = mounted ? theme : "dark";

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="text-foreground"
            aria-label={
              activeTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            onClick={toggleTheme}
          >
            <AdjustHalfIcon />
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          {activeTheme === "dark"
            ? "Switch to light mode."
            : "Switch to dark mode."}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;

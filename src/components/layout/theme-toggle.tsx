"use client";

import * as React from "react";

import { SHORTCUT_EVENTS } from "@/constants";
import { useSettingsSync } from "@/hooks";
import { useThemeStore } from "@/store";
import { AdjustHalfIcon } from "../icons";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "../ui";

const ThemeToggle = () => {
  const [mounted, setMounted] = React.useState(false);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const { syncSetting } = useSettingsSync();

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

  // Read through a ref rather than listed as a dependency below: `theme`
  // changes on every toggle, and depending on it directly would tear
  // down and re-add the keyboard shortcut listener on every flip instead
  // of just once.
  const themeRef = React.useRef(theme);
  themeRef.current = theme;

  const handleToggleTheme = React.useCallback(() => {
    const nextTheme = themeRef.current === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    syncSetting({ theme: nextTheme });
  }, [setTheme, syncSetting]);

  // Keyboard shortcut (T, see constants/shortcut-registry.ts).
  React.useEffect(() => {
    window.addEventListener(SHORTCUT_EVENTS.toggleTheme, handleToggleTheme);
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.toggleTheme,
        handleToggleTheme,
      );
  }, [handleToggleTheme]);

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
            onClick={handleToggleTheme}
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

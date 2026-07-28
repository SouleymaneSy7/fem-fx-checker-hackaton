"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThemeStore } from "@/store/theme-store";
import { AdjustHalfIcon } from "../icons";

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

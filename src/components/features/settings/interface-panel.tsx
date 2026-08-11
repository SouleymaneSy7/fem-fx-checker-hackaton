"use client";

import { motion } from "motion/react";

import { Container, Title } from "@/components/common";
import {
  Kbd,
  Label,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui";
import { SPRING_PANEL, TICKER_SPEED_OPTIONS } from "@/constants";
import { useReducedMotion, useSettingsSync } from "@/hooks";
import { usePreferencesStore, useThemeStore } from "@/store";
import type { ThemeType } from "@/types";

const THEME_INDICATOR_LAYOUT_ID = "settings-interface-theme-indicator";
const MOTION_INDICATOR_LAYOUT_ID = "settings-interface-motion-indicator";
const SPEED_INDICATOR_LAYOUT_ID = "settings-interface-speed-indicator";

type ReducedMotionOptionType = "system" | "always" | "never";

const REDUCED_MOTION_OPTIONS: {
  value: ReducedMotionOptionType;
  label: string;
}[] = [
  { value: "system", label: "System" },
  { value: "always", label: "Always" },
  { value: "never", label: "Never" },
];

const InterfacePanel = () => {
  const shouldReduceMotion = useReducedMotion();
  const { syncSetting } = useSettingsSync();

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const reducedMotion = usePreferencesStore((state) => state.reducedMotion);
  const setReducedMotion = usePreferencesStore(
    (state) => state.setReducedMotion,
  );
  const tickerVisible = usePreferencesStore((state) => state.tickerVisible);
  const setTickerVisible = usePreferencesStore(
    (state) => state.setTickerVisible,
  );
  const tickerSpeedSeconds = usePreferencesStore(
    (state) => state.tickerSpeedSeconds,
  );
  const setTickerSpeedSeconds = usePreferencesStore(
    (state) => state.setTickerSpeedSeconds,
  );

  const handleThemeChange = (next: string) => {
    if (!next) return;
    const nextTheme = next as ThemeType;
    setTheme(nextTheme);
    syncSetting({ theme: nextTheme });
  };

  const reducedMotionValue: ReducedMotionOptionType =
    reducedMotion === null ? "system" : reducedMotion ? "always" : "never";

  const handleReducedMotionChange = (next: string) => {
    if (!next) return;
    const option = next as ReducedMotionOptionType;
    const value = option === "system" ? null : option === "always";
    setReducedMotion(value);
    syncSetting({ reducedMotion: value });
  };

  const handleTickerVisibleToggle = (checked: boolean) => {
    setTickerVisible(checked);
    syncSetting({ tickerVisible: checked });
  };

  const effectiveTickerSpeed = tickerSpeedSeconds ?? 30;

  const handleTickerSpeedChange = (next: string) => {
    if (!next) return;
    const seconds = Number(next);
    setTickerSpeedSeconds(seconds);
    syncSetting({ tickerSpeedSeconds: seconds });
  };

  return (
    <div className="space-y-step-200 md:space-y-step-250">
      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Theme
        </Title>

        <p className="preset-5 text-neutral-200">
          Also available from the header button anywhere in the app — press{" "}
          <Kbd>T</Kbd> to toggle it too.
        </p>

        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={handleThemeChange}
          aria-label="Theme"
          className="w-fit bg-neutral-600"
        >
          <ToggleGroupItem value="dark">
            {theme === "dark" && (
              <motion.span
                aria-hidden="true"
                layout
                layoutId={THEME_INDICATOR_LAYOUT_ID}
                className="absolute inset-0 rounded-md bg-neutral-500"
                style={{ originY: "0px" }}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
              />
            )}
            <span className="relative z-10">Dark</span>
          </ToggleGroupItem>

          <ToggleGroupItem value="light">
            {theme === "light" && (
              <motion.span
                aria-hidden="true"
                layout
                layoutId={THEME_INDICATOR_LAYOUT_ID}
                className="absolute inset-0 rounded-md bg-neutral-500"
                style={{ originY: "0px" }}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
              />
            )}
            <span className="relative z-10">Light</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </Container>

      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Motion
        </Title>

        <p className="preset-5 text-neutral-200">
          "System" follows your OS's reduce-motion setting. Override it here if
          you want something different just for FX Checker.
        </p>

        <ToggleGroup
          type="single"
          value={reducedMotionValue}
          onValueChange={handleReducedMotionChange}
          aria-label="Reduce motion"
          className="w-fit flex-wrap bg-neutral-600"
        >
          {REDUCED_MOTION_OPTIONS.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {reducedMotionValue === option.value && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={MOTION_INDICATOR_LAYOUT_ID}
                  className="absolute inset-0 rounded-md bg-neutral-500"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Container>

      <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Live markets ticker
        </Title>

        <div className="flex flex-wrap items-center justify-between gap-step-200">
          <div className="flex flex-col gap-step-050">
            <Label
              htmlFor="ticker-visible-toggle"
              className="preset-4 normal-case"
            >
              Show the scrolling ticker in the header
            </Label>

            <p className="preset-6 text-neutral-200">
              Which currencies it shows is set under Preferences.
            </p>
          </div>

          <Switch
            id="ticker-visible-toggle"
            checked={tickerVisible}
            onCheckedChange={handleTickerVisibleToggle}
          />
        </div>

        {tickerVisible && (
          <div className="flex flex-col gap-step-100">
            <span className="preset-4 text-foreground">Scroll speed</span>

            <ToggleGroup
              type="single"
              value={String(effectiveTickerSpeed)}
              onValueChange={handleTickerSpeedChange}
              aria-label="Ticker scroll speed"
              className="w-fit bg-neutral-600"
            >
              {TICKER_SPEED_OPTIONS.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={String(option.value)}
                >
                  {effectiveTickerSpeed === option.value && (
                    <motion.span
                      aria-hidden="true"
                      layout
                      layoutId={SPEED_INDICATOR_LAYOUT_ID}
                      className="absolute inset-0 rounded-md bg-neutral-500"
                      style={{ originY: "0px" }}
                      transition={
                        shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                      }
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </Container>
    </div>
  );
};

export default InterfacePanel;

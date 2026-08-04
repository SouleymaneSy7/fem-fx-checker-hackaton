"use client";

import { motion, useReducedMotion } from "motion/react";

import { Container, Title } from "@/components/common";
import { BellIcon } from "@/components/icons";
import {
  Button,
  Label,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import {
  ALERT_REFRESH_INTERVAL_OPTIONS,
  SPRING_PANEL,
  SWR_STALE_1H,
} from "@/constants";
import { usePreferencesStore } from "@/store";
import { playAlertSound } from "@/utils";

const INTERVAL_INDICATOR_LAYOUT_ID = "settings-alert-interval-indicator";

const AlertPreferencesPanel = () => {
  const shouldReduceMotion = useReducedMotion();

  const alertSoundEnabled = usePreferencesStore(
    (state) => state.alertSoundEnabled,
  );
  const setAlertSoundEnabled = usePreferencesStore(
    (state) => state.setAlertSoundEnabled,
  );
  const alertRefreshIntervalMs = usePreferencesStore(
    (state) => state.alertRefreshIntervalMs,
  );
  const setAlertRefreshIntervalMs = usePreferencesStore(
    (state) => state.setAlertRefreshIntervalMs,
  );

  const effectiveInterval = alertRefreshIntervalMs ?? SWR_STALE_1H;

  return (
    <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
      <Title level="h3" className="preset-3-med text-foreground uppercase">
        Rate alerts
      </Title>

      <div className="flex items-center justify-between gap-step-200">
        <div className="flex flex-col gap-step-050">
          <Label htmlFor="alert-sound-toggle" className="preset-4 normal-case">
            Play a sound when an alert triggers
          </Label>

          <p className="preset-6 text-neutral-200">
            Only while FX Checker is open in this tab.
          </p>
        </div>

        <div className="flex items-center gap-step-150">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={playAlertSound}
                aria-label="Preview alert sound"
              >
                <BellIcon className="text-foreground" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>Preview the sound</TooltipContent>
          </Tooltip>

          <Switch
            id="alert-sound-toggle"
            checked={alertSoundEnabled}
            onCheckedChange={setAlertSoundEnabled}
          />
        </div>
      </div>

      <div className="flex flex-col gap-step-100">
        <span className="preset-4 text-foreground">Check rates every</span>

        <p className="preset-6 text-neutral-200">
          Frankfurter publishes one rate per business day — a shorter interval
          only catches that update sooner, it doesn't make alerts more
          real-time.
        </p>

        <ToggleGroup
          type="single"
          value={String(effectiveInterval)}
          onValueChange={(next) => {
            if (next) setAlertRefreshIntervalMs(Number(next));
          }}
          aria-label="Alert refresh interval"
          className="flex-wrap bg-neutral-600"
        >
          {ALERT_REFRESH_INTERVAL_OPTIONS.map((option) => (
            <ToggleGroupItem key={option.value} value={String(option.value)}>
              {effectiveInterval === option.value && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={INTERVAL_INDICATOR_LAYOUT_ID}
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
    </Container>
  );
};

export default AlertPreferencesPanel;

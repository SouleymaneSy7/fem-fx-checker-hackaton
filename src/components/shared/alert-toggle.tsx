"use client";

import * as React from "react";

import { BellIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useAlertsStore } from "@/store/alerts-store";
import type { RateAlertConditionType } from "@/types/data.types";
import type { AlertTogglePropsType } from "@/types/ui.types";

const AlertToggle = ({
  fromCurrency,
  toCurrency,
  currentRate,
  label = "Set a rate alert",
  className,
}: AlertTogglePropsType) => {
  const [open, setOpen] = React.useState(false);
  const [condition, setCondition] =
    React.useState<RateAlertConditionType>("above");
  const [thresholdInput, setThresholdInput] = React.useState("");

  const addAlert = useAlertsStore((state) => state.addAlert);

  // Prefill with the live rate whenever the popover opens, so the user
  // edits a realistic starting point rather than a blank field.
  React.useEffect(() => {
    if (open && currentRate !== undefined) {
      setThresholdInput(currentRate.toFixed(4));
    }
  }, [open, currentRate]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const threshold = Number.parseFloat(thresholdInput.replace(",", "."));
    if (Number.isNaN(threshold) || threshold <= 0) return;

    addAlert({ fromCurrency, toCurrency, condition, threshold });

    // Ask for permission at the point the user expresses intent (a real
    // click), rather than on page load — browsers are more permissive
    // with permission prompts triggered by a user gesture.
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={label}
        className={cn(buttonVariants({ variant: "default" }), className)}
      >
        <BellIcon className="text-foreground" />
        Alert
      </PopoverTrigger>

      <PopoverContent className="w-72 space-y-step-200 p-step-200">
        <form onSubmit={handleSubmit} className="space-y-step-200">
          <div className="space-y-step-075">
            <p className="preset-4 uppercase text-neutral-100">Alert me when</p>

            <p className="preset-5 uppercase text-neutral-200">
              {fromCurrency}/{toCurrency}
            </p>
          </div>

          <ToggleGroup
            type="single"
            value={condition}
            onValueChange={(next) => {
              if (next) setCondition(next as RateAlertConditionType);
            }}
            aria-label="Alert condition"
            className="w-full"
          >
            <ToggleGroupItem
              value="above"
              aria-label="Above threshold"
              className="flex-1"
            >
              Above
            </ToggleGroupItem>
            <ToggleGroupItem
              value="below"
              aria-label="Below threshold"
              className="flex-1"
            >
              Below
            </ToggleGroupItem>
          </ToggleGroup>

          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            data-slot="input"
            value={thresholdInput}
            onChange={(event) => {
              const raw = event.target.value;
              if (!/^\d*[.,]?\d*$/.test(raw)) return;
              setThresholdInput(raw);
            }}
            aria-label="Alert threshold"
            placeholder="0.0000"
            className="w-full rounded-6 border border-neutral-200 bg-transparent px-step-150 py-step-150 preset-3 text-foreground outline-none focus:border-primary placeholder:text-neutral-200"
          />

          <button
            type="submit"
            className={cn(buttonVariants({ variant: "primary" }), "w-full")}
          >
            Create alert
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AlertToggle;

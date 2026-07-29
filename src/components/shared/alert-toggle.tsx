"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { BellIcon } from "@/components/icons";
import { SPRING_PANEL } from "@/constants";
import { useAlertMutations } from "@/hooks";
import { cn } from "@/lib/utils";
import type { AlertTogglePropsType, RateAlertConditionType } from "@/types";
import {
  Button,
  buttonVariants,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui";

const CONDITION_INDICATOR_LAYOUT_ID = "alert-condition-indicator";

const AlertToggle = ({
  fromCurrency,
  toCurrency,
  currentRate,
  label = "Set a rate alert",
  disabled,
  className,
}: AlertTogglePropsType) => {
  const [open, setOpen] = React.useState(false);
  const [condition, setCondition] =
    React.useState<RateAlertConditionType>("above");
  const [thresholdInput, setThresholdInput] = React.useState("");

  const shouldReduceMotion = useReducedMotion();

  const generatedId = React.useId();
  const inputId = `threshold-input-${generatedId}`;

  const { addAlert, isSubmitting } = useAlertMutations();

  // Prefill with the live rate the moment the popover opens, so the user
  // edits a realistic starting point rather than a blank field.
  // `currentRate` is read through a ref rather than listed as a
  // dependency: depending on it directly would re-run this effect (and
  // stomp any threshold the user already typed) every time the
  // underlying rate refreshes while the popover is still open, not just
  // on the open transition.
  const currentRateRef = React.useRef(currentRate);
  currentRateRef.current = currentRate;

  React.useEffect(() => {
    if (open && currentRateRef.current !== undefined) {
      setThresholdInput(currentRateRef.current.toFixed(2));
    }
  }, [open]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const threshold = Number.parseFloat(thresholdInput.replace(",", "."));
    if (Number.isNaN(threshold) || threshold <= 0) return;

    // Success toast now lives inside useAlertMutations.addAlert itself.
    await addAlert(fromCurrency, toCurrency, condition, threshold);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            type="button"
            aria-label={label}
            disabled={disabled}
            className={cn(buttonVariants({ variant: "default" }), className)}
          >
            <BellIcon className="text-foreground" />
            Alert
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>
          Set a rate alert for {fromCurrency}/{toCurrency}
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 md:w-94 space-y-step-250 p-step-200">
        <form onSubmit={handleSubmit} className="space-y-step-250">
          <div className="space-y-step-125">
            <p className="preset-3 uppercase text-neutral-100">
              Get notified when
            </p>

            <div className="space-y-step-125">
              <p className="preset-5-med uppercase text-neutral-200">
                {fromCurrency}/{toCurrency}
              </p>

              <p className="preset-5  text-neutral-100">
                Current rate:{" "}
                <span className="preset-5-med">{currentRate?.toFixed(2)}</span>
              </p>
            </div>
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
              {condition === "above" && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={CONDITION_INDICATOR_LAYOUT_ID}
                  className="absolute inset-0 rounded-md bg-neutral-500"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              <span className="relative z-10">Goes Above</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="below"
              aria-label="Below threshold"
              className="flex-1"
            >
              {condition === "below" && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={CONDITION_INDICATOR_LAYOUT_ID}
                  className="absolute inset-0 rounded-md bg-neutral-500"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              <span className="relative z-10">Drops Below</span>
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex flex-col gap-step-125">
            <Label
              htmlFor={inputId}
              className="preset-5 uppercase text-neutral-100"
            >
              this threshold:
            </Label>

            <input
              id={inputId}
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
              placeholder="0.00"
              className="w-full py-step-100 px-step-100 rounded-6 bg-transparent border border-neutral-200 preset-5 text-foreground outline-none focus:border-primary placeholder:text-neutral-200"
            />
          </div>

          <Button
            type="submit"
            variant={"primary"}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full"
          >
            {isSubmitting && (
              <Spinner aria-hidden="true" className="text-primary-foreground" />
            )}
            {isSubmitting ? "Creating..." : "Create alert"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AlertToggle;

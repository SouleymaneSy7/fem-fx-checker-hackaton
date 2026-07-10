"use client";

import * as React from "react";
import { toast } from "sonner";
import { BellIcon } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  disabled,
  className,
}: AlertTogglePropsType) => {
  const [open, setOpen] = React.useState(false);
  const [condition, setCondition] =
    React.useState<RateAlertConditionType>("above");
  const [thresholdInput, setThresholdInput] = React.useState("");

  const generatedId = React.useId();
  const inputId = `threshold-input-${generatedId}`;

  const addAlert = useAlertsStore((state) => state.addAlert);

  // Prefill with the live rate whenever the popover opens, so the user
  // edits a realistic starting point rather than a blank field.
  React.useEffect(() => {
    if (open && currentRate !== undefined) {
      setThresholdInput(currentRate.toFixed(2));
    }
  }, [open, currentRate]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const threshold = Number.parseFloat(thresholdInput.replace(",", "."));
    if (Number.isNaN(threshold) || threshold <= 0) return;

    addAlert({ fromCurrency, toCurrency, condition, threshold });

    toast.success(
      `You'll be notified when ${fromCurrency}/${toCurrency} goes ${condition === "above" ? "above" : "below"} ${threshold.toFixed(2)}.`,
    );
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={label}
        disabled={disabled}
        className={cn(buttonVariants({ variant: "default" }), className)}
      >
        <BellIcon className="text-foreground" />
        Alert
      </PopoverTrigger>

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
              Goes Above
            </ToggleGroupItem>
            <ToggleGroupItem
              value="below"
              aria-label="Below threshold"
              className="flex-1"
            >
              Drops Below
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

          <Button type="submit" variant={"primary"} className="w-full">
            Create alert
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AlertToggle;

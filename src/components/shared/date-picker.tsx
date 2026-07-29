"use client";

import { format, isBefore, parseISO, subYears } from "date-fns";
import * as React from "react";

import { CalendarIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { DatePickerPropsType } from "@/types";
import {
  buttonVariants,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui";

export type DatePresetType = {
  label: string;
  date: Date;
};

function buildPresets(minDateObj: Date, maxDateObj: Date): DatePresetType[] {
  const clampToMin = (candidate: Date) =>
    isBefore(candidate, minDateObj) ? minDateObj : candidate;

  return [
    { label: "1y ago", date: clampToMin(subYears(maxDateObj, 1)) },
    { label: "5y ago", date: clampToMin(subYears(maxDateObj, 5)) },
    { label: "10y ago", date: clampToMin(subYears(maxDateObj, 10)) },
    { label: format(minDateObj, "yyyy"), date: minDateObj },
  ];
}

const DatePicker = ({
  value,
  onValueChange,
  minDate,
  maxDate,
  label,
  placeholder = "Pick a date",
  className,
}: DatePickerPropsType) => {
  const [open, setOpen] = React.useState(false);

  const selectedDate = value ? parseISO(value) : undefined;
  const minDateObj = parseISO(minDate);
  const maxDateObj = parseISO(maxDate);

  const [visibleMonth, setVisibleMonth] = React.useState(
    () => selectedDate ?? maxDateObj,
  );

  const presets = React.useMemo(
    () => buildPresets(minDateObj, maxDateObj),
    [minDateObj, maxDateObj],
  );

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    onValueChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setVisibleMonth(selectedDate ?? maxDateObj);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            type="button"
            aria-label={label}
            className={cn(
              buttonVariants({ variant: "popover" }),
              "items-center justify-start",
              className,
            )}
          >
            <CalendarIcon size={16} className="text-neutral-200" />

            <span className="preset-4 text-neutral-50 uppercase">
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
            </span>
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>
          Available from {format(minDateObj, "MMM d, yyyy")} to today.
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-fit space-y-step-200 p-step-200">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          captionLayout="dropdown"
          startMonth={minDateObj}
          endMonth={maxDateObj}
          disabled={[{ before: minDateObj }, { after: maxDateObj }]}
        />

        <Separator orientation="horizontal" />

        <div className="flex flex-wrap items-center gap-step-075">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelect(preset.date)}
              className={cn(
                "preset-5 cursor-pointer rounded-full border border-neutral-500 bg-neutral-600 px-step-125 py-step-075 text-foreground uppercase transition-colors",
                "focus-ring hover:border hover:border-primary hover:bg-primary-foreground hover:text-primary",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

DatePicker.displayName = "DatePicker";

export default DatePicker;

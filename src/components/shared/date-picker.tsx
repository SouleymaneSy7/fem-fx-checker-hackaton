"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import * as React from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DatePickerPropsType } from "@/types/ui.types";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

  const days = React.useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(visibleMonth));
    const gridEnd = endOfWeek(endOfMonth(visibleMonth));
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [visibleMonth]);

  const canGoPrevious = isAfter(startOfMonth(visibleMonth), minDateObj);
  const canGoNext = isBefore(endOfMonth(visibleMonth), maxDateObj);

  const handleSelect = (day: Date) => {
    onValueChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        // Re-center the grid on the selected date (or today) every time
        // the popover reopens, so a stale scroll position from a previous
        // session never lingers.
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
              "justify-start",
              className,
            )}
          >
            <CalendarIcon size={16} className="text-neutral-200" />
            <span className="preset-4 uppercase text-neutral-50">
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
            </span>
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>
          Available from {format(minDateObj, "MMM d, yyyy")} to today
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-72 space-y-step-200 p-step-200">
        <div className="flex items-center justify-between gap-step-150">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Previous month"
                disabled={!canGoPrevious}
                onClick={() =>
                  setVisibleMonth((current) => subMonths(current, 1))
                }
              >
                <ChevronLeftIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous month</TooltipContent>
          </Tooltip>

          <p className="preset-4 uppercase text-foreground">
            {format(visibleMonth, "MMMM yyyy")}
          </p>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Next month"
                disabled={!canGoNext}
                onClick={() =>
                  setVisibleMonth((current) => addMonths(current, 1))
                }
              >
                <ChevronRightIcon size={16} />
              </Button>
            </TooltipTrigger>

            <TooltipContent>Next month</TooltipContent>
          </Tooltip>
        </div>

        {/* biome-ignore lint/a11y/useSemanticElements: calendar grid uses CSS Grid layout, not a table — role="grid" is the correct WAI-ARIA pattern for date pickers */}
        <div
          role="grid"
          aria-label={format(visibleMonth, "MMMM yyyy")}
          className="grid grid-cols-7 gap-step-025"
        >
          {WEEKDAY_LABELS.map((weekday) => (
            <div
              key={weekday}
              aria-hidden="true"
              className="flex items-center justify-center py-step-050 preset-6 uppercase text-neutral-200"
            >
              {weekday}
            </div>
          ))}

          {days.map((day) => {
            const isOutsideMonth = !isSameMonth(day, visibleMonth);
            const isSelected = selectedDate
              ? isSameDay(day, selectedDate)
              : false;
            const isDisabled =
              isOutsideMonth ||
              isBefore(day, minDateObj) ||
              isAfter(day, maxDateObj);

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={isDisabled}
                aria-label={format(day, "MMMM d, yyyy")}
                aria-pressed={isSelected}
                onClick={() => handleSelect(day)}
                className={cn(
                  "flex items-center justify-center rounded-6 py-step-100 preset-5 uppercase transition-colors focus-ring",
                  "text-foreground hover:bg-neutral-500",
                  isOutsideMonth && "text-neutral-300",
                  isDisabled && "pointer-events-none opacity-30",
                  isSelected &&
                    "bg-primary text-primary-foreground hover:bg-primary/80",
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

DatePicker.displayName = "DatePicker";

export default DatePicker;

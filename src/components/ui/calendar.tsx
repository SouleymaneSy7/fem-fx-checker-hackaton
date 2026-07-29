"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...delegatedProps
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn(
        "group/calendar w-full [--cell-size:var(--spacing-step-400)]",
        className,
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("en-US", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex flex-col gap-step-200", defaultClassNames.months),
        month: cn("flex flex-col gap-step-200 w-full", defaultClassNames.month),
        nav: cn("flex items-center justify-between", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-(--cell-size) select-none border border-neutral-500",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon" }),
          "size-(--cell-size) select-none border border-neutral-500",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-step-075 px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex items-center justify-center gap-step-075 text-foreground dark:text-neutral-900",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-6 border border-neutral-500 bg-neutral-600 transition-colors has-focus:border-primary",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "flex items-center gap-step-050 px-step-100 py-step-050 preset-4 uppercase text-foreground select-none",
          defaultClassNames.caption_label,
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none pb-step-050 preset-6 uppercase text-neutral-200",
          defaultClassNames.weekday,
        ),
        week: cn("mt-step-025 flex w-full", defaultClassNames.week),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          defaultClassNames.day,
        ),
        outside: cn(
          "text-neutral-300 aria-selected:text-neutral-300",
          defaultClassNames.outside,
        ),
        disabled: cn("opacity-30", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...rootProps}
          />
        ),
        Chevron: ({ className, orientation }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon size={16} className={className} />;
          }
          if (orientation === "right") {
            return <ChevronRightIcon size={16} className={className} />;
          }
          return <ChevronDownIcon size={12} className={className} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...delegatedProps}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...delegatedProps
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString("en-US")}
      data-today={modifiers.today}
      data-selected={modifiers.selected}
      data-outside={modifiers.outside}
      data-disabled={modifiers.disabled}
      className={cn(
        "preset-5 focus-ring flex aspect-square size-(--cell-size) cursor-pointer items-center justify-center rounded-6 border border-transparent text-foreground uppercase transition-colors",
        "hover:border-primary hover:bg-primary-foreground hover:text-primary",
        "data-[today=true]:bg-neutral-500",
        "data-[outside=true]:text-neutral-300",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-30",
        "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:hover:bg-primary/80",
        className,
      )}
      {...delegatedProps}
    />
  );
}

Calendar.displayName = "Calendar";
CalendarDayButton.displayName = "CalendarDayButton";

export { Calendar, CalendarDayButton };

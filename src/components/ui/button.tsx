import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button preset-5-med focus-ring inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-clip-padding uppercase outline-none transition-all active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-neutral-500 bg-neutral-600 text-foreground hover:border-neutral-400 hover:bg-neutral-500 disabled:border-neutral-300 disabled:bg-neutral-600 disabled:text-neutral-200",
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-neutral-400 bg-secondary text-secondary-foreground hover:bg-neutral-500 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        outline:
          "border-primary bg-transparent text-foreground hover:bg-accent disabled:border-neutral-300 disabled:text-neutral-200 aria-expanded:bg-muted aria-expanded:text-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
        popover:
          "h-step-500 gap-step-100 border-neutral-400 bg-neutral-500 px-step-125 py-step-100 hover:bg-neutral-400",
      },
      size: {
        default:
          "gap-step-100 in-data-[slot=button-group]:rounded-md px-step-150 py-step-100 has-data-[icon=inline-end]:pr-step-100 has-data-[icon=inline-start]:pl-step-100",
        icon: "size-9",
        "icon-md": "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonPropsType = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...delegatedProps
}: ButtonPropsType) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...delegatedProps}
    />
  );
}

export { Button, buttonVariants };

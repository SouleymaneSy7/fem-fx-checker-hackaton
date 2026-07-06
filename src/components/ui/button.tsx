import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding preset-5-med uppercase whitespace-nowrap transition-all outline-none select-none focus-ring active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-600 border-neutral-500 text-foreground hover:bg-neutral-500 hover:border-neutral-400 disabled:bg-neutral-600 disabled:border-neutral-300 disabled:text-neutral-200",
        primary:
          "bg-primary text-primary-foreground border-primary hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-neutral-500 border-neutral-400 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground ",
        outline:
          "border-primary bg-transparent text-foreground hover:bg-accent aria-expanded:bg-muted aria-expanded:text-foreground disabled:border-neutral-300 disabled:text-neutral-200",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        popover:
          "h-step-500 bg-neutral-500 border-neutral-400 gap-step-100 px-step-125 py-step-100 hover:bg-neutral-400",
      },
      size: {
        default:
          "gap-step-100 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-step-100 has-data-[icon=inline-start]:pl-step-100 px-step-150 py-step-100",
        icon: "size-9",
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

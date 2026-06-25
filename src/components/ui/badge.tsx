import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex size-step-250 shrink-0 items-center justify-center whitespace-nowrap rounded-full preset-6 tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground text-primary",
        primary: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgePropsType = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant = "default",
  ...delegatedProps
}: BadgePropsType) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, className }))}
      {...delegatedProps}
    />
  );
}

export { Badge, badgeVariants };

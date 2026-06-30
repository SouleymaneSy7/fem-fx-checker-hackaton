import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-step-250 min-w-step-250 shrink-0 items-center justify-center whitespace-nowrap rounded-full preset-6 px-step-075 tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-primary-foreground text-primary",
        primary: "bg-primary text-primary-foreground",
        muted: "text-neutral-200 preset-5 p-0",
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

Badge.displayName = "Badge";

export { Badge, badgeVariants };

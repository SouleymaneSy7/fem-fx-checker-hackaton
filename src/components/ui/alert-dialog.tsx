"use client";

import type { VariantProps } from "class-variance-authority";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import type * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AlertDialog({
  ...delegatedProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog" {...delegatedProps} />
  );
}

function AlertDialogTrigger({
  ...delegatedProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...delegatedProps}
    />
  );
}

function AlertDialogHeader({
  className,
  ...delegatedProps
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col gap-step-100 text-center sm:text-left",
        className,
      )}
      {...delegatedProps}
    />
  );
}

function AlertDialogFooter({
  className,
  ...delegatedProps
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-step-100 sm:flex-row sm:justify-end",
        className,
      )}
      {...delegatedProps}
    />
  );
}

function AlertDialogTitle({
  className,
  ...delegatedProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("preset-3-bold text-foreground uppercase", className)}
      {...delegatedProps}
    />
  );
}

function AlertDialogDescription({
  className,
  ...delegatedProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("preset-5 text-neutral-200", className)}
      {...delegatedProps}
    />
  );
}

function AlertDialogAction({
  className,
  variant = "primary",
  ...delegatedProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  VariantProps<typeof buttonVariants>) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(
        buttonVariants({ variant }),
        // Only the destructive variant gets a reinforcing colored
        // border — buttonVariants' own "primary" variant already sets
        // border-primary, so forcing border-destructive on top of it
        // regardless of variant used to fight that styling.
        variant === "destructive" && "border border-destructive",
        className,
      )}
      {...delegatedProps}
    />
  );
}

function AlertDialogCancel({
  className,
  ...delegatedProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "secondary" }), className)}
      {...delegatedProps}
    />
  );
}

AlertDialog.displayName = "AlertDialog";
AlertDialogTrigger.displayName = "AlertDialogTrigger";
AlertDialogHeader.displayName = "AlertDialogHeader";
AlertDialogFooter.displayName = "AlertDialogFooter";
AlertDialogTitle.displayName = "AlertDialogTitle";
AlertDialogDescription.displayName = "AlertDialogDescription";
AlertDialogAction.displayName = "AlertDialogAction";
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

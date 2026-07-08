"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TextInputPropsType } from "@/types/ui.types";

const TextInput = React.forwardRef<HTMLInputElement, TextInputPropsType>(
  ({ className, label, id, error, ...delegatedProps }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? `text-input-${generatedId}`;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-step-075">
        <Label htmlFor={inputId} className="preset-5">
          {label}
        </Label>

        <input
          id={inputId}
          data-slot="input"
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "w-full py-step-100 px-step-100 rounded-6 bg-transparent border border-neutral-200 preset-5 text-foreground",
            "placeholder:text-neutral-200",
            "focus:outline-none focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            className,
          )}
          ref={ref}
          {...delegatedProps}
        />

        {error && (
          <p id={errorId} className="preset-6 text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;

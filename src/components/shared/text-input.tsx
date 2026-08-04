"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { TextInputPropsType } from "@/types";

const TextInput = React.forwardRef<HTMLInputElement, TextInputPropsType>(
  ({ className, label, id, error, ...delegatedProps }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? `text-input-${generatedId}`;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-step-100">
        <label htmlFor={inputId} className="preset-4 text-foreground">
          {label}
        </label>

        <input
          id={inputId}
          data-slot="input"
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "preset-4 w-full rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-125 text-foreground",
            "placeholder:text-neutral-300",
            "focus:border-primary focus:outline-none",
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

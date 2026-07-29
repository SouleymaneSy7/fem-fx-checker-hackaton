"use client";

import * as React from "react";

import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { AuthTextInputPropsType } from "@/types";

const AuthTextInput = React.forwardRef<
  HTMLInputElement,
  AuthTextInputPropsType
>(({ className, label, id, error, type, ...delegatedProps }, ref) => {
  const generatedId = React.useId();
  const inputId = id ?? `auth-input-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;

  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = type === "password";
  const resolvedType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-step-100">
      <label htmlFor={inputId} className="preset-4 text-foreground">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type={resolvedType}
          data-slot="input"
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "w-full py-step-125 px-step-150 rounded-10 bg-neutral-600 border border-neutral-500 preset-4 text-foreground",
            "placeholder:text-neutral-300",
            "focus:outline-none focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            isPasswordField && "pr-step-500",
            className,
          )}
          ref={ref}
          {...delegatedProps}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-step-125 top-1/2 -translate-y-1/2 text-neutral-200 transition-colors hover:text-foreground focus-ring rounded-sm cursor-pointer"
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="preset-6 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});

export default AuthTextInput;

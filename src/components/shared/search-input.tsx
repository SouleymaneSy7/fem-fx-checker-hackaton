"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

import type { SearchInputPropsType } from "@/types/ui.types";
import Container from "../common/container";

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputPropsType>(
  ({ className, type, icon, ...delegatedProps }, ref) => {
    const id = React.useId();
    const searchId = `search-${id}`;

    const Icon = icon;

    return (
      <Container className="w-full relative">
        {Icon && (
          <label
            htmlFor={searchId}
            className="absolute left-step-150 top-1/2 transform -translate-y-1/2"
          >
            <Icon />
          </label>
        )}

        <input
          id={searchId}
          type={type}
          data-slot="input"
          className={cn(
            "w-full flex items-center gap-step-125 py-step-150  px-step-150 rounded-6 bg-transparent border border-neutral-200",
            "placeholder:text-neutral-200",
            "focus:outline-none focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            Icon ? "pl-step-500" : "",
            className,
          )}
          ref={ref}
          {...delegatedProps}
        />
      </Container>
    );
  },
);

export default SearchInput;

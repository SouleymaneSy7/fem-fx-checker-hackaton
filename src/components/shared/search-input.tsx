"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { SearchInputPropsType } from "@/types";
import Container from "../common/container";
import { Kbd, KbdGroup } from "../ui/kbd";

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputPropsType>(
  ({ className, type, icon, keys, ...delegatedProps }, ref) => {
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
            "w-full flex items-center flex-1 gap-step-125 py-step-150  px-step-150 rounded-6 bg-transparent border border-neutral-200",
            "placeholder:text-neutral-200",
            "focus:outline-none focus:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            Icon ? "pl-step-500" : "",
            keys ? "pr-step-150 md:pr-step-1400" : "",
            className,
          )}
          ref={ref}
          {...delegatedProps}
        />

        {keys && (
          <div
            className={cn(
              "hidden md:inline-block",
              "order-last pr-step-050 has-[>kbd]:mr-step-050",
              "absolute right-step-050 top-1/2 transform -translate-y-1/2",
            )}
          >
            <KbdGroup className="gap-step-025">
              <Kbd className="p-step-025">{keys.firstKey}</Kbd>
              <Kbd className="p-step-025">{keys.secondKey}</Kbd>
            </KbdGroup>
          </div>
        )}
      </Container>
    );
  },
);

export default SearchInput;

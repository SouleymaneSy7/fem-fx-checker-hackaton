"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { SearchInputPropsType } from "@/types";
import { Container } from "../common";
import { Kbd, KbdGroup } from "../ui/kbd";

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputPropsType>(
  ({ className, type, icon, keys, ...delegatedProps }, ref) => {
    const id = React.useId();
    const searchId = `search-${id}`;

    const Icon = icon;

    return (
      <Container className="relative w-full">
        {Icon && (
          <label
            htmlFor={searchId}
            className="-translate-y-1/2 absolute top-[calc(50%-1px)] left-step-150 transform"
          >
            <Icon />
          </label>
        )}

        <input
          id={searchId}
          type={type}
          data-slot="input"
          className={cn(
            "flex w-full flex-1 items-center gap-step-125 rounded-6 border border-neutral-200 bg-transparent px-step-150 py-step-150",
            "placeholder:text-neutral-200",
            "focus:border-primary focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            Icon ? "pl-step-500" : "",
            keys ? "pr-step-150 md:pr-45" : "",
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
              "-translate-y-1/2 absolute top-[calc(50%-1px)] right-step-050 transform",
            )}
          >
            <KbdGroup className="gap-step-025">
              <Kbd className="p-step-025">{keys.firstKey}</Kbd>
              <Kbd className="p-step-025">{keys.secondKey}</Kbd>
              {keys.thirdKey && (
                <Kbd className="p-step-025">{keys.thirdKey}</Kbd>
              )}
            </KbdGroup>
          </div>
        )}
      </Container>
    );
  },
);

export default SearchInput;

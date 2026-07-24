"use client";

import * as React from "react";

import { InfoIcon } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SHORTCUT_EVENTS,
  TEST_ACCOUNT_EMAIL,
  TEST_ACCOUNT_PASSWORD,
} from "@/constants";
import { cn } from "@/lib/utils";

const TestCredentialsHint = () => {
  const [open, setOpen] = React.useState(false);

  const handleFill = () => {
    window.dispatchEvent(
      new CustomEvent(SHORTCUT_EVENTS.fillTestCredentials, {
        detail: { email: TEST_ACCOUNT_EMAIL, password: TEST_ACCOUNT_PASSWORD },
      }),
    );
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            type="button"
            aria-label="Test credentials"
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon-md" }),
              "fixed bottom-step-250 right-step-250 z-40 rounded-full shadow-none",
            )}
          >
            <InfoIcon
              size={20}
              className="text-foreground [&_svg:not([class*='size-'])]:size-5"
            />
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>Try it without an account</TooltipContent>
      </Tooltip>

      <PopoverContent
        side="top"
        sideOffset={10}
        className="w-full max-w-80 space-y-step-200 p-step-250"
      >
        <p className="preset-5 text-neutral-200">
          You can test the application immediately using this demo account:
        </p>

        <div className="space-y-step-075 rounded-10 border border-neutral-500 bg-neutral-600 p-step-100 md:p-step-200">
          <p className="preset-5 text-neutral-200">
            Email:{" "}
            <span className="text-primary font-medium">
              {TEST_ACCOUNT_EMAIL}
            </span>
          </p>

          <p className="preset-5 text-neutral-200">
            Password:{" "}
            <span className="text-primary font-medium">
              {TEST_ACCOUNT_PASSWORD}
            </span>
          </p>
        </div>

        <div className="space-y-step-075">
          <p className="preset-5 text-neutral-200">
            This demo account is provided for those who prefer not to create
            their own account. <b>It is not required.</b>
          </p>

          <p className="preset-5 text-neutral-200">
            You can also sign up with your own email address. Authentication is
            handled securely through <b>Better Auth with hashed passwords</b>,
            and the experience is exactly the same either way.{" "}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full normal-case"
          onClick={handleFill}
        >
          Fill in test credentials
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default TestCredentialsHint;

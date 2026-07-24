"use client";

import Link from "next/link";
import * as React from "react";

import TruncateTooltip from "@/components/shared/truncate-tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getNameInitials } from "@/utils/get-name-initials";

const AuthPopover = () => {
  const [open, setOpen] = React.useState(false);
  const { data: session, isPending } = useSession();

  if (session) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          aria-label="Account menu"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "min-w-18 max-w-40 text-foreground",
          )}
        >
          {isPending ? (
            <Spinner aria-hidden="true" className="text-foreground" />
          ) : (
            <TruncateTooltip className="preset-5-med">
              {session.user.name}
            </TruncateTooltip>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-full md:w-80 space-y-step-200 p-step-200">
          <div className="flex items-center gap-step-150">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="preset-3 uppercase text-foreground">
                {getNameInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-step-050">
              <TruncateTooltip className="preset-4 uppercase text-foreground">
                {session.user.name}
              </TruncateTooltip>

              <TruncateTooltip className="preset-5 text-neutral-200">
                {session.user.email}
              </TruncateTooltip>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
          >
            Sign out
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Link
      href="/sign-in"
      aria-label="Sign in"
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "min-w-18 max-w-40",
      )}
    >
      {isPending ? (
        <Spinner aria-hidden="true" className="text-foreground" />
      ) : (
        "Sign in"
      )}
    </Link>
  );
};

export default AuthPopover;

"use client";

import Link from "next/link";
import * as React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  buttonVariants,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Spinner,
} from "@/components/ui";
import { useClearSyncedStores } from "@/hooks";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getNameInitials } from "@/utils";

const AuthPopover = () => {
  const [open, setOpen] = React.useState(false);
  const { data: session, isPending } = useSession();
  const clearSyncedStores = useClearSyncedStores();

  // The four synced stores are persisted to localStorage and hold this
  // account's server data (see AccountSync). Without clearing them here,
  // a signed-out/guest session would keep showing the outgoing account's
  // favorites/log/alerts/recent pairs — and AccountSync would re-upload
  // that leftover data into whichever account signs in next on this
  // browser.
  const handleSignOut = async () => {
    await signOut();
    clearSyncedStores();
    setOpen(false);
  };

  if (session) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          aria-label="Account menu"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "min-w-18 max-w-40 border-primary bg-primary-accent text-primary hover:bg-primary-accent",
          )}
        >
          {isPending ? (
            <Spinner aria-hidden="true" className="text-primary" />
          ) : (
            <span className="preset-5-med truncate">{session.user.name}</span>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-full space-y-step-200 p-step-200 md:w-80">
          <div className="flex w-full items-center gap-step-150">
            <Avatar className="h-10 w-10">
              {session.user.image && (
                <AvatarImage src={session.user.image} alt={session.user.name} />
              )}

              <AvatarFallback className="preset-3 text-foreground uppercase">
                {getNameInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex w-full flex-col gap-step-050">
              <span className="preset-4 truncate text-foreground uppercase">
                {session.user.name}
              </span>

              <span className="preset-5 truncate text-neutral-200">
                {session.user.email}
              </span>
            </div>
          </div>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full bg-muted",
            )}
          >
            Settings
          </Link>

          <Separator />

          <Button
            type="button"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full border-primary bg-primary-accent text-primary hover:bg-primary-accent",
            )}
            onClick={handleSignOut}
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
        "min-w-18 max-w-40 border-primary bg-primary-accent text-primary hover:bg-primary-accent",
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

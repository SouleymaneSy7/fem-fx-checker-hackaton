"use client";

import Link from "next/link";
import * as React from "react";

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
import { useAlertsStore } from "@/store/alerts-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useLogStore } from "@/store/log-store";
import { useRecentPairsStore } from "@/store/recent-pairs-store";
import { getNameInitials } from "@/utils/get-name-initials";

const AuthPopover = () => {
  const [open, setOpen] = React.useState(false);
  const { data: session, isPending } = useSession();

  const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites);
  const clearLog = useLogStore((state) => state.clearLog);
  const replaceAlerts = useAlertsStore((state) => state.replaceAlerts);
  const replaceRecentPairs = useRecentPairsStore(
    (state) => state.replaceRecentPairs,
  );

  // The four synced stores are persisted to localStorage and hold this
  // account's server data (see AccountSync). Without clearing them here,
  // a signed-out/guest session would keep showing the outgoing account's
  // favorites/log/alerts/recent pairs — and AccountSync would re-upload
  // that leftover data into whichever account signs in next on this
  // browser.
  const handleSignOut = async () => {
    await signOut();

    replaceFavorites([]);
    clearLog();
    replaceAlerts([]);
    replaceRecentPairs([]);

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
            "min-w-18 max-w-40 text-foreground",
          )}
        >
          {isPending ? (
            <Spinner aria-hidden="true" className="text-foreground" />
          ) : (
            <span className="preset-5-med truncate">{session.user.name}</span>
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
              <span className="preset-4 uppercase text-foreground truncate">
                {session.user.name}
              </span>

              <span className="preset-5 text-neutral-200 truncate">
                {session.user.email}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
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

"use client";

import * as React from "react";

import Title from "@/components/common/title";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

type AuthModeType = "sign-in" | "sign-up";

const AuthPopover = () => {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<AuthModeType>("sign-in");

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
            <span className="preset-5-med truncate">{session.user.name}</span>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-full md:w-64 space-y-step-150 p-step-200">
          <div>
            <div className="flex flex-col gap-step-050">
              <p className="preset-4 uppercase text-foreground">
                {session.user.name}
              </p>
              <p className="preset-5 text-neutral-200 truncate">
                {session.user.email}
              </p>
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
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setMode("sign-in");
      }}
    >
      <PopoverTrigger
        type="button"
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
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-full md:w-95 space-y-step-200 p-step-250"
      >
        <Title level="h3" className="preset-4 uppercase text-neutral-200">
          {mode === "sign-in" ? "Sign in" : "Create an account"}
        </Title>

        {mode === "sign-in" ? (
          <SignInForm onSuccess={() => setOpen(false)} />
        ) : (
          <SignUpForm onSuccess={() => setOpen(false)} />
        )}

        <p className="preset-5 text-neutral-200 text-center">
          {mode === "sign-in" ? (
            <React.Fragment>
              No account yet?{" "}
              <button
                type="button"
                className="text-primary underline-offset-2 hover:underline"
                onClick={() => setMode("sign-up")}
              >
                Sign up
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              Already have one?{" "}
              <button
                type="button"
                className="text-primary underline-offset-2 hover:underline"
                onClick={() => setMode("sign-in")}
              >
                Sign in
              </button>
            </React.Fragment>
          )}
        </p>
      </PopoverContent>
    </Popover>
  );
};

AuthPopover.displayName = "AuthPopover";

export default AuthPopover;

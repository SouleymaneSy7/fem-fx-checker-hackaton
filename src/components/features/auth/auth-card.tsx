"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { BubbleBackground } from "@/components/ui/backgrounds/bubble-background";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { useThemeStore } from "@/store/theme-store";
import type { AuthCardPropsType } from "@/types";

// Computed from the app's oklch --primary token per theme (tokens.css),
// not eyeballed — dark resolves to the project's own lime accent
// (#CEF739), light to a violet (#7055F6). BubbleBackground needs plain
// "r,g,b" strings (it interpolates them into rgba(var(--x-color),
// alpha)), which an oklch() value can't be fed into directly — hence the
// precomputed RGB values instead of reusing var(--primary) as-is.
const DARK_BUBBLE_COLORS = {
  first: "206,247,57",
  second: "140,200,40",
  third: "80,140,30",
  fourth: "40,60,20",
  fifth: "180,220,80",
  sixth: "100,180,60",
};

const LIGHT_BUBBLE_COLORS = {
  first: "112,85,246",
  second: "150,130,250",
  third: "80,60,200",
  fourth: "200,190,253",
  fifth: "140,100,255",
  sixth: "95,70,220",
};

const AuthCard = ({ children }: AuthCardPropsType) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mounted, setMounted] = React.useState(false);
  const theme = useThemeStore((state) => state.theme);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isPending && session) router.replace("/");
  }, [isPending, session, router]);

  if (isPending || session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="text-neutral-200" />
      </div>
    );
  }

  const bubbleColors =
    mounted && theme === "light" ? LIGHT_BUBBLE_COLORS : DARK_BUBBLE_COLORS;

  return (
    <div className="flex min-h-dvh flex-col gap-step-300 bg-background p-step-200 md:flex-row md:gap-step-400">
      <div className="hidden overflow-hidden rounded-10 md:block md:flex-1">
        <BubbleBackground
          interactive
          colors={bubbleColors}
          className="size-full"
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-110">{children}</div>
      </div>
    </div>
  );
};

export default AuthCard;

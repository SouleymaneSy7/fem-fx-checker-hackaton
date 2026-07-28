"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useThemeStore } from "@/store/theme-store";

const Toaster = ({ ...props }: ToasterProps) => {
  // The app's own dark/light state lives in useThemeStore (see
  // theme-toggle.tsx), not in next-themes — there's no next-themes
  // ThemeProvider mounted anywhere, so reading useTheme() here would
  // always fall back to its own "system" default and never match what
  // the user actually picked in the app.
  const theme = useThemeStore((state) => state.theme);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          title: "text-foreground",
          description: "!text-neutral-200",
        },
      }}
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };

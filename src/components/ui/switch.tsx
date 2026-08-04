"use client";

import { motion } from "motion/react";
import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";
import { getStrictContext } from "@/utils/get-strict-context";

type SwitchContextType = {
  isPressed: boolean;
  setIsPressed: (isPressed: boolean) => void;
};

const [SwitchProvider, useSwitchContext] =
  getStrictContext<SwitchContextType>("SwitchContext");

function Switch({
  className,
  ...delegatedProps
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <SwitchProvider value={{ isPressed, setIsPressed }}>
      <SwitchPrimitive.Root {...delegatedProps} asChild>
        <motion.button
          data-slot="switch"
          initial={false}
          onTapStart={() => setIsPressed(true)}
          onTap={() => setIsPressed(false)}
          onTapCancel={() => setIsPressed(false)}
          className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-neutral-500 transition-colors",
            "focus-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary",
            className,
          )}
        >
          <SwitchThumb />
        </motion.button>
      </SwitchPrimitive.Root>
    </SwitchProvider>
  );
}

// Widens slightly while held down, then springs back on release — the
// press-feedback microinteraction from animate-ui's Switch primitive,
// wired to Framer Motion's own tap gesture events instead of the
// upstream source's `whileTap="tap"` (and, on its Thumb, a misspelled
// `whileTap="tab"`) — both no-ops there, since neither element defines a
// `variants` map for either string to resolve against.
function SwitchThumb() {
  const { isPressed } = useSwitchContext();

  return (
    <SwitchPrimitive.Thumb asChild>
      <motion.div
        data-slot="switch-thumb"
        animate={{ width: isPressed ? 24 : 20 }}
        transition={{ type: "spring", duration: 0.2, bounce: 0.35 }}
        className={cn(
          "pointer-events-none block h-5 rounded-full bg-neutral-50 shadow-lg ring-0 transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5",
        )}
      />
    </SwitchPrimitive.Thumb>
  );
}

Switch.displayName = "Switch";

export { Switch };

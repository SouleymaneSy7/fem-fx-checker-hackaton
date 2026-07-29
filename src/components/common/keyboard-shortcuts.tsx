"use client";

import { useKeyboardShortcuts } from "@/hooks";

/**
 * Renders nothing — just mounts the global keydown listener once, high up
 * in the tree (see layout.tsx). Kept as its own component so layout.tsx
 * doesn't need to become a Client Component itself.
 */
const KeyboardShortcuts = () => {
  useKeyboardShortcuts();
  return null;
};

KeyboardShortcuts.displayName = "KeyboardShortcuts";

export default KeyboardShortcuts;

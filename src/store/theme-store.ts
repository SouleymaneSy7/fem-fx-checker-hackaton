import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEY_THEME } from "@/constants";
import type { ThemeStoreType } from "@/types";
import { safeLocalStorage } from "@/utils";

export const useThemeStore = create<ThemeStoreType>()(
  persist(
    (set, get) => ({
      theme: "dark",

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),
    }),
    {
      name: STORAGE_KEY_THEME,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);

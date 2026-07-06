import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ThemeStoreType } from "@/types/data.types";
import { safeLocalStorage } from "@/utils/safe-storage";

export const useThemeStore = create<ThemeStoreType>()(
  persist(
    (set, get) => ({
      theme: "dark",

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),
    }),
    {
      name: "fx-theme",
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);

import type { StateStorage } from "zustand/middleware";

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV !== "production";

export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      if (isDev)
        console.warn(`[safeLocalStorage] getItem failed for "${name}"`, error);
      return null;
    }
  },

  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      if (isDev)
        console.warn(`[safeLocalStorage] setItem failed for "${name}"`, error);
    }
  },

  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      if (isDev)
        console.warn(
          `[safeLocalStorage] removeItem failed for "${name}"`,
          error,
        );
    }
  },
};

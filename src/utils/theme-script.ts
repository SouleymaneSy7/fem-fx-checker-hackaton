import { STORAGE_KEY_THEME } from "@/constants";

// Blocking inline script rendered at the top of <body> in layout.tsx. It
// runs synchronously before hydration so the correct theme class is
// already on <html> by the time the browser paints — avoids a flash of
// the wrong theme.
//
// Reads the same localStorage key Zustand's persist middleware writes
// for useThemeStore ("fx-theme") — keep this in sync with the `name`
// option in store/theme-store.ts.

export const THEME_INIT_SCRIPT = `(function () {
  try {
    var raw = window.localStorage.getItem("${STORAGE_KEY_THEME}");
    var theme = raw ? JSON.parse(raw).state.theme : null;
    var root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  } catch {
    // localStorage unavailable or the stored value is malformed — keep
    // the "dark" class already present in the server-rendered markup.
  }
})();`;

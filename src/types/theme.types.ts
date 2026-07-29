export type ThemeType = "dark" | "light";

export type ThemeStoreType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
};

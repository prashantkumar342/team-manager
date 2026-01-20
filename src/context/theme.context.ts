import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  themeMode: Theme;
  setThemeMode: (themeMode: Theme) => void;
};

const initialState: ThemeProviderState = {
  themeMode: "system",
  setThemeMode: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

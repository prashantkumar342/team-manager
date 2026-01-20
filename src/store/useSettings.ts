import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

type ThemeState = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useSettingsStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: "light",

      setThemeMode: (mode) => set({ themeMode: mode }),

      toggleTheme: () =>
        set({
          themeMode: get().themeMode === "light" ? "dark" : "light",
        }),
    }),
    {
      name: "teamsync-theme",
    },
  ),
);

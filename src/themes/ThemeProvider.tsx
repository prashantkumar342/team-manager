import { ThemeProviderContext, type Theme } from "@/context/theme.context";
import { useSettingsStore } from "@/store/useSettings";
import { useEffect } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { themeMode, setThemeMode } = useSettingsStore();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (themeMode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(themeMode);
  }, [themeMode]);

  const value = {
    themeMode,
    setThemeMode: (theme: Theme) => {
      setThemeMode(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

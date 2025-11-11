import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useColorScheme } from "react-native";
import { theme, Theme } from "../constants/theme";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  systemColorScheme: "light" | "dark" | null | undefined;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    (systemColorScheme as ColorScheme) || "light"
  );
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Update theme when system color scheme changes (only if not manually overridden)
  useEffect(() => {
    if (systemColorScheme && !isManualOverride) {
      setColorScheme(systemColorScheme as ColorScheme);
    }
  }, [systemColorScheme, isManualOverride]);

  const handleSetColorScheme = (scheme: ColorScheme) => {
    setIsManualOverride(true);
    setColorScheme(scheme);
  };

  const currentTheme = colorScheme === "dark" ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        colorScheme,
        setColorScheme: handleSetColorScheme,
        systemColorScheme: systemColorScheme || undefined,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

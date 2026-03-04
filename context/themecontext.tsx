import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeMode = "Light" | "Dark" | "System";

type ThemeContextType = {
  theme: "light" | "dark";
  selectedMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: any) => {
  const [selectedMode, setSelectedMode] = useState<ThemeMode>("System");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    loadTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (selectedMode === "System") {
        setTheme(colorScheme === "dark" ? "dark" : "light");
      }
    });

    return () => subscription.remove();
  }, [selectedMode]);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("appTheme");
    const mode = (saved as ThemeMode) || "System";
    applyTheme(mode);
  };

  const applyTheme = async (mode: ThemeMode) => {
    setSelectedMode(mode);
    await AsyncStorage.setItem("appTheme", mode);

    if (mode === "System") {
      const system = Appearance.getColorScheme();
      setTheme(system === "dark" ? "dark" : "light");
    } else {
      setTheme(mode === "Dark" ? "dark" : "light");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        selectedMode,
        setThemeMode: applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};
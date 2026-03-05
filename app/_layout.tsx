import {
  DefaultTheme,
  DarkTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../context/themecontext";
import { LanguageProvider } from "../context/languagecontext"; // 👈 added
import { colors } from "../config/colors";
import "react-native-reanimated";

function RootNavigator() {
  const { theme } = useTheme();

  const themeColors =
    theme === "dark" ? colors.dark : colors.light;

  const navigationTheme = {
    ...(theme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme === "dark"
        ? DarkTheme.colors
        : DefaultTheme.colors),
      background: themeColors.background,
      card: themeColors.card,
      text: themeColors.text,
      border: themeColors.border,
      primary: themeColors.text,
    },
  };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/profile-setup" />

        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="settings" />

        <Stack.Screen name="place/[id]" />
      </Stack>

      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider> {/* 👈 added */}
        <RootNavigator />
      </LanguageProvider>
    </ThemeProvider>
  );
}
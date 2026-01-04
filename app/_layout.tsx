import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Entry / Splash */}
        <Stack.Screen name="index" />

        {/* Auth screens (REGISTER INDIVIDUAL SCREENS, NOT GROUP) */}
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/profile-setup" />

        {/* Main Tabs */}
        <Stack.Screen name="(tabs)" />

        {/* Other routes */}
        <Stack.Screen name="chat/room" />
        <Stack.Screen name="place/[id]" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

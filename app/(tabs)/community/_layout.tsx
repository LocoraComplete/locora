import { Stack } from "expo-router";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";

export default function CommunityStack() {
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="user-profile" />
    </Stack>
  );
}
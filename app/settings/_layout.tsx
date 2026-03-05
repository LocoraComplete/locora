import { Stack } from "expo-router";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";

export default function SettingsLayout() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTitleStyle: {
          color: themeColors.text,
        },
        headerTintColor: themeColors.text,
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      {/* Main Settings */}
      <Stack.Screen
        name="index"
        options={{ title: "Settings" }}
      />

      {/* 👤 Account */}
      <Stack.Screen
        name="change-password"
        options={{ title: "Change Password" }}
      />
      <Stack.Screen
        name="change-emergency"
        options={{ title: "Emergency Contact" }}
      />
      <Stack.Screen
        name="language"
        options={{ title: "Language" }}
      />
      <Stack.Screen
        name="theme"
        options={{ title: "App Theme" }}
      />

      {/* 🔒 Privacy & Security */}
      <Stack.Screen
        name="privacy"
        options={{ title: "Privacy Policy" }}
      />
      <Stack.Screen
        name="terms"
        options={{ title: "Terms of Service" }}
      />

      {/* ℹ️ About */}
      <Stack.Screen
        name="about"
        options={{ title: "About Us" }}
      />
      <Stack.Screen
        name="version"
        options={{ title: "App Version" }}
      />
      <Stack.Screen
        name="support"
        options={{ title: "Contact Support" }}
      />

      {/* ⚠️ Danger Zone */}
      <Stack.Screen
        name="logout"
        options={{ title: "Log Out" }}
      />
      <Stack.Screen
        name="delete-account"
        options={{ title: "Delete Account" }}
      />
    </Stack>
  );
}
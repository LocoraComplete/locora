import { Stack } from "expo-router";
import { colors } from "../../config/colors";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";

export default function SettingsLayout() {
  const { theme } = useTheme();
  const { t } = useLanguage();
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
        options={{ title: t("settings") || "Settings" }}
      />

      {/* 👤 Account */}
      <Stack.Screen
        name="change-password"
        options={{ title: t("changePassword") || "Change Password" }}
      />
      <Stack.Screen
        name="change-emergency"
        options={{ title: t("emergencyContact") || "Emergency Contact" }}
      />
      <Stack.Screen
        name="language"
        options={{ title: t("language") || "Language" }}
      />
      <Stack.Screen
        name="theme"
        options={{ title: t("appTheme") || "App Theme" }}
      />

      {/* 🔒 Privacy & Security */}
      <Stack.Screen
        name="privacy"
        options={{ title: t("privacyPolicy") || "Privacy Policy" }}
      />
      <Stack.Screen
        name="terms"
        options={{ title: t("termsService") || "Terms of Service" }}
      />

      {/* ℹ️ About */}
      <Stack.Screen
        name="about"
        options={{ title: t("aboutUs") || "About Us" }}
      />
      <Stack.Screen
        name="version"
        options={{ title: t("appVersion") || "App Version" }}
      />
      <Stack.Screen
        name="support"
        options={{ title: t("contactSupport") || "Contact Support" }}
      />

      {/* ⚠️ Danger Zone */}
      <Stack.Screen
        name="logout"
        options={{ title: t("logout") || "Log Out" }}
      />
      <Stack.Screen
        name="delete"
        options={{ title: t("deleteAccount") || "Delete Account" }}
      />
    </Stack>
  );
}
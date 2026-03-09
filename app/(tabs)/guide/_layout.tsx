import { Stack } from "expo-router";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";

export default function GuideLayout() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: t("guides") || "Guides" }}
      />
      <Stack.Screen
        name="detail"
        options={{ title: t("guideDetails") || "Guide Details" }}
      />
    </Stack>
  );
}
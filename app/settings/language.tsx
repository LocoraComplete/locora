import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";

export default function LanguageScreen() {
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const { language, setLanguage, t } = useLanguage();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        {t("language") || "Language"}
      </Text>

      {/* English */}
      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor: themeColors.card,
            borderColor:
              language === "en"
                ? themeColors.text
                : themeColors.border,
          },
        ]}
        onPress={() => setLanguage("en")}
      >
        <Text
          style={[
            styles.optionText,
            {
              color: themeColors.text,
              fontWeight: language === "en" ? "700" : "600",
            },
          ]}
        >
          {t("english") || "English"}
        </Text>
      </TouchableOpacity>

      {/* Hindi */}
      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor: themeColors.card,
            borderColor:
              language === "hi"
                ? themeColors.text
                : themeColors.border,
          },
        ]}
        onPress={() => setLanguage("hi")}
      >
        <Text
          style={[
            styles.optionText,
            {
              color: themeColors.text,
              fontWeight: language === "hi" ? "700" : "600",
            },
          ]}
        >
          {t("hindi") || "हिंदी"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});
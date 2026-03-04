import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";

export default function LanguageScreen() {
  const { theme } = useTheme();
  const themeColors =
    theme === "dark" ? colors.dark : colors.light;

  const { language, setLanguage, t } = useLanguage();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        {t("language")}
      </Text>

      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor:
              language === "en"
                ? themeColors.text
                : themeColors.card,
          },
        ]}
        onPress={() => setLanguage("en")}
      >
        <Text
          style={[
            styles.optionText,
            {
              color:
                language === "en"
                  ? "#fff"
                  : themeColors.text,
            },
          ]}
        >
          English
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor:
              language === "hi"
                ? themeColors.text
                : themeColors.card,
          },
        ]}
        onPress={() => setLanguage("hi")}
      >
        <Text
          style={[
            styles.optionText,
            {
              color:
                language === "hi"
                  ? "#fff"
                  : themeColors.text,
            },
          ]}
        >
          हिंदी
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
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
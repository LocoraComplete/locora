import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/themecontext";
import { useLanguage } from "../context/languagecontext"; // 👈 added
import { colors } from "../config/colors";

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage(); // 👈 added

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: themeColors.text }]}>
        LOCORA
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: themeColors.secondaryText },
        ]}
      >
        {t("tagline")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
  },
});
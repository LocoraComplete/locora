import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../config/colors";
import { useLanguage } from "../context/languagecontext";
import { useTheme } from "../context/themecontext";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        const rememberMe = await AsyncStorage.getItem("rememberMe");

        if (pathname === "/") {
          if (user && rememberMe === "true") {
            router.replace("/(tabs)/explore");
          } else {
            await AsyncStorage.removeItem("user");
            router.replace("/(auth)/login");
          }
        }
      } catch {
        router.replace("/(auth)/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Image
        source={require("../assets/images/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: themeColors.text }]}>
        LOCORA
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>
        {t("tagline") ?? ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 180, height: 180, marginBottom: 24 },
  title: { fontSize: 36, fontWeight: "700", letterSpacing: 1 },
  subtitle: { marginTop: 10, fontSize: 16 },
});
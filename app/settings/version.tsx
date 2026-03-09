import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";
import { colors } from "../../config/colors";

export default function AppVersion() {
  const version = "1.0.0";
  const build = "100";

  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require("../../assets/images/splash-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: themeColors.text }]}>
            LOCORA
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: themeColors.secondaryText },
            ]}
          >
            {t("appTagline")}
          </Text>
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <View style={styles.row}>
            <Text
              style={[
                styles.label,
                { color: themeColors.secondaryText },
              ]}
            >
              {t("version")}
            </Text>
            <Text
              style={[styles.value, { color: themeColors.text }]}
            >
              {version}
            </Text>
          </View>

          <View style={styles.row}>
            <Text
              style={[
                styles.label,
                { color: themeColors.secondaryText },
              ]}
            >
              {t("build")}
            </Text>
            <Text
              style={[styles.value, { color: themeColors.text }]}
            >
              {build}
            </Text>
          </View>

          <View style={styles.row}>
            <Text
              style={[
                styles.label,
                { color: themeColors.secondaryText },
              ]}
            >
              {t("releaseChannel")}
            </Text>
            <Text
              style={[styles.value, { color: themeColors.text }]}
            >
              {t("production")}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={[
            styles.description,
            { color: themeColors.secondaryText },
          ]}
        >
          {t("appVersionDesc")}
        </Text>

        {/* Footer */}
        <Text
          style={[
            styles.footer,
            { color: themeColors.secondaryText },
          ]}
        >
          {t("appFooter")}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },

  hero: {
    alignItems: "center",
    marginBottom: 40,
  },

  logo: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },

  appName: {
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 30,
  },

  footer: {
    fontSize: 12,
    textAlign: "center",
  },
});
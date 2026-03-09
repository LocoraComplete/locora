import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";
import { colors } from "../../config/colors";

export default function TermsOfService() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors =
    theme === "dark" ? colors.dark : colors.light;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={[styles.title, { color: themeColors.text }]}>
          {t("termsTitle")}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: themeColors.tertiaryText },
          ]}
        >
          {t("termsLastUpdated")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection1Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection1")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection2Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection2")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection3Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection3")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection4Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection4")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection5Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection5")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection6Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection6")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection7Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection7")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection8Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection8")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection9Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection9")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("termsSection10Title")}
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          {t("termsSection10")}
        </Text>

        <Text
          style={[
            styles.footer,
            { color: themeColors.tertiaryText },
          ]}
        >
          {t("termsFooter")}
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
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  footer: {
    fontSize: 13,
    marginTop: 20,
    textAlign: "center",
  },
});
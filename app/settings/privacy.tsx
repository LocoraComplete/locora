import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={[styles.title, { color: themeColors.text }]}>
          {t("privacyPolicy") || "Privacy Policy"}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme === "dark" ? "#bbb" : "#777" },
          ]}
        >
          {t("lastUpdated") || "Last Updated: January 2026"}
        </Text>

        {/* 1 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyIntroTitle") || "1. Introduction"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyIntroText") ||
            "LOCORA is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform."}
        </Text>

        {/* 2 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyInfoTitle") || "2. Information We Collect"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyInfoText") ||
            "We may collect personal information such as your name, email address, profile information, and usage data. We may also collect technical data including device type, operating system, and app interaction data."}
        </Text>

        {/* 3 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyUseTitle") || "3. How We Use Your Information"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyUseText") ||
            "Your information is used to provide core features, personalize your experience, improve platform performance, and ensure security. We may also use data to communicate updates or important service-related information."}
        </Text>

        {/* 4 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyLocationTitle") || "4. Location Data"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyLocationText") ||
            "If enabled, LOCORA may access your location to enhance relevant features and improve user interactions. You may disable location access at any time through your device settings."}
        </Text>

        {/* 5 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacySharingTitle") || "5. Data Sharing"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacySharingText") ||
            "We do not sell personal data to third parties. Information may be shared with trusted service providers solely to support platform functionality, security, and compliance with legal obligations."}
        </Text>

        {/* 6 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacySecurityTitle") || "6. Data Security"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacySecurityText") ||
            "We implement reasonable technical and organizational measures to protect your data from unauthorized access, alteration, disclosure, or destruction."}
        </Text>

        {/* 7 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyRetentionTitle") || "7. Data Retention"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyRetentionText") ||
            "Personal data is retained only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law."}
        </Text>

        {/* 8 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyRightsTitle") || "8. Your Rights"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyRightsText") ||
            "Depending on your jurisdiction, you may have rights to access, update, or delete your personal information. Requests may be made through the in-app support section."}
        </Text>

        {/* 9 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyChangesTitle") || "9. Changes to This Policy"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyChangesText") ||
            "LOCORA reserves the right to update this Privacy Policy at any time. Continued use of the platform after changes indicates acceptance of the revised policy."}
        </Text>

        {/* 10 */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyContactTitle") || "10. Contact Information"}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyContactText") ||
            "For privacy-related inquiries or concerns, please contact us through the support section within the application."}
        </Text>

        <Text
          style={[
            styles.footer,
            { color: theme === "dark" ? "#888" : "#999" },
          ]}
        >
          {t("copyright") || "© 2026 LOCORA. All rights reserved."}
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
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 60,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 8,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
  },

  footer: {
    fontSize: 12,
    marginTop: 40,
  },
});
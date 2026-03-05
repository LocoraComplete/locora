import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";

export default function TermsOfService() {
  const { theme } = useTheme();
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
          Terms of Service
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: themeColors.tertiaryText },
          ]}
        >
          Last Updated: January 2026
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          1. Acceptance of Terms
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          By accessing or using LOCORA, you agree to be bound by these
          Terms of Service. If you do not agree to these terms,
          you may not use the platform.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          2. Eligibility
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          You must be at least 18 years of age to use LOCORA.
          By using the platform, you represent and warrant that
          you meet this requirement.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          3. User Responsibilities
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          You are responsible for maintaining the confidentiality
          of your account credentials and for all activities that
          occur under your account. You agree to provide accurate
          information and keep your account details updated.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          4. Prohibited Conduct
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          Users may not engage in unlawful, abusive, harassing,
          or fraudulent behavior while using LOCORA. Any misuse
          of the platform may result in suspension or permanent
          termination of access.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          5. Intellectual Property
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          All content, trademarks, branding, and intellectual
          property related to LOCORA remain the exclusive
          property of LOCORA. Unauthorized use is strictly prohibited.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          6. Limitation of Liability
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          LOCORA is provided on an “as-is” and “as-available”
          basis. We do not guarantee uninterrupted access and
          are not liable for indirect, incidental, or consequential
          damages arising from the use of the platform.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          7. Termination
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          We reserve the right to suspend or terminate accounts
          that violate these terms or compromise the integrity
          of the platform.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          8. Changes to Terms
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          LOCORA may update these Terms of Service at any time.
          Continued use of the platform after changes constitutes
          acceptance of the revised terms.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          9. Governing Law
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          These Terms shall be governed and interpreted in
          accordance with applicable laws of the jurisdiction
          in which LOCORA operates.
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          10. Contact Information
        </Text>
        <Text style={[styles.paragraph, { color: themeColors.secondaryText }]}>
          For questions regarding these Terms of Service,
          please contact us through the support section
          within the application.
        </Text>

        <Text
          style={[
            styles.footer,
            { color: themeColors.tertiaryText },
          ]}
        >
          © 2026 LOCORA. All rights reserved.
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
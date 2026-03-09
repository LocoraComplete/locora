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

export default function About() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const themeColors = colors[theme];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <Text
          style={[
            styles.title,
            { color: themeColors.text },
          ]}
        >
          {t("aboutLocora") || "About LOCORA"}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme === "dark" ? "#bbb" : "#777" },
          ]}
        >
          {t("aboutSubtitle") || "Connecting people through meaningful digital experiences."}
        </Text>

        {/* Section 1 */}
        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text },
          ]}
        >
          {t("whoWeAre") || "Who We Are"}
        </Text>
        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("whoWeAreDesc") ||
            "LOCORA is a modern digital platform built to simplify connection and enhance interaction in a secure and user-focused environment. Our goal is to create technology that feels intuitive, reliable, and meaningful."}
        </Text>

        {/* Section 2 */}
        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text },
          ]}
        >
          {t("ourMission") || "Our Mission"}
        </Text>
        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("ourMissionDesc") ||
            "Our mission is to empower users through seamless communication and thoughtful design. We focus on delivering a platform that prioritizes performance, privacy, and user experience above everything else."}
        </Text>

        {/* Section 3 */}
        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text },
          ]}
        >
          {t("whatWeOffer") || "What We Offer"}
        </Text>
        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("whatWeOfferDesc") ||
            "LOCORA provides a streamlined environment designed for modern digital interaction. Through continuous updates and innovation, we ensure the platform remains stable, secure, and aligned with user needs."}
        </Text>

        {/* Section 4 */}
        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text },
          ]}
        >
          {t("ourCommitment") || "Our Commitment"}
        </Text>
        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("ourCommitmentDesc") ||
            "We are committed to maintaining high standards of data protection, transparency, and reliability. Our development approach focuses on long-term sustainability and continuous improvement."}
        </Text>

        {/* Contact Section */}
        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text },
          ]}
        >
          {t("contactInformation") || "Contact Information"}
        </Text>
        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("contactInfoDesc") ||
            "For inquiries, support, or feedback, please reach out through the Contact Support section within the app. Our team aims to respond within 24–48 hours."}
        </Text>

        {/* Footer */}
        <Text
          style={[
            styles.footer,
            { color: theme === "dark" ? "#888" : "#999" },
          ]}
        >
          © 2026 LOCORA
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
    paddingBottom: 50,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 16,
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
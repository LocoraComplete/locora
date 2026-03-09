import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";
import { colors } from "../../config/colors";

export default function ContactSupport() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const themeColors = colors[theme];

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !message) {
      Alert.alert(t("incomplete"), t("fillAllFields"));
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(t("invalidEmail"), t("enterValidEmail"));
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert(t("issueShort"), t("describeMore"));
      return;
    }

    try {
      const response = await fetch(
        "https://locora-backend.onrender.com/api/support/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            issue: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t("submitted"), t("supportResponseTime"));
        setEmail("");
        setMessage("");
      } else {
        Alert.alert(t("error"), data.message || t("submitFailed"));
      }
    } catch (error) {
      Alert.alert(t("error"), t("serverConnectionError"));
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {t("contactSupport")}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("supportIntro1")}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("supportIntro2")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("responseTime")}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("responseTimeDesc")}
        </Text>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("privacyInfo")}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          {t("privacyDesc")}
        </Text>

        <View
          style={[
            styles.divider,
            { backgroundColor: theme === "dark" ? "#2a2a2a" : "#eee" },
          ]}
        />

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {t("sendMessage")}
        </Text>

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              { color: theme === "dark" ? "#bbb" : "#555" },
            ]}
          >
            {t("emailAddress")}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor:
                  theme === "dark" ? "#1c1c1e" : "#f7f7f7",
                borderColor:
                  theme === "dark" ? "#333" : "#ddd",
                color: themeColors.text,
              },
            ]}
            placeholder={t("emailPlaceholder")}
            placeholderTextColor={
              theme === "dark" ? "#888" : "#999"
            }
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              { color: theme === "dark" ? "#bbb" : "#555" },
            ]}
          >
            {t("describeIssue")}
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor:
                  theme === "dark" ? "#1c1c1e" : "#f7f7f7",
                borderColor:
                  theme === "dark" ? "#333" : "#ddd",
                color: themeColors.text,
              },
            ]}
            multiline
            numberOfLines={6}
            placeholder={t("issuePlaceholder")}
            placeholderTextColor={
              theme === "dark" ? "#888" : "#999"
            }
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor:
                theme === "dark" ? "#fff" : "#111",
            },
          ]}
          onPress={handleSubmit}
        >
          <Text
            style={[
              styles.submitText,
              {
                color:
                  theme === "dark" ? "#000" : "#fff",
              },
            ]}
          >
            {t("submitRequest")}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.footerNote,
            { color: theme === "dark" ? "#888" : "#777" },
          ]}
        >
          {t("footerNote")}
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
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footerNote: {
    marginTop: 20,
    fontSize: 13,
    textAlign: "center",
  },
});
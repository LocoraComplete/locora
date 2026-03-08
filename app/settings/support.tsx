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
import { colors } from "../../config/colors";

export default function ContactSupport() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Email validation
  const validateEmail = (email: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !message) {
      Alert.alert("Incomplete", "Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert(
        "Issue Too Short",
        "Please describe your issue in a little more detail."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.174.111:5000/api/support/create",
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
        Alert.alert(
          "Submitted",
          "Your message has been received. Our support team will respond within 24–48 hours."
        );

        setEmail("");
        setMessage("");
      } else {
        Alert.alert("Error", data.message || "Could not submit request.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to support server.");
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
          Contact Support
        </Text>

        {/* Intro */}
        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          We’re committed to providing a safe and reliable experience for all users.
          If you’re facing technical issues, account-related concerns, or have
          feedback about the platform, our support team is here to help.
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          Before reaching out, we recommend ensuring that your app is updated
          to the latest version and that you have a stable internet connection.
          Many common issues are resolved with a simple restart or update.
        </Text>

        {/* Response Policy */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Response Time
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          Our team typically responds within 24–48 hours. During peak periods,
          response times may be slightly longer. We appreciate your patience
          and understanding.
        </Text>

        {/* Privacy */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Privacy & Information
        </Text>

        <Text
          style={[
            styles.paragraph,
            { color: theme === "dark" ? "#ccc" : "#555" },
          ]}
        >
          Please avoid sharing sensitive information such as passwords,
          OTP codes, or payment details in your message. We will never ask
          for your password.
        </Text>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { backgroundColor: theme === "dark" ? "#2a2a2a" : "#eee" },
          ]}
        />

        {/* Form Section */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          Send Us a Message
        </Text>

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              { color: theme === "dark" ? "#bbb" : "#555" },
            ]}
          >
            Email Address
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
            placeholder="your@email.com"
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
            Describe Your Issue
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
            placeholder="Please provide as much detail as possible..."
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
            Submit Request
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.footerNote,
            { color: theme === "dark" ? "#888" : "#777" },
          ]}
        >
          By submitting this request, you acknowledge that the information
          provided is accurate and complete to the best of your knowledge.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  content: {
    paddingTop: 30,
    paddingBottom: 50,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },

  textArea: {
    minHeight: 140,
    textAlignVertical: "top",
  },

  submitButton: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: {
    fontWeight: "600",
    fontSize: 15,
  },

  divider: {
    height: 1,
    marginVertical: 25,
  },

  footerNote: {
    fontSize: 12,
    marginTop: 20,
    lineHeight: 18,
  },
});
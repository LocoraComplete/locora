import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../config/api";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

export default function Signup() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePhoneChange = (text: string, setter: any) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, 10);
    setter(digits);
  };

  const handleSignup = async () => {
    const trimmedEmail = email.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const fullName = trimmedLastName ? `${trimmedFirstName} ${trimmedLastName}` : trimmedFirstName;

    if (!trimmedFirstName)
      return Alert.alert(t("error") || "Error", t("firstNameRequired") || "First name is required");
    if (!validateEmail(trimmedEmail))
      return Alert.alert(t("error") || "Error", t("invalidEmail") || "Invalid email format");
    if (phone.length !== 10)
      return Alert.alert(t("error") || "Error", t("phone10Digits") || "Phone number must be exactly 10 digits");
    if (primaryContact.length !== 10)
      return Alert.alert(t("error") || "Error", t("primaryContact10") || "Primary contact must be 10 digits");
    if (password.length < 6)
      return Alert.alert(t("error") || "Error", t("passwordMin6") || "Password must be at least 6 characters");
    if (password !== confirmPassword)
      return Alert.alert(t("error") || "Error", t("passwordsDoNotMatch") || "Passwords do not match");

    const payload = {
      Name: fullName,
      Email: trimmedEmail,
      Password: password,
      Phone: phone, 
      Gender: "Other",
      emergencyContact: primaryContact, 
    };

    try {
      setLoading(true);
      await api.post("/api/users/register", payload);

      Alert.alert(t("success") || "Success", t("accountCreated") || "Account created!");
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.log("SIGNUP ERROR:", error?.response?.data || error.message);
      Alert.alert(
        t("signupFailed") || "Signup Failed",
        error?.response?.data?.message || t("serverError") || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {t("createAccount") || "Create Account"}
        </Text>

        <TextInput
          style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.card, color: themeColors.text }]}
          placeholder={t("firstName") || "First Name"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.card, color: themeColors.text }]}
          placeholder={t("lastName") || "Last Name"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={[styles.input, { borderColor: themeColors.border, backgroundColor: themeColors.card, color: themeColors.text }]}
          placeholder={t("email") || "Email"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={[styles.phoneContainer, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
          <Text style={[styles.prefix, { color: themeColors.text }]}>+91</Text>
          <TextInput
            style={[styles.phoneInput, { color: themeColors.text }]}
            placeholder={t("enter10DigitNumber") || "Enter 10 digit number"}
            placeholderTextColor={theme === "dark" ? "#888" : "#999"}
            keyboardType="number-pad"
            value={phone}
            onChangeText={(text) => handlePhoneChange(text, setPhone)}
          />
        </View>

        <View style={[styles.phoneContainer, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
          <Text style={[styles.prefix, { color: themeColors.text }]}>+91</Text>
          <TextInput
            style={[styles.phoneInput, { color: themeColors.text }]}
            placeholder={t("primaryEmergencyContact") || "Primary Emergency Contact"}
            placeholderTextColor={theme === "dark" ? "#888" : "#999"}
            keyboardType="number-pad"
            value={primaryContact}
            onChangeText={(text) => handlePhoneChange(text, setPrimaryContact)}
          />
        </View>

        <View style={[styles.passwordContainer, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
          <TextInput
            style={[styles.passwordInput, { color: themeColors.text }]}
            placeholder={t("password") || "Password"}
            placeholderTextColor={theme === "dark" ? "#888" : "#999"}
            secureTextEntry={secure1}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure1(!secure1)}>
            <Ionicons name={secure1 ? "eye-off-outline" : "eye-outline"} size={22} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.passwordContainer, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}>
          <TextInput
            style={[styles.passwordInput, { color: themeColors.text }]}
            placeholder={t("confirmPassword") || "Confirm Password"}
            placeholderTextColor={theme === "dark" ? "#888" : "#999"}
            secureTextEntry={secure2}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setSecure2(!secure2)}>
            <Ionicons name={secure2 ? "eye-off-outline" : "eye-outline"} size={22} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.signupButton, { backgroundColor: theme === "dark" ? "#ffffff" : "#000000" }, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={[styles.signupText, { color: theme === "dark" ? "#000000" : "#ffffff" }]}>
            {loading ? t("creating") || "Creating..." : t("signUp") || "Sign Up"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30, textAlign: "center" },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  phoneContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 16 },
  prefix: { marginRight: 8, fontSize: 16, fontWeight: "500" },
  phoneInput: { flex: 1, paddingVertical: 14 },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 16 },
  passwordInput: { flex: 1, paddingVertical: 14 },
  signupButton: { padding: 15, borderRadius: 12, alignItems: "center" },
  signupText: { fontWeight: "600", fontSize: 16 },
});
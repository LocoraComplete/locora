import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
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

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("locationRequired") || "Location Required",
        t("locationPermissionMessage") ||
          "Location permission is required for SOS feature to work."
      );
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      return Alert.alert(
        t("error") || "Error",
        t("fillAllFields") || "Please fill all fields"
      );
    }

    if (!validateEmail(trimmedEmail)) {
      return Alert.alert(
        t("error") || "Error",
        t("invalidEmail") || "Invalid email format"
      );
    }

    try {
      setLoading(true);

      const res = await api.post("/api/users/login", {
        Email: trimmedEmail,
        Password: password,
      });

      console.log("✅ Login response:", res.data);

      await AsyncStorage.setItem("user", JSON.stringify(res.data));

      if (rememberMe) {
        await AsyncStorage.setItem("rememberMe", "true");
      } else {
        await AsyncStorage.setItem("rememberMe", "false");
      }

      requestLocationPermission();
      router.replace("/(tabs)/explore");

    } catch (error: any) {
      Alert.alert(
        t("loginFailed") || "Login Failed",
        error?.response?.data?.message || error.message
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
          LOCORA
        </Text>

        <TextInput
          style={[styles.input, {
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
            color: themeColors.text,
          }]}
          placeholder={t("email") || "Email"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={[styles.passwordContainer, {
          borderColor: themeColors.border,
          backgroundColor: themeColors.card,
        }]}>
          <TextInput
            style={[styles.passwordInput, { color: themeColors.text }]}
            placeholder={t("password") || "Password"}
            placeholderTextColor={theme === "dark" ? "#888" : "#999"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={themeColors.text}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <Ionicons
            name={rememberMe ? "checkbox" : "square-outline"}
            size={22}
            color={themeColors.text}
          />
          <Text style={{ color: themeColors.text, marginLeft: 8 }}>
            {t("rememberMe") || "Remember Me"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: theme === "dark" ? "#ffffff" : "#000000" },
            loading && { opacity: 0.6 },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={[styles.loginText, {
            color: theme === "dark" ? "#000000" : "#ffffff",
          }]}>
            {loading ? t("loggingIn") || "Logging in..." : t("login") || "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={[styles.signupText, { color: "#4F46E5" }]}>
            {t("noAccount") || "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 40 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 14 },
  rememberContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  loginButton: { padding: 15, borderRadius: 12, alignItems: "center", marginTop: 6 },
  loginText: { fontSize: 16, fontWeight: "600" },
  signupText: { textAlign: "center", marginTop: 20, fontSize: 14, fontWeight: "500" },
});
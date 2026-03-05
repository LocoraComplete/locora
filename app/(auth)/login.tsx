import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import api from "../../config/api";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const requestLocationPermission = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Location Required",
        "Location permission is required for SOS feature to work."
      );
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (!validateEmail(trimmedEmail)) {
      return Alert.alert("Error", "Invalid email format");
    }

    try {
      setLoading(true);

      const res = await api.post("/api/users/login", {
        Email: trimmedEmail,
        Password: password,
      });

      await AsyncStorage.setItem("user", JSON.stringify(res.data));

      Alert.alert(
        "Success",
        `Welcome ${res.data.Name}`,
        [
          {
            text: "Continue",
            onPress: async () => {
              const permissionGranted =
                await requestLocationPermission();

              if (permissionGranted) {
                router.replace("/explore");
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: themeColors.text },
        ]}
      >
        LOCORA
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
            color: themeColors.text,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={
          theme === "dark" ? "#888" : "#999"
        }
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View
        style={[
          styles.passwordContainer,
          {
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
          },
        ]}
      >
        <TextInput
          style={[
            styles.passwordInput,
            { color: themeColors.text },
          ]}
          placeholder="Password"
          placeholderTextColor={
            theme === "dark" ? "#888" : "#999"
          }
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
        style={[
          styles.loginButton,
          {
            backgroundColor:
              theme === "dark" ? "#ffffff" : "#000000",
          },
          loading && { opacity: 0.6 },
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text
          style={[
            styles.loginText,
            {
              color:
                theme === "dark" ? "#000000" : "#ffffff",
            },
          ]}
        >
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text
          style={[
            styles.signupText,
            { color: "#4F46E5" },
          ]}
        >
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },
  loginButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    fontWeight: "500",
  },
});
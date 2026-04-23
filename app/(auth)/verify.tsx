import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../config/api";
import { colors } from "../../config/colors";
import { useTheme } from "../../context/themecontext";

export default function Verify() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) return Alert.alert("Enter OTP");

    try {
      setLoading(true);

      await api.post("/api/users/verify-otp", {
        Email: email,
        otp,
      });

      Alert.alert("Success", "Email verified successfully");
      router.replace("/(auth)/login");

    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post("/api/users/resend-otp", { Email: email });
      Alert.alert("OTP sent again");
    } catch {
      Alert.alert("Failed to resend OTP");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>
        Verify Email
      </Text>

      <Text style={{ color: themeColors.text, marginBottom: 20 }}>
        OTP sent to {email}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: themeColors.border,
            color: themeColors.text,
          },
        ]}
        placeholder="Enter OTP"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resendOtp}>
        <Text style={{ color: "#4F46E5", marginTop: 15 }}>
          Resend OTP
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
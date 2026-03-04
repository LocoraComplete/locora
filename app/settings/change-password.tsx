import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useLocalSearchParams } from "expo-router"; // ✅ correct hook

export default function ChangePassword() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  // ✅ Get userId from route params
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!userId) {
      Alert.alert(t("error"), "User ID is missing!");
      return;
    }

    // 1️⃣ Frontend validation
    if (!oldPassword || !newPassword) {
      Alert.alert(t("error"), t("fillAllFields"));
      return;
    }
    if (oldPassword.length < 6) {
      Alert.alert(t("invalidPassword"), t("oldPasswordMin6"));
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(t("invalidPassword"), t("newPasswordMin6"));
      return;
    }
    if (oldPassword === newPassword) {
      Alert.alert(t("invalidPassword"), t("passwordsCannotMatch"));
      return;
    }

    try {
      setLoading(true);

      // 2️⃣ Verify old password
      const response = await fetch(
        `https://locora-backend.onrender.com/api/users/${userId}/check-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword }),
        }
      );

      let data: any = null;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Invalid JSON response:", text);
        Alert.alert(t("error"), t("somethingWentWrong"));
        setLoading(false);
        return;
      }

      if (!data.valid) {
        Alert.alert(t("error"), t("oldPasswordIncorrect"));
        setLoading(false);
        return;
      }

      // 3️⃣ Update password
      const updateResponse = await fetch(
        `https://locora-backend.onrender.com/api/users/${userId}/update-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      let updateData: any = null;
      const updateText = await updateResponse.text();
      try {
        updateData = JSON.parse(updateText);
      } catch {
        console.log("Invalid JSON response:", updateText);
        Alert.alert(t("error"), t("somethingWentWrong"));
        setLoading(false);
        return;
      }

      if (updateData.success) {
        Alert.alert(t("success"), t("passwordChanged"));
        setOldPassword("");
        setNewPassword("");
      } else {
        Alert.alert(t("error"), t("somethingWentWrong"));
      }
    } catch (err) {
      console.log(err);
      Alert.alert(t("error"), t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.label, { color: theme === "dark" ? "#bbb" : "#555" }]}>
        {t("oldPassword") || "Old Password"}
      </Text>

      <TextInput
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholder={t("enterOldPassword") || "Enter old password"}
        style={[
          styles.input,
          {
            backgroundColor: theme === "dark" ? "#1c1c1e" : "#f7f7f7",
            borderColor: theme === "dark" ? "#333" : "#ddd",
            color: themeColors.text,
          },
        ]}
        placeholderTextColor={theme === "dark" ? "#888" : "#999"}
      />

      <Text style={[styles.label, { color: theme === "dark" ? "#bbb" : "#555" }]}>
        {t("newPassword") || "New Password"}
      </Text>

      <TextInput
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder={t("enterNewPassword") || "Enter new password"}
        style={[
          styles.input,
          {
            backgroundColor: theme === "dark" ? "#1c1c1e" : "#f7f7f7",
            borderColor: theme === "dark" ? "#333" : "#ddd",
            color: themeColors.text,
          },
        ]}
        placeholderTextColor={theme === "dark" ? "#888" : "#999"}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme === "dark" ? "#fff" : "#000" }]}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme === "dark" ? "#000" : "#fff" }]}>
          {loading ? t("updating") : t("updatePassword")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 20 },
  button: { padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { fontWeight: "600" },
});
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

export default function ChangePassword() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!userId) return Alert.alert(t("error") || "Error", t("userIdMissing") || "User ID missing!");

    if (!oldPassword || !newPassword)
      return Alert.alert(t("error") || "Error", t("fillAllFields") || "Please fill all fields");

    if (oldPassword.length < 6)
      return Alert.alert(t("invalidPassword") || "Invalid Password", t("oldPasswordMin6") || "Old password must be at least 6 characters");

    if (newPassword.length < 6)
      return Alert.alert(t("invalidPassword") || "Invalid Password", t("newPasswordMin6") || "New password must be at least 6 characters");

    if (oldPassword === newPassword)
      return Alert.alert(t("invalidPassword") || "Invalid Password", t("passwordsCannotMatch") || "Old and new passwords cannot match");

    try {
      setLoading(true);

      const checkResponse = await fetch(
        `https://locora-backend.onrender.com/api/users/check-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, oldPassword }),
        }
      );

      let checkData: any;
      const text = await checkResponse.text();

      try {
        checkData = JSON.parse(text);
      } catch {
        console.log("Check password invalid JSON response:", text);
        Alert.alert(t("error") || "Error", t("serverInvalidResponse") || "Server returned invalid response");
        setLoading(false);
        return;
      }

      if (!checkData.valid) {
        Alert.alert(t("error") || "Error", checkData.message || t("oldPasswordIncorrect") || "Old password is incorrect");
        setLoading(false);
        return;
      }

      const updateResponse = await fetch(
        `https://locora-backend.onrender.com/api/users/update-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, oldPassword, newPassword }),
        }
      );

      let updateData: any;

      try {
        updateData = await updateResponse.json();
      } catch {
        const text = await updateResponse.text();
        console.log("Update password error:", text);
        Alert.alert(t("error") || "Error", t("serverInvalidResponse") || "Server returned invalid response");
        setLoading(false);
        return;
      }

      if (updateData.success) {
        Alert.alert(t("success") || "Success", t("passwordChanged") || "Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        Alert.alert(t("error") || "Error", updateData.message || t("somethingWentWrong") || "Something went wrong");
      }
    } catch (err) {
      console.log("Password change error:", err);
      Alert.alert(t("error") || "Error", t("somethingWentWrong") || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.label, { color: theme === "dark" ? "#bbb" : "#555" }]}>
        {t("oldPassword") || "Old Password"}
      </Text>

      <View
        style={[
          styles.passwordContainer,
          {
            borderColor: theme === "dark" ? "#333" : "#ddd",
            backgroundColor: theme === "dark" ? "#1c1c1e" : "#f7f7f7",
          },
        ]}
      >
        <TextInput
          style={[styles.passwordInput, { color: themeColors.text }]}
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder={t("enterOldPassword") || "Enter old password"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          secureTextEntry={!showOldPassword}
        />
        <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
          <Ionicons name={showOldPassword ? "eye-outline" : "eye-off-outline"} size={22} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: theme === "dark" ? "#bbb" : "#555" }]}>
        {t("newPassword") || "New Password"}
      </Text>

      <View
        style={[
          styles.passwordContainer,
          {
            borderColor: theme === "dark" ? "#333" : "#ddd",
            backgroundColor: theme === "dark" ? "#1c1c1e" : "#f7f7f7",
          },
        ]}
      >
        <TextInput
          style={[styles.passwordInput, { color: themeColors.text }]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t("enterNewPassword") || "Enter new password"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          secureTextEntry={!showNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Ionicons name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={22} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme === "dark" ? "#fff" : "#000" }]}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme === "dark" ? "#000" : "#fff" }]}>
          {loading ? (t("updating") || "Updating...") : (t("updatePassword") || "Update Password")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 14, marginBottom: 6 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  passwordInput: { flex: 1, paddingVertical: 12 },
  button: { padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { fontWeight: "600" },
});
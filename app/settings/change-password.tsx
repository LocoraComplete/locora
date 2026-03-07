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
    if (!userId) {
      Alert.alert(t("error"), "User ID is missing!");
      return;
    }

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

      const response = await fetch(
        `http://10.115.189.72:5000/api/users/${userId}/check-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword }),
        }
      );

      const text = await response.text();
      let data: any = null;
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

      const updateResponse = await fetch(
        `http://10.115.189.72:5000/api/users/${userId}/update-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      const updateText = await updateResponse.text();
      let updateData: any = null;
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
          <Ionicons
            name={showOldPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color={themeColors.text}
          />
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
          <Ionicons
            name={showNewPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color={themeColors.text}
          />
        </TouchableOpacity>
      </View>

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
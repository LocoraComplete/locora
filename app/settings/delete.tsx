import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../../config/api";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

export default function DeleteAccount() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    console.log("DELETE BUTTON PRESSED");

    try {
      const storedUser = await AsyncStorage.getItem("user");
      console.log("Stored user:", storedUser);

      if (!storedUser) {
        Alert.alert(
          t("error") || "Error",
          t("userNotFound") || "User or UserId not found"
        );
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user?.UserId) {
        Alert.alert("Error", "Invalid user data");
        return;
      }

      Alert.alert(
        t("deleteAccount") || "Delete Account",
        t("confirmDeleteAccount") ||
          "Are you sure you want to permanently delete your account?",
        [
          { text: t("cancel") || "Cancel", style: "cancel" },
          {
            text: t("delete") || "Delete",
            style: "destructive",
            onPress: async () => {
              setLoading(true);

              try {
                const res = await api.delete(`/api/users/delete/${user.UserId}`);
                console.log("Delete response:", res.data);

                if (res.status === 200) {
                  console.log("Account deleted successfully.");

                  await AsyncStorage.removeItem("user");

                  Alert.alert(
                    t("success") || "Success",
                    t("accountDeleted") || "Your account has been deleted"
                  );

                  router.replace("/(auth)/login");
                } else {
                  Alert.alert(
                    t("error") || "Error",
                    t("deleteFailed") || "Failed to delete account"
                  );
                }
              } catch (err: any) {
                console.log("DELETE ERROR FULL:", err);

                Alert.alert(
                  t("error") || "Error",
                  err?.response?.data?.message ||
                    err.message ||
                    (t("deleteFailed") || "Failed to delete account")
                );
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log("Delete setup error:", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.warningText, { color: themeColors.text }]}>
          Deleting your account is permanent and cannot be undone.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={themeColors.text} />
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.deleteButton,
              { backgroundColor: theme === "dark" ? "#ff4d4f" : "#C70000" },
            ]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>
              {t("deleteMyAccount") || "Delete My Account"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  warningText: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 15,
  },

  deleteButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
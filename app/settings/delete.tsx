import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import api from "../../config/api";
import { colors } from "../../config/colors";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";

export default function DeleteAccount() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);

  // ✅ Get user from AsyncStorage
  const getUser = async () => {
    try {
      const stored = await AsyncStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      console.log("AsyncStorage user:", parsed);
      return parsed;
    } catch (err) {
      console.log("Error reading AsyncStorage user:", err);
      return null;
    }
  };

  // ✅ Delete account function
  const handleDeleteAccount = async () => {
    const user = await getUser();

    if (!user || !user.UserId) {
      Alert.alert(
        t("error") || "Error",
        `${t("userNotFound") || "User or UserId not found"}`
      );
      return;
    }

    console.log("Attempting to delete account for UserId:", user.UserId);

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
              console.log("DELETE RESPONSE FULL:", res);

              if (res.status === 200) {
                console.log("Account deleted successfully.");
                await AsyncStorage.removeItem("user");

                Alert.alert(
                  t("success") || "Success",
                  t("accountDeleted") || "Your account has been deleted"
                );

                router.replace("/(auth)/login");
              } else {
                console.log("Delete returned non-200 status:", res.status);

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
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.text} />
      ) : (
        <>
          {/* ✅ Main Delete Button */}
          <TouchableOpacity
            style={[
              styles.deleteButton,
              {
                backgroundColor: theme === "dark" ? "#ff4d4f" : "#C70000",
              },
            ]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>
              {t("deleteMyAccount") || "Delete My Account"}
            </Text>
          </TouchableOpacity>

          {/* 🔹 Hardcoded Test Button */}
          <TouchableOpacity
            style={[
              styles.deleteButton,
              {
                backgroundColor: theme === "dark" ? "#555" : "#999",
                marginTop: 20,
              },
            ]}
            onPress={async () => {
              setLoading(true);
              try {
                const testId = "U003";
                console.log("Hardcoded DELETE test for UserId:", testId);

                const res = await api.delete(`/api/users/delete/${testId}`);

                console.log("HARDCODE DELETE RESPONSE:", res.data);

                Alert.alert(
                  t("testResponse") || "Test Response",
                  JSON.stringify(res.data)
                );
              } catch (e) {
                console.log("HARDCODE DELETE ERROR:", e);

                Alert.alert(
                  t("error") || "Error",
                  t("deleteFailed") || "Failed to delete account"
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text style={styles.deleteText}>
              {t("testDeleteButton") || "Test Delete Hardcoded"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
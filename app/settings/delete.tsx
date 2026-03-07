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

export default function DeleteAccount() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
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
        "Error",
        `User or UserId not found. Current stored user: ${JSON.stringify(
          user
        )}`
      );
      return;
    }

    console.log("Attempting to delete account for UserId:", user.UserId);

    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // 🔹 Axios DELETE request
              const res = await api.delete(`/api/users/delete/${user.UserId}`);
              console.log("DELETE RESPONSE FULL:", res);

              if (res.status === 200) {
                console.log("Account deleted successfully.");
                await AsyncStorage.removeItem("user");
                Alert.alert("Success", "Your account has been deleted");
                router.replace("/(auth)/login");
              } else {
                console.log("Delete returned non-200 status:", res.status);
                Alert.alert("Error", "Failed to delete account");
              }
            } catch (err: any) {
              console.log("DELETE ERROR FULL:", err);
              Alert.alert(
                "Error",
                err?.response?.data?.message ||
                  err.message ||
                  "Failed to delete account"
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
            <Text style={styles.deleteText}>Delete My Account</Text>
          </TouchableOpacity>

          {/* 🔹 Hardcoded Test Button */}
          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: theme === "dark" ? "#555" : "#999", marginTop: 20 },
            ]}
            onPress={async () => {
              setLoading(true);
              try {
                const testId = "U003"; // Hardcoded user for test
                console.log("Hardcoded DELETE test for UserId:", testId);
                const res = await api.delete(`/api/users/delete/${testId}`);
                console.log("HARDCODE DELETE RESPONSE:", res.data);
                Alert.alert("Hardcoded DELETE Response", JSON.stringify(res.data));
              } catch (e) {
                console.log("HARDCODE DELETE ERROR:", e);
                Alert.alert("Hardcoded DELETE Error", JSON.stringify(e));
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text style={styles.deleteText}>Test Delete Hardcoded</Text>
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
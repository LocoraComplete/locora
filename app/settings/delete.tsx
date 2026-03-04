import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/themecontext";

// ✅ If you use axios
import axios from "axios";

import { colors } from "../../config/colors";

export default function DeleteAccount() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];

  // Get user from AsyncStorage
  const getUser = async () => {
    const stored = await AsyncStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  };

  const handleDeleteAccount = async () => {
    const user = await getUser();
    if (!user?.UserId) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Replace with your backend URL
              await axios.delete(`https://locora-backend.onrender.com/api/users/delete/${user.UserId}`);

              await AsyncStorage.removeItem("user");

              router.replace("/(auth)/login");
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.response?.data?.message || "Failed to delete account"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.deleteButton,
          {
            backgroundColor: theme === "dark" ? "#ff4d4f" : "#C70000",
          },
        ]}
        onPress={handleDeleteAccount} // ✅ fixed
      >
        <Text style={styles.deleteText}>Delete My Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});
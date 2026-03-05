import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";

export default function Logout() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          router.replace("/(auth)/login");
        },
      },
    ]);
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
          styles.button,
          {
            backgroundColor:
              theme === "dark" ? "#fff" : "#000",
          },
        ]}
        onPress={handleLogout}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                theme === "dark" ? "#000" : "#fff",
            },
          ]}
        >
          Confirm Logout
        </Text>
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
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
  },
});
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/api";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type User = {
  UserId: string;
  Handle: string;
  Name: string;
};

type ThemeMode = "light" | "dark" | "system";

export default function Profile() {
  const router = useRouter();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // LOAD USER
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!storedUser) {
          router.replace("/(auth)/login");
          return;
        }

        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.log("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setSettingsOpen(false);
      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = () => {
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
              if (!user?.UserId) {
                Alert.alert("Error", "User ID not found");
                return;
              }

              await api.delete(`/api/users/delete/${user.UserId}`);
              await AsyncStorage.removeItem("user");

              setSettingsOpen(false);
              router.replace("/(auth)/login");

            } catch (error: any) {
              console.log("DELETE ERROR:", error?.response?.data || error);
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

  if (loading) {
    return <SafeAreaView style={styles.loadingScreen} />;
  }

  if (!user) return null;

  const themeModes: ThemeMode[] = ["light", "dark", "system"];

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.username}>{user.Handle}</Text>

            <TouchableOpacity onPress={() => setSettingsOpen(true)}>
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#888" />
              </View>
            </View>
          </View>

          <View style={styles.bioBox}>
            <Text style={styles.name}>{user.Name}</Text>
            <Text style={styles.bio}>Welcome to Locora 🌍</Text>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* SETTINGS MODAL */}
      <Modal
        visible={settingsOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSettingsOpen(false)}
        />

        <View style={styles.settingsSheet}>
          <Text style={styles.settingsTitle}>Settings</Text>

          {themeModes.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={styles.optionRow}
              onPress={() => setThemeMode(mode)}
            >
              <Text style={styles.optionText}>{mode}</Text>
              {themeMode === mode && (
                <Ionicons name="checkmark" size={18} color="#000" />
              )}
            </TouchableOpacity>
          ))}

          {/* DELETE */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={handleDeleteAccount}
          >
            <View style={styles.deleteRow}>
              <Ionicons name="trash-outline" size={16} color="#C70000" />
              <Text style={[styles.optionText, { color: "#C70000" }]}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={handleLogout}
          >
            <Text style={{ fontWeight: "700" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  loadingScreen: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  username: { fontSize: 18, fontWeight: "900" },
  profileRow: { marginBottom: 16 },
  avatarWrapper: { alignItems: "center" },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },
  bioBox: { marginTop: 10, alignItems: "center" },
  name: { fontWeight: "900", fontSize: 15 },
  bio: { marginTop: 4, color: "#555" },
  modalOverlay: { flex: 1, backgroundColor: "#00000055" },
  settingsSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
  },
  settingsTitle: { fontWeight: "900", fontSize: 16, marginBottom: 12 },
  optionRow: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: { fontSize: 14, fontWeight: "600" },
  deleteRow: { flexDirection: "row", alignItems: "center", gap: 6 },
});
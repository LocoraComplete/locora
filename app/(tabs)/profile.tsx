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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setSettingsOpen(false);
    router.replace("/(auth)/login");
  };

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

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} />;
  if (!user) return null;

  const themeModes: ThemeMode[] = ["light", "dark", "system"];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.username}>{user.Handle}</Text>
            <TouchableOpacity onPress={() => setSettingsOpen(true)}>
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* PROFILE ROW */}
          <View style={styles.profileRow}>

            {/* AVATAR */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarBorder}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#999" />
                </View>
              </View>

              <View style={styles.plusIcon}>
                <Ionicons name="add" size={16} color="#fff" />
              </View>
            </View>

            {/* STATS */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* NAME + BIO */}
          <View style={styles.bioBox}>
            <Text style={styles.name}>{user.Name}</Text>
            <Text style={styles.bio}>Welcome to Locora 🌍</Text>
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
               style={styles.outlineButton}
                onPress={() => router.push("/profile")}
             >
             <Text style={styles.buttonText}>Edit Profile</Text>
             </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.buttonText}>Add Post</Text>
            </TouchableOpacity>
          </View>

          {/* NO POSTS */}
          <View style={styles.noPostsContainer}>
            <Text style={styles.noPostsText}>No posts yet</Text>
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

          <TouchableOpacity style={styles.optionRow} onPress={handleDeleteAccount}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="trash-outline" size={16} color="#C70000" />
              <Text style={[styles.optionText, { color: "#C70000" }]}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
            <Text style={{ fontWeight: "700" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  username: {
    fontSize: 18,
    fontWeight: "900",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatarBorder: {
    borderWidth: 3,
    borderColor: "#F4B400",
    borderRadius: 50,
    padding: 3,
  },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },

  plusIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#F4B400",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontWeight: "900",
    fontSize: 16,
  },

  statLabel: {
    fontSize: 12,
    color: "#555",
  },

  bioBox: {
    marginTop: 10,
  },

  name: {
    fontWeight: "900",
    fontSize: 15,
  },

  bio: {
    marginTop: 4,
    color: "#555",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },

  buttonText: {
    fontWeight: "600",
  },

  noPostsContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  noPostsText: {
    color: "#777",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
  },

  settingsSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
  },

  settingsTitle: {
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 12,
  },

  optionRow: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
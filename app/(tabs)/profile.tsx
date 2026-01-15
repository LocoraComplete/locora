import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(
    "system"
  );
  const [user, setUser] = useState<any>(null);

  // 🔹 Load user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  // 🔹 Prevent crash while loading
  if (!user) return null;

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.username}>{user.Handle}</Text>

            <TouchableOpacity onPress={() => setSettingsOpen(true)}>
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Profile Row */}
          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
              {/* ✅ SAFE PLACEHOLDER AVATAR */}
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#888" />
              </View>

              <View style={styles.addBadge}>
                <Ionicons name="add" size={14} color="#fff" />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioBox}>
            <Text style={styles.name}>{user.Name}</Text>
            <Text style={styles.bio}>Welcome to Locora 🌍</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="create-outline" size={14} />
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="add-circle-outline" size={14} />
              <Text style={styles.actionText}>Add Post</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            No posts yet
          </Text>
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

          <View style={styles.settingsGroup}>
            <Text style={styles.groupLabel}>Mode</Text>

            {["light", "dark", "system"].map((m) => (
              <TouchableOpacity
                key={m}
                style={styles.optionRow}
                onPress={() => setThemeMode(m as any)}
              >
                <Text style={styles.optionText}>
                  {m === "system"
                    ? "Default (System)"
                    : m[0].toUpperCase() + m.slice(1)}
                </Text>

                {themeMode === m && (
                  <Ionicons name="checkmark" size={18} color="#000" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={[styles.optionText, { color: "#C70000" }]}>
              Logout
            </Text>
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
    marginBottom: 12,
  },

  username: { fontSize: 18, fontWeight: "900" },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginBottom: 16,
  },

  avatarWrapper: { position: "relative" },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#e6a100",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },

  addBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#e6a100",
    borderRadius: 50,
    padding: 4,
  },

  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statBox: { alignItems: "center" },

  statNumber: { fontSize: 18, fontWeight: "900" },

  statLabel: { fontSize: 10, fontWeight: "700", color: "#777" },

  bioBox: { marginTop: 10 },

  name: { fontWeight: "900", fontSize: 15, textAlign: "center" },

  bio: { textAlign: "center", marginTop: 4, color: "#555" },

  buttonRow: { flexDirection: "row", gap: 10, marginVertical: 18 },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
  },

  actionText: { fontWeight: "700", fontSize: 12 },

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

  settingsGroup: { marginBottom: 10 },

  groupLabel: { fontWeight: "800", marginBottom: 4, color: "#444" },

  optionRow: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  optionText: { fontSize: 14, fontWeight: "600" },
});



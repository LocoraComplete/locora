import React, { useState } from "react";
import {
  View,
  Text,
  Image,
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

  const user = {
    username: "kashish",
    name: "Kashish Chawla",
    bio: "Exploring Rajasthan one city at a time 🕌✨",
    pic: require("../../assets/images/test.png"),
    stats: { posts: 4, followers: "1.1k", following: "230" },
    posts: [
      require("../../assets/images/post1.jpg"),
      require("../../assets/images/post2.jpg"),
      require("../../assets/images/post3.jpg"),
      require("../../assets/images/post1.jpg"),
    ],
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.username}>@{user.username}</Text>

            <TouchableOpacity onPress={() => setSettingsOpen(true)}>
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Profile Row */}
          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
              <Image source={user.pic} style={styles.avatar} />
              <View style={styles.addBadge}>
                <Ionicons name="add" size={14} color="#fff" />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{user.stats.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{user.stats.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{user.stats.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioBox}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.bio}>{user.bio}</Text>
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

          {/* Section Label */}
          <View style={styles.sectionHeader}>
            <Ionicons name="grid-outline" size={16} />
            <Text style={styles.sectionText}>My Posts</Text>
          </View>

          {/* Posts Grid */}
          <View style={styles.grid}>
            {user.posts.map((p, i) => (
              <Image key={i} source={p} style={styles.post} />
            ))}
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

          {/* Theme Mode */}
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

          {/* Policy Links */}
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Terms of Service</Text>
          </TouchableOpacity>

          {/* Account Section */}
          <TouchableOpacity style={styles.optionRow}>
            <Text style={[styles.optionText, { color: "#C70000" }]}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Text style={[styles.optionText, { color: "#b00000" }]}>
              Delete Account
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
    paddingHorizontal: 16, // horizontal padding only, top handled by SafeAreaView
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  username: { fontSize: 18, fontWeight: "900" },

  profileRow: { flexDirection: "row", alignItems: "center", gap: 18, marginBottom: 16 },

  avatarWrapper: { position: "relative" },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#e6a100",
  },

  addBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#e6a100",
    borderRadius: 50,
    padding: 4,
  },

  statsRow: { flex: 1, flexDirection: "row", justifyContent: "space-around" },

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

  sectionHeader: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginBottom: 6,
  },

  sectionText: { fontWeight: "900", fontSize: 12 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  post: {
    width: "32%",
    aspectRatio: 1,
    borderRadius: 8,
  },

  // SETTINGS SHEET
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

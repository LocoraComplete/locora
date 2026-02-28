import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function GroupInfo() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!chatId) return;
    loadInitialData();
  }, [chatId]);

  const loadInitialData = async () => {
    await loadCurrentUser();
    await loadDetails();
    await loadOnline();
  };

  const loadCurrentUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    } catch (err) {
      console.log("User load error:", err);
    }
  };

  const loadDetails = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/details/${chatId}`
      );
      setGroup(res.data);
    } catch (err) {
      console.log("Error loading group:", err);
    }
  };

  const loadOnline = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/online/${chatId}`
      );
      setOnlineUsers(res.data.online || []);
    } catch (err) {
      console.log("Error loading online users:", err);
    }
  };

  const handleLeaveGroup = () => {
    if (!currentUser?.UserId) return;

    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/api/chat/leave/${chatId}`,
                {
                  data: { userId: currentUser.UserId },
                }
              );

              Alert.alert("Success", "You left the group");
              router.replace("/(tabs)/chat");
            } catch (err: any) {
              console.log("Leave error:", err?.response?.data || err);
              Alert.alert(
                "Error",
                err?.response?.data?.message ||
                  "Failed to leave group"
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    if (!currentUser?.UserId) return;

    Alert.alert(
      "Delete Group",
      "This action cannot be undone. Delete this group permanently?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/api/chat/delete/${chatId}`,
                {
                  data: { userId: currentUser.UserId }, // ✅ FIXED
                }
              );

              Alert.alert("Deleted", "Group deleted successfully");
              router.replace("/(tabs)/chat");
            } catch (err: any) {
              console.log("Delete error:", err?.response?.data || err);
              Alert.alert(
                "Error",
                err?.response?.data?.message ||
                  "Failed to delete group"
              );
            }
          },
        },
      ]
    );
  };

  if (!group || !currentUser) return null;

  const isAdmin = group.CreatedBy === currentUser.UserId;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{group.GroupName}</Text>
      <Text style={styles.desc}>{group.Description}</Text>

      <Text style={styles.section}>
        Members ({group.TotalMembers})
      </Text>

      {group.Members?.map((member: any) => {
        const isOnline = onlineUsers.includes(member.UserId);

        return (
          <View key={member.UserId} style={styles.memberRow}>
            <Text>{member.Handle}</Text>
            <Text style={{ color: isOnline ? "green" : "gray" }}>
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        );
      })}

      {/* Leave Group Button */}
      <Pressable style={styles.leaveBtn} onPress={handleLeaveGroup}>
        <Text style={styles.leaveText}>Leave Group</Text>
      </Pressable>

      {/* Delete Group Button (Admin Only) */}
      {isAdmin && (
        <Pressable style={styles.deleteBtn} onPress={handleDeleteGroup}>
          <Text style={styles.deleteText}>Delete Group</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  desc: { marginVertical: 10, color: "#666" },
  section: { marginTop: 20, fontWeight: "bold" },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  leaveBtn: {
    marginTop: 30,
    padding: 14,
    backgroundColor: "#ff9800",
    borderRadius: 8,
    alignItems: "center",
  },
  leaveText: {
    color: "white",
    fontWeight: "bold",
  },

  deleteBtn: {
    marginTop: 15,
    padding: 14,
    backgroundColor: "#e53935",
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
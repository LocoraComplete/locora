import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text
} from "react-native";

export default function ChatInfo() {
  const { chatId, isPrivate, otherUserId } = useLocalSearchParams();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatData, setChatData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const privateChat = isPrivate === "true";

  useFocusEffect(
    useCallback(() => {
      if (chatId) loadData();
    }, [chatId])
  );

  const loadData = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("user");
      if (stored) setCurrentUser(JSON.parse(stored));

      const res = await axios.get(
        `${API_BASE_URL}/api/chat/details/${chatId}`
      );

      setChatData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    await axios.delete(`${API_BASE_URL}/api/chat/leave/${chatId}`, {
      data: { userId: currentUser.UserId },
    });
    router.replace("/(tabs)/chat");
  };

  const handleDeleteGroup = async () => {
    await axios.delete(`${API_BASE_URL}/api/chat/delete/${chatId}`, {
      data: { userId: currentUser.UserId },
    });
    router.replace("/(tabs)/chat");
  };

  if (loading) return <ActivityIndicator />;

  if (!chatData) return null;

  const isAdmin = chatData.CreatedBy === currentUser?.UserId;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {privateChat ? "Private Chat" : chatData.GroupName}
      </Text>

      {!privateChat && (
        <>
          <Pressable style={styles.leaveBtn} onPress={handleLeaveGroup}>
            <Text style={styles.btnText}>Leave Group</Text>
          </Pressable>

          {isAdmin && (
            <Pressable style={styles.deleteBtn} onPress={handleDeleteGroup}>
              <Text style={styles.btnText}>Delete Group</Text>
            </Pressable>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  leaveBtn: {
    marginTop: 30,
    padding: 14,
    backgroundColor: "#ff9800",
    borderRadius: 8,
    alignItems: "center",
  },
  deleteBtn: {
    marginTop: 15,
    padding: 14,
    backgroundColor: "#e53935",
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
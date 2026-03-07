import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ChatInfo() {
  const { chatId, isPrivate } = useLocalSearchParams();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatData, setChatData] = useState<any>(null);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const privateChat = isPrivate === "true";

  useFocusEffect(
    useCallback(() => {
      if (chatId) loadData();
    }, [chatId])
  );

  useEffect(() => {
    if (!chatId || privateChat) return;

    const interval = setInterval(() => {
      fetchOnlineMembers();
    }, 5000);

    return () => clearInterval(interval);
  }, [chatId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem("user");
      if (stored) setCurrentUser(JSON.parse(stored));

      if (!privateChat) {
        const res = await axios.get(
          `${API_BASE_URL}/api/chat/details/${chatId}`
        );

        setChatData(res.data);
        fetchOnlineMembers(res.data.Members.map((m: any) => m.UserId));
      }
    } catch (err) {
      console.log("Chat info load error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineMembers = async (memberIds?: string[]) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/online/${chatId}`
      );

      setOnlineMembers(res.data.online);
    } catch (err) {
      console.log("Online members fetch error", err);
    }
  };

  /* LEAVE GROUP */
  const handleLeaveGroup = () => {
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

              router.replace("/(tabs)/chat");
            } catch {
              Alert.alert("Failed to leave group");
            }
          },
        },
      ]
    );
  };

  /* DELETE GROUP (ADMIN) */
  const handleDeleteGroup = () => {
    Alert.alert(
      "Delete Group",
      "This will permanently delete the group and all chat history.",
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
                  data: { userId: currentUser.UserId },
                }
              );

              router.replace("/(tabs)/chat");
            } catch {
              Alert.alert("Failed to delete group");
            }
          },
        },
      ]
    );
  };

  /* DELETE PRIVATE CHAT */
  const handleDeletePrivateChat = () => {
    Alert.alert(
      "Delete Chat",
      "This will remove the conversation and all messages.",
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
                  data: { userId: currentUser.UserId },
                }
              );

              router.replace("/(tabs)/chat");
            } catch {
              Alert.alert("Failed to delete chat");
            }
          },
        },
      ]
    );
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!chatData && !privateChat) return null;

  const isAdmin = chatData?.CreatedBy === currentUser?.UserId;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {privateChat ? "Private Chat" : chatData.GroupName}
      </Text>

      {/* PRIVATE CHAT OPTIONS */}
      {privateChat && (
        <Pressable
          style={styles.deleteBtn}
          onPress={handleDeletePrivateChat}
        >
          <Text style={styles.btnText}>Delete Chat</Text>
        </Pressable>
      )}

      {/* GROUP INFO */}
      {!privateChat && (
        <>
          <Text style={styles.subtitle}>
            Members ({chatData.TotalMembers})
          </Text>

          <FlatList
            data={chatData.Members}
            keyExtractor={(item) => item.UserId}
            renderItem={({ item }) => {
              const online = onlineMembers.includes(item.UserId);

              return (
                <Pressable
                  onPress={() =>
                    router.push(`/profile/${item.UserId}`)
                  }
                  style={styles.memberRow}
                >
                  <Text
                    style={[
                      styles.memberHandle,
                      item.UserId === currentUser?.UserId
                        ? { fontWeight: "bold" }
                        : {},
                    ]}
                  >
                    {item.Handle}
                  </Text>

                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: online ? "#4caf50" : "#bbb" },
                    ]}
                  />
                </Pressable>
              );
            }}
          />

          <Pressable style={styles.leaveBtn} onPress={handleLeaveGroup}>
            <Text style={styles.btnText}>Leave Group</Text>
          </Pressable>

          {isAdmin && (
            <Pressable
              style={styles.deleteBtn}
              onPress={handleDeleteGroup}
            >
              <Text style={styles.btnText}>Delete Group</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },

  memberHandle: {
    fontSize: 16,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

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

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
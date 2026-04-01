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

import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

export default function ChatInfo() {
  const { chatId, isPrivate } = useLocalSearchParams();
  const router = useRouter();

  const { theme } = useTheme();
  const themeColors = colors[theme];

  const { t } = useLanguage();

  const leaveTextColor = theme === "dark" ? "#fbbf24" : "#d97706";
  const deleteTextColor = theme === "dark" ? "#f87171" : "#dc2626";

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

  const handleLeaveGroup = () => {
    Alert.alert(
      t("leaveGroup") || "Leave Group",
      t("leaveGroupConfirm") || "Are you sure you want to leave this group?",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("leave") || "Leave",
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
              Alert.alert(t("leaveFailed") || "Failed to leave group");
            }
          },
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      t("deleteGroup") || "Delete Group",
      t("deleteGroupConfirm") ||
        "This will permanently delete the group and all chat history.",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("delete") || "Delete",
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
              Alert.alert(t("deleteGroupFailed") || "Failed to delete group");
            }
          },
        },
      ]
    );
  };

  const handleDeletePrivateChat = () => {
    Alert.alert(
      t("deleteChat") || "Delete Chat",
      t("deleteChatConfirm") ||
        "This will remove the conversation and all messages.",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("delete") || "Delete",
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
              Alert.alert(t("deleteChatFailed") || "Failed to delete chat");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.text} />
      </View>
    );
  }

  if (!chatData && !privateChat) return null;

  const isAdmin = chatData?.CreatedBy === currentUser?.UserId;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <View
        style={[
          styles.groupHeader,
          { borderBottomColor: themeColors.border },
        ]}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {privateChat
            ? t("privateChat") || "Private Chat"
            : chatData?.GroupName}
        </Text>

        {!privateChat && (
          <>
            <Text
              style={[
                styles.description,
                { color: themeColors.secondaryText || "#666" },
              ]}
            >
              {chatData?.Description?.trim()
                ? chatData.Description
                : "No group description"}
            </Text>

            <Text
              style={[
                styles.createdText,
                { color: themeColors.secondaryText || "#888" },
              ]}
            >
              Created on{" "}
              {chatData?.CreatedOn
                ? new Date(chatData.CreatedOn).toDateString()
                : ""}
            </Text>
          </>
        )}
      </View>

      {privateChat && (
        <Pressable
          style={[styles.actionBtn, { borderColor: themeColors.border }]}
          onPress={handleDeletePrivateChat}
        >
          <Text style={[styles.actionText, { color: deleteTextColor }]}>
            {t("deleteChat") || "Delete Chat"}
          </Text>
        </Pressable>
      )}

      {!privateChat && (
        <>
          <Text style={[styles.subtitle, { color: themeColors.text }]}>
            {t("members") || "Members"} ({chatData.TotalMembers})
          </Text>

          <FlatList
            data={chatData.Members}
            keyExtractor={(item) => item.UserId}
            renderItem={({ item }) => {
              const online = onlineMembers.includes(item.UserId);

              return (
                <Pressable
                  onPress={() => router.push(`/profile/${item.UserId}`)}
                  style={[
                    styles.memberRow,
                    { borderBottomColor: themeColors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.memberHandle,
                      {
                        color: themeColors.text,
                        fontWeight:
                          item.UserId === currentUser?.UserId
                            ? "bold"
                            : "normal",
                      },
                    ]}
                  >
                    {item.Handle}
                  </Text>

                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: online
                          ? "#22c55e"
                          : themeColors.border,
                      },
                    ]}
                  />
                </Pressable>
              );
            }}
          />

          <Pressable
            style={[styles.actionBtn, { borderColor: themeColors.border }]}
            onPress={handleLeaveGroup}
          >
            <Text style={[styles.actionText, { color: leaveTextColor }]}>
              {t("leaveGroup") || "Leave Group"}
            </Text>
          </Pressable>

          {isAdmin && (
            <Pressable
              style={[styles.actionBtn, { borderColor: themeColors.border }]}
              onPress={handleDeleteGroup}
            >
              <Text style={[styles.actionText, { color: deleteTextColor }]}>
                {t("deleteGroup") || "Delete Group"}
              </Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
  },

  memberHandle: { fontSize: 16 },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  actionBtn: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },

  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },

  groupHeader: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },

  description: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },

  createdText: {
    fontSize: 12,
    marginTop: 6,
  },
});
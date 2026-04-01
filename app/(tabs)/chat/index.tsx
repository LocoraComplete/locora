import { API_BASE_URL } from "@/config/api";
import { getSocket } from "@/config/socket";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

interface UserType {
  UserId: string;
  Handle?: string;
  ProfilePic?: string;
  IsOnline?: boolean;
}

interface Chat {
  ChatId: string;
  GroupName?: string;
  Members?: any[];
  Description?: string;
  ChatType?: string;
  Users?: UserType[];
  LastMessage?: string;
  LastMessageTime?: string;
  UnreadCount: number;
}

export default function ChatList() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const accent = "#3b82f6";

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userResults, setUserResults] = useState<UserType[]>([]);
  const [myGroups, setMyGroups] = useState<Chat[]>([]);
  const [recommended, setRecommended] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupResults, setGroupResults] = useState<Chat[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserId(parsedUser.UserId);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadMyGroups();
      loadRecommended();
    }
  }, [currentUserId]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0 && currentUserId) {
        searchAll();
      } else {
        setUserResults([]);
        setGroupResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket();
    socket.on("receive_message", (newMessage: any) => {
      if (newMessage.IsSystem) return;
      setMyGroups((prev) =>
        prev
          .map((group) =>
            group.ChatId === newMessage.ChatId
              ? {
                  ...group,
                  LastMessage: newMessage.Text,
                  LastMessageTime: newMessage.CreatedAt || new Date().toISOString(),
                  UnreadCount:
                    newMessage.SenderId === currentUserId
                      ? group.UnreadCount
                      : (group.UnreadCount || 0) + 1,
                }
              : group
          )
          .sort((a, b) => {
            const aT = a.LastMessageTime ? new Date(a.LastMessageTime).getTime() : 0;
            const bT = b.LastMessageTime ? new Date(b.LastMessageTime).getTime() : 0;
            return bT - aT;
          })
      );
    });
    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId]);

  const loadMyGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/user/${currentUserId}`
      );
      setMyGroups(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommended = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/recommend/${currentUserId}`
      );
      setRecommended(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim())
      return Alert.alert(t("groupNameRequired") || "Group name required");
    if (!currentUserId)
      return Alert.alert(t("userNotLoaded") || "User not loaded");

    try {
      await axios.post(`${API_BASE_URL}/api/chat/create`, {
        GroupName: groupName.trim(),
        Description: description,
        CreatedBy: currentUserId,
      });
      setModalVisible(false);
      setGroupName("");
      setDescription("");
      loadMyGroups();
      loadRecommended();
      Alert.alert(t("groupCreated") || "Group created 🎉");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        Alert.alert(t("groupExists") || "A group with this name already exists");
      } else {
        Alert.alert(t("groupCreateFailed") || "Failed to create group");
      }
    }
  };

  const joinGroup = async (chatId: string) => {
    if (!currentUserId) return;

    try {
      await axios.post(`${API_BASE_URL}/api/chat/join`, {
        ChatId: chatId,
        UserId: currentUserId,
      });
      loadMyGroups();
      loadRecommended();
      Alert.alert(t("joinedSuccess") || "Joined successfully");
    } catch {
      Alert.alert(t("joinFailed") || "Failed to join");
    }
  };

  const openChat = (chat: Chat) => {
    if (!chat.ChatId) return;

    if (chat.ChatType === "private") {
      const otherUser = chat.Users?.find((u) => u.UserId !== currentUserId);
      if (!otherUser) return;
      router.push({
        pathname: "/chat/room",
        params: {
          chatId: chat.ChatId,
          title: otherUser.Handle || "User",
          isPrivate: "true",
          otherUserId: otherUser.UserId,
          otherUserHandle: otherUser.Handle,
        },
      });
      return;
    }

    router.push({
      pathname: "/chat/room",
      params: {
        chatId: chat.ChatId,
        title: chat.GroupName,
        isPrivate: "false",
      },
    });
  };

  const searchAll = async () => {
    try {
      const [usersRes, groupsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/users/search/all`, {
          params: { query: searchQuery, currentUserId },
        }),
        axios.get(`${API_BASE_URL}/api/chat/search`, {
          params: { query: searchQuery, userId: currentUserId },
        }),
      ]);
      setUserResults(usersRes.data || []);
      setGroupResults(groupsRes.data?.groups || []);
    } catch (err) {
      console.log(err);
    }
  };

  const startPrivateChat = async (user: UserType) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat/private`, {
        User1: currentUserId,
        User2: user.UserId,
      });
      router.push({
        pathname: "/chat/room",
        params: {
          chatId: res.data.ChatId,
          title: user.Handle || "User",
          isPrivate: "true",
          otherUserId: user.UserId,
          otherUserHandle: user.Handle,
        },
      });
    } catch (err) {
      Alert.alert("Error starting chat");
    }
  };

  const deletePrivateChat = async (chatId: string) => {
    Alert.alert("Delete Chat", "Delete this conversation and all messages?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/chat/deletePrivate/${chatId}`, {
              data: { userId: currentUserId },
            });
            setMyGroups((prev) => prev.filter((c) => c.ChatId !== chatId));
          } catch {
            Alert.alert("Failed to delete chat");
          }
        },
      },
    ]);
  };

  const filteredGroups = myGroups.filter((chat) => {
    if (searchQuery.trim().length === 0) return true;
    const name =
      chat.ChatType === "private"
        ? chat.Users?.find((u) => u.UserId !== currentUserId)?.Handle
        : chat.GroupName;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderUnreadBadge = (count: number) => {
    if (count <= 0) return null;
    return (
      <View style={styles.waBadge}>
        <Text style={styles.waBadgeText}>{count}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View style={[styles.header, { borderColor: themeColors.border }]}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {t("messages") || "MESSAGES"}
          </Text>

          <Pressable
            style={[styles.plusBtn, { backgroundColor: accent }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-outline" size={20} color="#fff" />
          </Pressable>
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={themeColors.secondaryText}
          />
          <TextInput
            placeholder={t("searchChats") || "Search chats or groups..."}
            placeholderTextColor={themeColors.secondaryText}
            style={[styles.searchInput, { color: themeColors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {searchQuery.length === 0 && (
            <View style={styles.recommendationSection}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionLabel, { color: themeColors.secondaryText }]}
                >
                  {t("joinTravelGroups") || "Join Travel Groups"}
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommended.map((group, index) => (
                  <View
                    key={group.ChatId || `rec-${index}`}
                    style={[styles.groupCard, { backgroundColor: themeColors.card }]}
                  >
                    <Image
                      source={{
                        uri: `https://api.dicebear.com/7.x/initials/png?seed=${group.GroupName}`,
                      }}
                      style={styles.groupImage}
                    />
                    <Text style={[styles.groupName, { color: themeColors.text }]}>
                      {group.GroupName}
                    </Text>
                    <Text style={[styles.groupMembers, { color: themeColors.secondaryText }]}>
                      {group.Members?.length || 0} {t("travelers") || "travelers"}
                    </Text>
                    <Pressable
                      style={[styles.joinBtn, { backgroundColor: accent }]}
                      onPress={() => joinGroup(group.ChatId)}
                    >
                      <Ionicons name="person-add-outline" size={12} color="#fff" />
                      <Text style={styles.joinBtnText}>{t("joinNow") || "JOIN NOW"}</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.chatList}>
            {loading && <ActivityIndicator size="large" color={accent} />}

            {!loading &&
              searchQuery.trim().length > 0 &&
              userResults.length === 0 &&
              groupResults.length === 0 &&
              filteredGroups.length === 0 && (
                <Text
                  style={{
                    textAlign: "center",
                    color: themeColors.secondaryText,
                    marginTop: 30,
                  }}
                >
                  {t("noResults") || "No results found"}
                </Text>
              )}

            {/* SEARCHED USERS */}
            {searchQuery.trim().length > 0 && userResults.length > 0 && (
              <>
                <Text style={[styles.sectionDivider, { color: themeColors.secondaryText }]}>
                  PEOPLE
                </Text>
                {userResults.map((user, index) => (
                  <Pressable
                    key={user.UserId || `user-${index}`}
                    style={[styles.chatCard, { borderColor: themeColors.border }]}
                    onPress={() => startPrivateChat(user)}
                  >
                    <View>
                      <Image
                        source={{
                          uri: user.ProfilePic
                            ? `${API_BASE_URL}${user.ProfilePic}`
                            : `https://api.dicebear.com/7.x/initials/png?seed=${user.Handle}`,
                        }}
                        style={styles.avatar}
                      />
                      {user.IsOnline && <View style={styles.onlineDot} />}
                    </View>
                    <View style={styles.chatContent}>
                      <Text
                        numberOfLines={1}
                        style={[styles.chatName, { color: themeColors.text }]}
                      >
                        {user.Handle}
                      </Text>
                      <Text
                        style={[
                          styles.chatMsg,
                          { color: themeColors.secondaryText, marginTop: 4 },
                        ]}
                      >
                        Tap to start chatting
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </>
            )}

            {/* SEARCHED GROUPS FROM DB */}
            {searchQuery.trim().length > 0 && groupResults.length > 0 && (
              <>
                <Text style={[styles.sectionDivider, { color: themeColors.secondaryText }]}>
                  GROUPS
                </Text>
                {groupResults.map((group, index) => {
                  const isJoined = myGroups.some((mg) => mg.ChatId === group.ChatId);
                  return (
                    <Pressable
                      key={group.ChatId || `group-res-${index}`}
                      style={[styles.chatCard, { borderColor: themeColors.border }]}
                      onPress={() => {
                        if (isJoined) {
                          openChat(group);
                        } else {
                          Alert.alert("Join Group", `Join "${group.GroupName}"?`, [
                            { text: "Cancel", style: "cancel" },
                            { text: "Join", onPress: () => joinGroup(group.ChatId) },
                          ]);
                        }
                      }}
                    >
                      <Image
                        source={{
                          uri: `https://api.dicebear.com/7.x/initials/png?seed=${group.GroupName}`,
                        }}
                        style={styles.avatar}
                      />
                      <View style={styles.chatContent}>
                        <View style={styles.chatTopRow}>
                          <Text
                            numberOfLines={1}
                            style={[styles.chatName, { color: themeColors.text }]}
                          >
                            {group.GroupName}
                          </Text>
                          {isJoined && (
                            <Text style={{ fontSize: 10, color: accent }}>Joined</Text>
                          )}
                        </View>
                        <Text style={[styles.chatMsg, { color: themeColors.secondaryText }]}>
                          {group.Members?.length || 0} members
                          {!isJoined ? " · Tap to join" : ""}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </>
            )}

            {/* MY CHATS */}
            {filteredGroups.map((chat, index) => {
              const otherUser =
                chat.ChatType === "private"
                  ? chat.Users?.find((u) => u.UserId !== currentUserId)
                  : null;

              const name =
                chat.ChatType === "private"
                  ? otherUser?.Handle || "User"
                  : chat.GroupName;

              const avatarUri =
                chat.ChatType === "private" && otherUser?.ProfilePic
                  ? `${API_BASE_URL}${otherUser.ProfilePic}`
                  : `https://api.dicebear.com/7.x/initials/png?seed=${name}`;

              return (
                <Pressable
                  key={chat.ChatId || `mychat-${index}`}
                  style={[styles.chatCard, { borderColor: themeColors.border }]}
                  onPress={() => openChat(chat)}
                  onLongPress={() => {
                    if (chat.ChatType === "private") {
                      deletePrivateChat(chat.ChatId);
                    }
                  }}
                >
                  <View>
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    {chat.ChatType === "private" && otherUser?.IsOnline && (
                      <View style={styles.onlineDot} />
                    )}
                  </View>

                  <View style={styles.chatContent}>
                    <View style={styles.chatTopRow}>
                      <Text
                        numberOfLines={1}
                        style={[styles.chatName, { color: themeColors.text }]}
                      >
                        {name}
                      </Text>
                      <Text style={[styles.chatTime, { color: themeColors.secondaryText }]}>
                        {chat.LastMessageTime
                          ? new Date(chat.LastMessageTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </Text>
                    </View>

                    <View style={styles.chatBottomRow}>
                      <Text
                        numberOfLines={1}
                        style={[styles.chatMsg, { color: themeColors.secondaryText }]}
                      >
                        {chat.LastMessage || "No messages yet"}
                      </Text>
                      {renderUnreadBadge(chat.UnreadCount)}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Modal visible={modalVisible} animationType="slide">
          <SafeAreaView
            style={[styles.modalContainer, { backgroundColor: themeColors.background }]}
          >
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              {t("createGroup") || "Create Group"}
            </Text>

            <TextInput
              placeholder={t("groupName") || "Group Name"}
              placeholderTextColor={themeColors.secondaryText}
              style={[
                styles.input,
                {
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  backgroundColor: themeColors.card,
                },
              ]}
              value={groupName}
              onChangeText={setGroupName}
            />

            <TextInput
              placeholder={t("description") || "Description"}
              placeholderTextColor={themeColors.secondaryText}
              style={[
                styles.input,
                {
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  backgroundColor: themeColors.card,
                },
              ]}
              value={description}
              onChangeText={setDescription}
            />

            <Pressable
              style={[styles.createBtn, { backgroundColor: accent }]}
              onPress={createGroup}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {t("create") || "Create"}
              </Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)}>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  color: accent,
                  fontWeight: "600",
                }}
              >
                {t("cancel") || "Cancel"}
              </Text>
            </Pressable>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 20, fontWeight: "900", fontStyle: "italic" },
  plusBtn: { padding: 10, borderRadius: 14 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 25,
    height: 40,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: { flex: 1 },
  recommendationSection: { marginBottom: 10 },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 8 },
  sectionLabel: { fontSize: 10, fontWeight: "900" },
  sectionDivider: {
    fontSize: 10,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  groupCard: {
    width: 170,
    borderRadius: 20,
    marginLeft: 16,
    padding: 12,
    alignItems: "center",
  },
  groupImage: { width: 50, height: 50, borderRadius: 12, marginBottom: 6 },
  groupName: { fontSize: 12, fontWeight: "700", textAlign: "center" },
  groupMembers: { fontSize: 10, marginBottom: 6 },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  joinBtnText: { fontSize: 10, color: "#fff", fontWeight: "700" },
  chatList: { paddingHorizontal: 16, paddingBottom: 30 },
  chatCard: {
    flexDirection: "row",
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 0.5,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, marginRight: 12 },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 12,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatContent: { flex: 1, justifyContent: "center" },
  chatTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  chatName: { fontSize: 15, fontWeight: "700", flex: 1, marginRight: 8 },
  chatTime: { fontSize: 11 },
  chatMsg: { fontSize: 13, lineHeight: 18, flex: 1 },
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 },
  createBtn: { padding: 12, borderRadius: 10, alignItems: "center" },
  waBadge: {
    backgroundColor: "#dc1e1e",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  waBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});
import { API_BASE_URL } from "@/config/api";
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

interface Chat {
  ChatId: string;
  GroupName?: string;
  Members?: any[];
  Description?: string;
  ChatType?: string;
  Users?: any[];
  LastMessage?: string;
  LastMessageTime?: string;
}

export default function ChatList() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const accent = "#3b82f6";

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [myGroups, setMyGroups] = useState<Chat[]>([]);
  const [recommended, setRecommended] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
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

  const loadMyGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/chat/user/${currentUserId}`);
      setMyGroups(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommended = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/recommend/${currentUserId}`);
      setRecommended(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return Alert.alert(t("groupNameRequired") || "Group name required");
    if (!currentUserId) return Alert.alert(t("userNotLoaded") || "User not loaded");

    const duplicate = myGroups.find(
      (g) => g.GroupName?.toLowerCase() === groupName.trim().toLowerCase()
    );
    if (duplicate) return Alert.alert(t("groupExists") || "Group already exists");

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
    } catch {
      Alert.alert(t("groupCreateFailed") || "Failed to create group");
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

  const filteredGroups = myGroups.filter((chat) => {
    const name =
      chat.ChatType === "private"
        ? chat.Users?.find((u) => u.UserId !== currentUserId)?.Handle
        : chat.GroupName;

    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
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
          <Ionicons name="search-outline" size={16} color={themeColors.secondaryText} />

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
                <Text style={[styles.sectionLabel, { color: themeColors.secondaryText }]}>
                  {t("joinTravelGroups") || "Join Travel Groups"}
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommended.map((group) => (
                  <View
                    key={group.ChatId}
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

            {!loading && filteredGroups.length === 0 && (
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

            {filteredGroups.map((chat) => {
              const name =
                chat.ChatType === "private"
                  ? chat.Users?.find((u) => u.UserId !== currentUserId)?.Handle || "User"
                  : chat.GroupName;

              return (
                <Pressable
                  key={chat.ChatId}
                  style={[styles.chatCard, { borderColor: themeColors.border }]}
                  onPress={() => openChat(chat)}
                >
                  <Image
                    source={{
                      uri: `https://api.dicebear.com/7.x/initials/png?seed=${name}`,
                    }}
                    style={styles.avatar}
                  />

                  <View style={{ flex: 1 }}>
                    <View style={styles.chatTopRow}>
                      <Text style={[styles.chatName, { color: themeColors.text }]}>
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

                    <Text
                      numberOfLines={1}
                      style={[styles.chatMsg, { color: themeColors.secondaryText }]}
                    >
                      {chat.LastMessage || "No messages yet"}
                    </Text>
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
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: "900", fontStyle: "italic" },
  plusBtn: { padding: 10, borderRadius: 14 },
  searchContainer: { flexDirection: "row", alignItems: "center", margin: 16, paddingHorizontal: 12, borderRadius: 25, height: 40, gap: 8, borderWidth: 1 },
  searchInput: { flex: 1 },
  recommendationSection: { marginBottom: 10 },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 8 },
  sectionLabel: { fontSize: 10, fontWeight: "900" },
  groupCard: { width: 170, borderRadius: 20, marginLeft: 16, padding: 12, alignItems: "center" },
  groupImage: { width: 50, height: 50, borderRadius: 12, marginBottom: 6 },
  groupName: { fontSize: 12, fontWeight: "700", textAlign: "center" },
  groupMembers: { fontSize: 10, marginBottom: 6 },
  joinBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  joinBtnText: { fontSize: 10, color: "#fff", fontWeight: "700" },
  chatList: { paddingHorizontal: 16, paddingBottom: 30 },
  chatCard: { flexDirection: "row", gap: 12, paddingVertical: 12, borderBottomWidth: 1 },
  avatar: { width: 50, height: 50, borderRadius: 14 },
  chatTopRow: { flexDirection: "row", justifyContent: "space-between" },
  chatName: { fontSize: 14, fontWeight: "700" },
  chatTime: { fontSize: 10 },
  chatMsg: { fontSize: 12 },
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 },
  createBtn: { padding: 12, borderRadius: 10, alignItems: "center" },
});
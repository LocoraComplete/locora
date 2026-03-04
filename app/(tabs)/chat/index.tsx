import { API_BASE_URL } from "@/config/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

export default function ChatList() {
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  /* LOAD USER */
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserId(parsedUser?.UserId || parsedUser?.id);
      }
    };
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentUserId) {
        loadMyGroups();
        loadRecommended();
      }
    }, [currentUserId])
  );

  const loadMyGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/user/${currentUserId}`
      );
      setMyGroups(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommended = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/chat/recommend/${currentUserId}`
      );
      setRecommended(res.data || []);
    } catch (err) {
      console.log("Recommend error:", err);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return Alert.alert("Group name required");
    if (!currentUserId) return Alert.alert("User not loaded");

    const duplicate = myGroups.find(
      (g) => g.GroupName?.toLowerCase() === groupName.trim().toLowerCase()
    );
    if (duplicate) return Alert.alert("Group already exists");

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
      Alert.alert("Group created 🎉");
    } catch {
      Alert.alert("Failed to create group");
    }
  };

  const joinGroup = async (chatId: string) => {
    if (!currentUserId) return;

    try {
      await axios.post(`${API_BASE_URL}/api/chat/join`, {
        ChatId: chatId,
        UserId: currentUserId,
      });

      await loadMyGroups();
      await loadRecommended();
      Alert.alert("Joined successfully");
    } catch {
      Alert.alert("Failed to join");
    }
  };

  /* OPEN CHAT */
  const openChat = (chat: any) => {
    const isPrivate = chat.ChatType === "private";

    const otherUser =
      isPrivate &&
      chat.Users?.find((u: any) => u.UserId !== currentUserId);

    router.push({
      pathname: "/chat/room",
      params: {
        chatId: chat.ChatId,
        isPrivate: isPrivate ? "true" : "false",
        otherUserId: otherUser?.UserId || "",
        otherUserHandle: otherUser?.Handle || "",
        title: isPrivate ? otherUser?.Handle : chat.GroupName,
      },
    });
  };

  /* FILTER + SORT BY LAST MESSAGE */
  const filteredGroups = myGroups
  .filter((chat) => {
    if (chat.ChatType === "private") {
      const otherUser = chat.Users?.find(
        (u: any) => u.UserId !== currentUserId
      );
      return otherUser?.Handle
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    }

    return chat.GroupName?.toLowerCase().includes(
      searchQuery.toLowerCase()
    );
  })
  .sort((a, b) => {
    return (
      new Date(b.LastMessageTime || 0).getTime() -
      new Date(a.LastMessageTime || 0).getTime()
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MESSAGES</Text>
        <Pressable style={styles.plusBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="#888" />
        <TextInput
          placeholder="Search chats or groups..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* RECOMMENDED ONLY IF EXISTS */}
        {recommended.length > 0 && (
          <View style={styles.recommendationSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Join Travel Groups</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommended.map((group) => (
                <View key={group.ChatId} style={styles.groupCard}>
                  <Image
                    source={{
                      uri: `https://api.dicebear.com/7.x/initials/png?seed=${group.GroupName}`,
                    }}
                    style={styles.groupImage}
                  />
                  <Text style={styles.groupName}>{group.GroupName}</Text>
                  <Text style={styles.groupMembers}>
                    {group.Members?.length || 0} travelers
                  </Text>

                  <Pressable
                    style={styles.joinBtn}
                    onPress={() => joinGroup(group.ChatId)}
                  >
                    <Ionicons name="person-add-outline" size={12} color="#fff" />
                    <Text style={styles.joinBtnText}>JOIN NOW</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* MY GROUPS */}
        <View style={styles.chatList}>
          {loading && <ActivityIndicator size="large" />}

          {filteredGroups.map((chat) => (
            <Pressable
              key={chat.ChatId}
              style={styles.chatCard}
              onPress={() => openChat(chat)}
            >
              <Image
                source={{
                  uri: `https://api.dicebear.com/7.x/initials/png?seed=${
                    chat.ChatType === "private"
                      ? chat.Users?.find(
                          (u: any) => u.UserId !== currentUserId
                        )?.Handle
                      : chat.GroupName
                  }`,
                }}
                style={styles.avatar}
              />

              <View style={{ flex: 1 }}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.chatName}>
                    {chat.ChatType === "private"
                      ? chat.Users?.find(
                          (u: any) => u.UserId !== currentUserId
                        )?.Handle
                      : chat.GroupName}
                  </Text>

                  <Text style={styles.chatTime}>
                    {chat.LastMessageTime
                      ? new Date(chat.LastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </Text>
                </View>

                <Text style={styles.chatMsg} numberOfLines={1}>
                  {chat.LastMessage || "No messages yet"}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* MODAL SAME AS BEFORE */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create Group</Text>
          <TextInput
            placeholder="Group Name"
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
          />
          <TextInput
            placeholder="Description"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />
          <Pressable style={styles.createBtn} onPress={createGroup}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Create</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={{ textAlign: "center", marginTop: 20 }}>Cancel</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "900", fontStyle: "italic" },
  plusBtn: { backgroundColor: "#fbbf24", padding: 10, borderRadius: 14 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 25,
    height: 40,
    gap: 8,
  },
  searchInput: { flex: 1 },
  recommendationSection: { marginBottom: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 8 },
  sectionLabel: { fontSize: 10, fontWeight: "900", color: "#888" },
  groupCard: { width: 170, backgroundColor: "#fef3c7", borderRadius: 20, marginLeft: 16, padding: 12, alignItems: "center" },
  groupImage: { width: 50, height: 50, borderRadius: 12, marginBottom: 6 },
  groupName: { fontSize: 12, fontWeight: "700", textAlign: "center" },
  groupMembers: { fontSize: 10, color: "#555", marginBottom: 6 },
  joinBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#fbbf24", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  joinBtnText: { fontSize: 10, color: "#fff", fontWeight: "700" },
  createGroup: { flexDirection: "row", gap: 12, alignItems: "center", margin: 16, padding: 14, borderRadius: 20, borderWidth: 1, borderStyle: "dashed", borderColor: "#ccc" },
  createIcon: { width: 48, height: 48, backgroundColor: "#fff", borderRadius: 16, alignItems: "center", justifyContent: "center" },
  createTitle: { fontSize: 14, fontWeight: "700" },
  createSubtitle: { fontSize: 10, color: "#666" },
  chatList: { paddingHorizontal: 16, paddingBottom: 30 },
  chatCard: { flexDirection: "row", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  avatar: { width: 50, height: 50, borderRadius: 14 },
  chatTopRow: { flexDirection: "row", justifyContent: "space-between" },
  chatName: { fontSize: 14, fontWeight: "700" },
  chatTime: { fontSize: 10, color: "#888" },
  chatMsg: { fontSize: 12, color: "#555" },
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 15 },
  createBtn: { backgroundColor: "#fbbf24", padding: 12, borderRadius: 10, alignItems: "center" },
});
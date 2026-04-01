import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import api from "../../../config/api";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

export default function Comments() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = {
    light: { background: "#fff", text: "#000", secondaryText: "#888", inputBg: "#fff", border: "#ddd" },
    dark: { background: "#121212", text: "#fff", secondaryText: "#aaa", inputBg: "#1E1E1E", border: "#333" }
  }[theme];

  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const { t } = useLanguage();

  useFocusEffect(
    useCallback(() => { loadUser(); fetchComments(); }, [])
  );

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.UserId);
      setUsername(user.Handle || "");
      setProfilePic(user.profilePic || "");
    }
  };

  const fetchComments = async () => {
    try { const res = await api.get(`/api/posts/comments/${postId}`); setComments(res.data); }
    catch (err) { console.log("Fetch comments error", err); }
  };

  const sendComment = async () => {
    if (!text.trim()) return;
    try {
      await api.post("/api/posts/comment", { PostId: postId, UserId: userId, text });
      const newComment = { UserId: userId, handle: username, username, profilePic, text, createdAt: new Date().toISOString() };
      setComments(prev => [...prev, newComment]);
      setText("");
      setTimeout(() => { flatListRef.current?.scrollToEnd({ animated: true }); }, 200);
    } catch (err) { console.log("Comment error", err); }
  };

  const openProfile = (id: string) => { if (!id) return; router.push({ pathname: "/profile/[id]", params: { id } }); };
  const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderItem = ({ item }: any) => (
    <View style={styles.commentRow}>
      <Image source={{ uri: item.profilePic || "https://via.placeholder.com/100" }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.topLine}>
          <TouchableOpacity disabled={!item.UserId} onPress={() => openProfile(item.UserId)}>
            <Text style={[styles.username, { color: themeColors.text }]}>{item.handle || item.Handle || item.username || "user"}</Text>
          </TouchableOpacity>
          <Text style={[styles.time, { color: themeColors.secondaryText }]}>{item.createdAt ? formatTime(item.createdAt) : ""}</Text>
        </View>
        <Text style={[styles.commentText, { color: themeColors.text }]}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: themeColors.background }]} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} 
    >
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={themeColors.text} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Comments</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={(item, index) => `${item.UserId || "user"}-${item.createdAt || "time"}-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.commentsContainer}
      />

      <View style={[styles.inputRow, { borderTopColor: themeColors.border, backgroundColor: themeColors.background }]}>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.border }]}
          placeholder="Write a comment..."
          placeholderTextColor={themeColors.secondaryText}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={sendComment}>
          <Text style={[styles.post, { color: "#007AFF" }]}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  commentsContainer: { paddingHorizontal: 16, paddingTop: 10 },
  commentRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  topLine: { flexDirection: "row", alignItems: "baseline", marginBottom: 2 },
  username: { fontWeight: "bold", fontSize: 14 },
  commentText: { fontSize: 14, lineHeight: 18 },
  time: { fontSize: 11, marginLeft: 8 },
  inputRow: { flexDirection: "row", borderTopWidth: 1, padding: 12, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 10, marginRight: 10 },
  post: { fontWeight: "bold", fontSize: 16 },
});
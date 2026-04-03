import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../config/api";
import { useTheme } from "../context/themecontext";

const screenWidth = Dimensions.get("window").width;

export default function PostDetail() {
  const { PostId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = {
    light: {
      background: "#fff",
      text: "#000",
      secondaryText: "#888",
      border: "#ddd",
      inputBg: "#fff"
    },
    dark: {
      background: "#121212",
      text: "#fff",
      secondaryText: "#aaa",
      border: "#333",
      inputBg: "#1E1E1E"
    }
  }[theme];

  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [postOwnerId, setPostOwnerId] = useState(""); 

  // ================= LOAD USER =================
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.UserId);
        loadPost(parsed.UserId);
        loadComments();
      }
    };
    loadUser();
  }, []);

  // ================= LOAD POST =================
  const loadPost = async (uid: string) => {
    try {
      const res = await api.get(`/api/posts/${PostId}?UserId=${uid}`);
      setLikes(res.data.likes);
      setLiked(res.data.likedByUser);
      setImages(res.data.ImageUrls);
      setCaption(res.data.Caption);
      setCreatedAt(res.data.createdAt);
      setPostOwnerId(res.data.UserId); 
    } catch (err) {
      console.log("POST LOAD ERROR:", err);
    }
  };

  // ================= DELETE POST =================
  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "This will permanently delete your post.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/posts/${PostId}`, { data: { UserId: userId } });
              Alert.alert("Post deleted");
              router.replace("/(tabs)/profile"); 
            } catch (err) {
              console.log("DELETE ERROR:", err);
              Alert.alert("Failed to delete post");
            }
          },
        },
      ]
    );
  };

  // ================= COMMENTS =================
  const loadComments = async () => {
    try {
      const res = await api.get(`/api/posts/comments/${PostId}`);
      setComments(res.data);
    } catch (err) {
      console.log("COMMENTS ERROR:", err);
    }
  };

  // ================= LIKE =================
  const handleLike = async () => {
    try {
      const res = await api.post("/api/posts/like", { PostId, UserId: userId });
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.log("LIKE ERROR:", err);
    }
  };

  // ================= ADD COMMENT =================
  const addComment = async () => {
    if (!text.trim()) return;
    try {
      await api.post("/api/posts/comment", { PostId, UserId: userId, text });
      setText("");
      loadComments();
    } catch (err) {
      console.log("COMMENT ERROR:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <FlatList
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              {userId === postOwnerId && (
                <View style={{ alignItems: "flex-end", padding: 10 }}>
                  <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="ellipsis-vertical" size={22} color={themeColors.text} />
                  </TouchableOpacity>
                </View>
              )}

              <ScrollView horizontal pagingEnabled style={{ height: 350 }}>
                {images.map((img, index) => (
                  <Image key={index} source={{ uri: img }} style={styles.image} />
                ))}
              </ScrollView>

              <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ fontSize: 15, color: themeColors.text }}>{caption}</Text>
                
                <View style={styles.infoRow}>
                  <TouchableOpacity onPress={handleLike}>
                    <Text style={[styles.likeText, { color: themeColors.text }]}>
                      ❤️ {likes} {liked ? "Liked" : "Like"}
                    </Text>
                  </TouchableOpacity>

                  <Text style={[styles.timeText, { color: themeColors.secondaryText }]}>
                    {new Date(createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </>
          }
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.comment, { borderBottomColor: themeColors.border, borderBottomWidth: 1 }]}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/profile/[id]",
                    params: { id: item.UserId },
                  })
                }
              >
                <Text style={[styles.handle, { color: themeColors.text }]}>{item.handle}</Text>
              </TouchableOpacity>
              <Text style={{ color: themeColors.text }}>{item.text}</Text>
            </View>
          )}
        />

        <View style={[styles.commentInputRow, { borderTopColor: themeColors.border, backgroundColor: themeColors.background }]}>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.text, borderColor: themeColors.border, borderWidth: 1 }]}
            placeholder="Add comment..."
            placeholderTextColor={themeColors.secondaryText}
            value={text}
            onChangeText={setText}
            multiline={false}
          />
          <TouchableOpacity onPress={addComment} style={styles.postBtnContainer}>
            <Text style={[styles.postBtn, { color: "#007AFF" }]}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: { width: screenWidth, height: 350 },
  infoRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 10 
  },
  likeText: { fontSize: 16, fontWeight: "600" },
  comment: { paddingHorizontal: 12, paddingVertical: 8 },
  handle: { fontWeight: "700" },
  commentInputRow: { 
    flexDirection: "row", 
    borderTopWidth: 1, 
    padding: 12, // Increased padding
    paddingBottom: Platform.OS === 'ios' ? 10 : 12, // Added extra padding for bottom bar
    alignItems: 'center' 
  },
  input: { flex: 1, paddingHorizontal: 10, borderRadius: 10, minHeight: 40 },
  postBtnContainer: { justifyContent: 'center', height: 40 },
  postBtn: { fontWeight: "700", marginLeft: 8 },
  timeText: { fontSize: 12, textTransform: "uppercase" },
});
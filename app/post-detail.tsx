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

const screenWidth = Dimensions.get("window").width;

export default function PostDetail() {
  const { PostId } = useLocalSearchParams();

  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [postOwnerId, setPostOwnerId] = useState(""); 

  const router = useRouter();

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
              await api.delete(`/api/posts/${PostId}`, {
                data: { UserId: userId },
              });

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
      const res = await api.post("/api/posts/like", {
        PostId,
        UserId: userId,
      });

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
      await api.post("/api/posts/comment", {
        PostId,
        UserId: userId,
        text,
      });

      setText("");
      loadComments();
    } catch (err) {
      console.log("COMMENT ERROR:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >

        <FlatList
          ListHeaderComponent={
            <>
              {/* TOP RIGHT 3 DOTS */}
              {userId === postOwnerId && (
                <View style={{ alignItems: "flex-end", padding: 10 }}>
                  <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="ellipsis-vertical" size={22} />
                  </TouchableOpacity>
                </View>
              )}

              {/* IMAGES */}
              <ScrollView horizontal pagingEnabled style={{ height: 350 }}>
                {images.map((img, index) => (
                  <Image key={index} source={{ uri: img }} style={styles.image} />
                ))}
              </ScrollView>

              {/* CAPTION */}
              <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ fontSize: 15 }}>{caption}</Text>
              </View>

              {/* LIKE */}
              <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                <Text style={styles.likeText}>
                  ❤️ {likes} {liked ? "Liked" : "Like"}
                </Text>
              </TouchableOpacity>
            </>
          }

          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/profile/[id]",
                    params: { id: item.UserId },
                  })
                }
              >
                <Text style={styles.handle}>{item.handle}</Text>
              </TouchableOpacity>

              <Text>{item.text}</Text>
            </View>
          )}
        />

        {/* COMMENT INPUT */}
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add comment..."
            value={text}
            onChangeText={setText}
          />

          <TouchableOpacity onPress={addComment}>
            <Text style={styles.postBtn}>Post</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: 350,
  },

  likeButton: {
    padding: 10,
  },

  likeText: {
    fontSize: 16,
    fontWeight: "600",
  },

  comment: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  handle: {
    fontWeight: "700",
  },

  commentInputRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 8,
  },

  input: {
    flex: 1,
    paddingHorizontal: 10,
  },

  postBtn: {
    fontWeight: "700",
    color: "#007AFF",
  },
});
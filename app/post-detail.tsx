import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../config/api";

export default function PostDetail() {
  const { PostId, ImageUrl } = useLocalSearchParams();

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
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

  // ================= LOAD POST DATA =================
  const loadPost = async (uid: string) => {
    try {
      const res = await api.get(`/api/posts/${PostId}?UserId=${uid}`);

      setLikes(res.data.likes);
      setLiked(res.data.likedByUser);
    } catch (err) {
      console.log("POST LOAD ERROR:", err);
    }
  };

  // ================= LOAD COMMENTS =================
  const loadComments = async () => {
    try {
      const res = await api.get(`/api/posts/comments/${PostId}`);
      setComments(res.data);
    } catch (err) {
      console.log("COMMENTS ERROR:", err);
    }
  };

  // ================= LIKE POST =================
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

        {/* IMAGE */}
        <Image source={{ uri: ImageUrl as string }} style={styles.image} />

        {/* LIKE BUTTON */}
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.likeText}>
            ❤️ {likes} {liked ? "Liked" : "Like"}
          </Text>
        </TouchableOpacity>

        {/* COMMENTS */}
        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          style={{ flex: 1 }}
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

        {/* ADD COMMENT */}
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
    width: "100%",
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
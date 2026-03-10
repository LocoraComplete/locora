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

export default function Comments() {

  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();

  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const { t } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      loadUser();
      fetchComments();
    }, [])
  );

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.UserId);
      setUsername(user.Handle || "");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/posts/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.log("Fetch comments error", err);
    }
  };

  const sendComment = async () => {

    if (!text.trim()) return;

    try {

      await api.post("/api/posts/comment", {
        PostId: postId,
        UserId: userId,
        text
      });

      const newComment = {
        UserId: userId,
        username: username,
        profilePic: "",
        text: text,
        createdAt: new Date().toISOString()
      };

      setComments(prev => [...prev, newComment]);

      setText("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);

    } catch (err) {
      console.log("Comment error", err);
    }
  };

  const openProfile = (id: string) => {

    if (!id) return;

    router.push({
      pathname: "/profile/[id]",
      params: { id }
    });
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderItem = ({ item }: any) => (

    <View style={styles.commentRow}>

      <Image
        source={{
          uri: item.profilePic || "https://via.placeholder.com/100"
        }}
        style={styles.avatar}
      />

      <View style={{ flex: 1 }}>

        <TouchableOpacity
          disabled={!item.UserId}
          onPress={() => openProfile(item.UserId)}
        >
          <Text style={styles.username}>
            {item.username || "user"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.text}>{item.text}</Text>

        <Text style={styles.time}>
          {t("comments") || "{formatTime(item.createdAt)}"}
        </Text>

      </View>

    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Comments</Text>

        <View style={{ width: 24 }} />

      </View>

      {/* COMMENTS LIST */}
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={(item, index) =>
          `${item.UserId || "user"}-${item.createdAt || "time"}-${index}`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.commentsContainer}
      />

      {/* INPUT */}
      <View style={styles.inputRow}>

        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity onPress={sendComment}>
          <Text style={styles.post}>Post</Text>
        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700"
  },

  commentsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20
  },

  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },

  username: {
    fontWeight: "bold",
    color: "#3B82F6",
    marginBottom: 2
  },

  text: {
    fontSize: 14
  },

  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 2
  },

  inputRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    alignItems: "center"
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginRight: 10
  },

  post: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#007AFF"
  }

});
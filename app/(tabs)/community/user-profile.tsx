import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const profileImages: Record<string, any> = {
  "1": require("@/assets/images/user1.jpg"),
  "2": require("@/assets/images/user2.jpg"),
};

export default function UserProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    id,
    username,
    location,
    likes,
    comments,
  } = useLocalSearchParams<{
    id: string;
    username: string;
    location: string;
    likes: string;
    comments: string;
  }>();

  /* ================= START PRIVATE CHAT ================= */
  const startChat = async () => {
  try {
    console.log("Start Chat pressed");

    setLoading(true);

    const storedUser = await AsyncStorage.getItem("user");
    console.log("Stored user raw:", storedUser);

    if (!storedUser) {
      console.log("No stored user found");
      Alert.alert("Please login first");
      return;
    }

    const currentUser = JSON.parse(storedUser);
    console.log("Parsed currentUser:", currentUser);
    console.log("CurrentUser.UserId:", currentUser?.UserId);
    console.log("Profile ID:", id);

    if (!currentUser?.UserId) {
      console.log("UserId missing in stored user");
      Alert.alert("User not found");
      return;
    }

    if (currentUser.UserId === id) {
      console.log("Trying to chat with self");
      Alert.alert("You cannot chat with yourself");
      return;
    }

    console.log("Sending request to backend...");

    const res = await axios.post(
      `${API_BASE_URL}/api/chat/private`,
      {
        User1: currentUser.UserId,
        User2: id,
      }
    );

    console.log("Backend response:", res.data);

    if (!res.data?.ChatId) {
      console.log("ChatId missing in response");
      Alert.alert("Chat creation failed");
      return;
    }

    console.log("Navigating to room with ChatId:", res.data.ChatId);

    router.push({
      pathname: "/chat/room",
      params: {
        chatId: res.data.ChatId,
        title: username,
        isPrivate: "true",
        otherUserId: id,
        otherUserHandle: username,
      },
    });

  } catch (err: any) {
    console.log("Start chat error:", err?.response?.data || err.message);
    Alert.alert("Unable to start chat");
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={profileImages[id] || require("@/assets/images/user1.jpg")}
          style={styles.profilePic}
        />

        <Text style={styles.username}>{username}</Text>
        <Text style={styles.location}>{location}</Text>

        <Text style={styles.bio}>
          ❤️ {likes} likes • 💬 {comments} comments
        </Text>

        <TouchableOpacity
          style={styles.chatBtn}
          onPress={startChat}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.chatText}>💬 Start Chat</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Posts by {username}
      </Text>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: "#fff" },
  back: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  profileCard: { alignItems: "center", marginTop: 6 },
  profilePic: { width: 90, height: 90, borderRadius: 45, marginBottom: 8 },
  username: { fontSize: 18, fontWeight: "700" },
  location: { fontSize: 13, color: "#777", marginTop: 2 },
  bio: { marginTop: 6, textAlign: "center" },
  chatBtn: {
    marginTop: 12,
    backgroundColor: "#FF5A5F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    minWidth: 140,
    alignItems: "center",
  },
  chatText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { marginTop: 18, fontSize: 16, fontWeight: "700" },
});
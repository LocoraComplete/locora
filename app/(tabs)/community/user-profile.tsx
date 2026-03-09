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
import { colors } from "../../../config/colors";
import { useTheme } from "../../../context/themecontext";
import { useLanguage } from "../../../context/languagecontext";

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
    liked: string;
  }>();

  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const { t } = useLanguage();

  /* ================= START PRIVATE CHAT ================= */
  const startChat = async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert(t("loginFirst") || "Please login first");
        return;
      }

      const currentUser = JSON.parse(storedUser);

      if (!currentUser?.UserId) {
        Alert.alert(t("userNotFound") || "User not found");
        return;
      }

      if (currentUser.UserId === id) {
        Alert.alert(t("cannotChatSelf") || "You cannot chat with yourself");
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/chat/private`,
        {
          User1: currentUser.UserId,
          User2: id,
        }
      );

      if (!res.data?.ChatId) {
        Alert.alert(t("chatCreationFailed") || "Chat creation failed");
        return;
      }

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
      Alert.alert(t("unableStartChat") || "Unable to start chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.back, { color: themeColors.text }]}>
          ← {t("back") || "Back"}
        </Text>
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={profileImages[id] || require("@/assets/images/user1.jpg")}
          style={styles.profilePic}
        />

        <Text style={[styles.username, { color: themeColors.text }]}>
          {username}
        </Text>

        <Text
          style={[
            styles.location,
            { color: theme === "dark" ? "#aaa" : "#777" },
          ]}
        >
          {location}
        </Text>

        <Text style={[styles.bio, { color: themeColors.text }]}>
          ❤️ {likes} {t("likes") || "likes"} • 💬 {comments} {t("comments") || "comments"}
        </Text>

        <TouchableOpacity
          style={[
            styles.chatBtn,
            { backgroundColor: themeColors.text },
          ]}
          onPress={startChat}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={themeColors.background} />
          ) : (
            <Text
              style={[
                styles.chatText,
                { color: themeColors.background },
              ]}
            >
              💬 {t("startChat") || "Start Chat"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: themeColors.text },
        ]}
      >
        {t("postsBy") || "Posts by"} {username}
      </Text>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  back: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  profileCard: {
    alignItems: "center",
    marginTop: 6,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
  },
  location: {
    fontSize: 13,
    marginTop: 2,
  },
  bio: {
    marginTop: 6,
    textAlign: "center",
  },
  chatBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    minWidth: 140,
    alignItems: "center",
  },
  chatText: {
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: "700",
  },
});
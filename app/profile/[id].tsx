import { API_BASE_URL } from "@/config/api";
import { colors } from "@/config/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

const screenWidth = Dimensions.get("window").width;
const imageSize = (screenWidth - 32) / 3;

type User = {
  UserId: string;
  Handle: string;
  Name: string;
  Bio?: string;
  profilePic?: string;
};

type Post = {
  PostId: string;
  ImageUrls: string[];
};

export default function PublicProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }

        const [userRes, postsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/users/${id}`),
          axios.get(`${API_BASE_URL}/api/posts/user/${id}`),
        ]);

        setUser(userRes.data);
        setPosts(postsRes.data);
      } catch (error: any) {
        Alert.alert(
          t("error") || "Error",
          error?.response?.data?.message ||
            t("failedLoadProfile") ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (currentUser && id === currentUser.UserId) {
      router.back();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.center,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={themeColors.text}
        />
        <Text
          style={{ marginTop: 10, color: themeColors.text }}
        >
          {t("loading") || "Loading..."}
        </Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.center,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Text style={{ color: themeColors.text }}>
          {t("userNotFound") || "User not found"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={themeColors.text}
            />
          </TouchableOpacity>

          <Text
            style={[styles.username, { color: themeColors.text }]}
          >
            {user.Handle}
          </Text>
          <View style={{ width: 22 }} />
        </View>

        {/* PROFILE */}
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            {user.profilePic ? (
              <Image
                source={{ uri: user.profilePic }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: themeColors.card },
                ]}
              >
                <Ionicons
                  name="person"
                  size={40}
                  color={themeColors.text}
                />
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statNumber,
                  { color: themeColors.text },
                ]}
              >
                {posts.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: themeColors.text + "99" },
                ]}
              >
                {t("posts") || "Posts"}
              </Text>
            </View>
          </View>
        </View>

        {/* BIO */}
        <View style={styles.bioBox}>
          <Text
            style={[styles.name, { color: themeColors.text }]}
          >
            {user.Name}
          </Text>
          <Text
            style={[styles.bio, { color: themeColors.text + "CC" }]}
          >
            {user.Bio || t("explorerBio") || "Explorer on Locora 🌍"}
          </Text>
        </View>

        {/* MESSAGE BUTTON */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={async () => {
              try {
                if (!currentUser) return;

                const res = await axios.post(
                  `${API_BASE_URL}/api/chat/private`,
                  {
                    User1: currentUser.UserId,
                    User2: user.UserId,
                  }
                );

                const chat = res.data;

                router.push({
                  pathname: "/chat/room",
                  params: {
                    chatId: chat.ChatId,
                    isPrivate: "true",
                    otherUserId: user.UserId,
                    otherUserHandle: user.Handle,
                    title: user.Handle,
                  },
                });
              } catch {
                Alert.alert(
                  t("failedStartChat") || "Failed to start chat"
                );
              }
            }}
          >
            <Text style={styles.messageText}>
              {t("message") || "Message"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* POSTS GRID */}
        <View style={styles.grid}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <TouchableOpacity
                key={post.PostId}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/post-detail",
                    params: { PostId: post.PostId },
                  })
                }
              >
                <Image
                  source={{ uri: post.ImageUrls[0] }}
                  style={styles.gridImage}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noPostsContainer}>
              <Text
                style={[
                  styles.noPostsText,
                  { color: themeColors.text + "99" },
                ]}
              >
                {t("noPostsYet") || "No posts yet"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "900",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarWrapper: {
    marginRight: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flex: 1,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 13,
  },
  bioBox: {
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  bio: {
    marginTop: 4,
  },
  buttonRow: {
    marginBottom: 20,
  },
  messageButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  messageText: {
    color: "#fff",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  gridImage: {
    width: imageSize,
    height: imageSize,
    marginBottom: 2,
  },
  noPostsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  noPostsText: {},
});
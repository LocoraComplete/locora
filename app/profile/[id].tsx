import { API_BASE_URL } from "@/config/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../context/languagecontext";

type User = {
  UserId: string;
  Handle: string;
  Name: string;
};

export default function PublicProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }

        const res = await axios.get(`${API_BASE_URL}/api/users/${id}`);
        setUser(res.data);
      } catch (error: any) {
        Alert.alert(
          t("error") || "Error",
          error?.response?.data?.message || t("failedLoadProfile") || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /* ================= REDIRECT IF VIEWING OWN PROFILE ================= */
  useEffect(() => {
    if (currentUser && id === currentUser.UserId) {
      router.back();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>
          {t("loading") || "Loading..."}
        </Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>{t("userNotFound") || "User not found"}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.username}>{user.Handle}</Text>

          <View style={{ width: 22 }} />
        </View>

        {/* PROFILE ROW */}
        <View style={styles.profileRow}>
          {/* AVATAR */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#999" />
              </View>
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>{t("posts") || "Posts"}</Text>
            </View>
          </View>
        </View>

        {/* NAME + BIO */}
        <View style={styles.bioBox}>
          <Text style={styles.name}>{user.Name}</Text>
          <Text style={styles.bio}>
            {t("explorerBio") || "Explorer on Locora 🌍"}
          </Text>
        </View>

        {/* ACTION BUTTON */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={async () => {
              try {
                if (!currentUser) return;

                const res = await axios.post(`${API_BASE_URL}/api/chat/private`, {
                  User1: currentUser.UserId,
                  User2: user.UserId,
                });

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
              } catch (err) {
                Alert.alert(t("failedStartChat") || "Failed to start chat");
              }
            }}
          >
            <Text style={styles.messageText}>
              {t("message") || "Message"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* POSTS PLACEHOLDER */}
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>
            {t("noPostsYet") || "No posts yet"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    position: "relative",
  },
  avatarBorder: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 50,
    padding: 2,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    marginLeft: 20,
    flex: 1,
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontWeight: "700",
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
  },
  bioBox: {
    marginVertical: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  bio: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  messageButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
  },
  messageText: {
    color: "#fff",
    fontWeight: "600",
  },
  noPostsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  noPostsText: {
    color: "#888",
    fontSize: 14,
  },
});
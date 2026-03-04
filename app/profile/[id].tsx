import { API_BASE_URL } from "@/config/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = {
  UserId: string;
  Handle: string;
  Name: string;
};

export default function PublicProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        // Load current logged in user
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }

        // Fetch viewed user profile
        const res = await axios.get(
          `${API_BASE_URL}/api/users/${id}`
        );

        setUser(res.data);
      } catch (error: any) {
        Alert.alert(
          "Error",
          error?.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  /* ================= IF VIEWING OWN PROFILE ================= */
  useEffect(() => {
    if (currentUser && id === currentUser.UserId) {
      router.replace("/(tabs)/profile");
    }
  }, [currentUser]);

  if (loading) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  if (!user) return null;

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
              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* NAME + BIO */}
        <View style={styles.bioBox}>
          <Text style={styles.name}>{user.Name}</Text>
          <Text style={styles.bio}>Explorer on Locora 🌍</Text>
        </View>

        {/* ACTION BUTTON */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => {
              // You can later connect this to open private chat
              Alert.alert("Coming Soon", "Start private chat feature");
            }}
          >
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* POSTS PLACEHOLDER */}
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>
            No posts yet
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
    borderWidth: 3,
    borderColor: "#F4B400",
    borderRadius: 50,
    padding: 3,
  },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
  },

  statsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontWeight: "900",
    fontSize: 16,
  },

  statLabel: {
    fontSize: 12,
    color: "#555",
  },

  bioBox: {
    marginTop: 10,
  },

  name: {
    fontWeight: "900",
    fontSize: 15,
  },

  bio: {
    marginTop: 4,
    color: "#555",
  },

  buttonRow: {
    marginTop: 15,
  },

  messageButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  messageText: {
    fontWeight: "600",
  },

  noPostsContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  noPostsText: {
    color: "#777",
  },
});
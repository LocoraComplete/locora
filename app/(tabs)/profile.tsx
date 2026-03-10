import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../config/api";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

type User = {
  UserId: string;
  Handle: string;
  Name: string;
  Bio?: string;
  Pronouns?: string;
  profilePic?: string | null;
};

export default function Profile() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<{ PostId: string; ImageUrl: string }[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          const storedUser = await AsyncStorage.getItem("user");

          if (storedUser && isActive) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            const res = await api.get(`/api/posts/user/${parsedUser.UserId}`);
            setPosts(res.data);
          }
        } catch (error) {
          console.log("Error loading profile:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading)
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} />
    );

  if (!user) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.PostId}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 8 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={[styles.username, { color: themeColors.text }]}>
                {user.Handle}
              </Text>

              <TouchableOpacity onPress={() => router.push("/settings")}>
                <Ionicons name="settings-outline" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>

            {/* PROFILE ROW */}
            <View style={styles.profileRow}>
              <View style={styles.avatarWrapper}>
                <View style={[styles.avatarBorder, { borderColor: themeColors.text }]}>
                  {user.profilePic ? (
                    <Image source={{ uri: user.profilePic }} style={styles.avatarPlaceholder} />
                  ) : (
                    <View
                      style={[
                        styles.avatarPlaceholder,
                        { backgroundColor: themeColors.card },
                      ]}
                    >
                      <Ionicons name="person" size={40} color={themeColors.secondaryText} />
                    </View>
                  )}
                </View>

                <View style={[styles.plusIcon, { backgroundColor: themeColors.text }]}>
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: themeColors.text }]}>
                    {posts.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: themeColors.secondaryText }]}>
                    Posts
                  </Text>
                </View>
              </View>
            </View>

            {/* BIO */}
            <View style={styles.bioBox}>
              <Text style={[styles.name, { color: themeColors.text }]}>{user.Name}</Text>

              <Text style={[styles.bio, { color: themeColors.secondaryText }]}>
                {user.Bio || t("defaultBio") || "Welcome to Locora 🌍"}
              </Text>
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.outlineButton,
                  {
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.card,
                  },
                ]}
                onPress={() => router.push("/edit-profile")}
              >
                <Text style={[styles.buttonText, { color: themeColors.text }]}>
                  {t("editProfile")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.outlineButton,
                  {
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.card,
                  },
                ]}
                onPress={() => router.push("/add-post")}
              >
                <Text style={[styles.buttonText, { color: themeColors.text }]}>
                  {t("addPost") || "Add Post"}
                </Text>
              </TouchableOpacity>
            </View>

            {posts.length === 0 && (
              <View style={styles.noPostsContainer}>
                <Text style={[styles.noPostsText, { color: themeColors.secondaryText }]}>
                  {t("noPostsYet") || "No posts yet"}
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <Image source={{ uri: item.ImageUrl }} style={styles.postImage} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  username: { fontSize: 18, fontWeight: "900" },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatarWrapper: { position: "relative" },

  avatarBorder: { borderWidth: 3, borderRadius: 50, padding: 3 },

  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  plusIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  statsRow: {
    flex: 1,
    alignItems: "center",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: { fontWeight: "900", fontSize: 18 },

  statLabel: { fontSize: 13 },

  bioBox: { marginTop: 10 },

  name: { fontWeight: "900", fontSize: 15 },

  bio: { marginTop: 4 },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  outlineButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },

  buttonText: { fontWeight: "600" },

  noPostsContainer: { alignItems: "center", marginTop: 40 },

  noPostsText: {},

  postImage: {
    width: "32%",
    aspectRatio: 1,
    borderRadius: 8,
  },
});
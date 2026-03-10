import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../../../config/api";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";


const LIMIT = 5;

export default function Community() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const { t } = useLanguage();

  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load logged in user
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user.UserId);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
  if (userId) {
    fetchPosts(1, true);
  }
}, [userId]);

  // Fetch posts
  const fetchPosts = async (pageNumber: number, reset = false) => {
    try {
      const res = await api.get(
        `/api/posts/feed?page=${pageNumber}&limit=${LIMIT}&UserId=${userId}`
      );

      const newPosts = res.data.map((p:any)=>({
        ...p,
        likedByUser: !!p.likedByUser
      }));

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      if (newPosts.length < LIMIT) {
        setHasMore(false);
      }

      setPage(pageNumber);
    } catch (err) {
      console.log("Feed error:", err);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchPosts(1, true);
    setRefreshing(false);
  };

  // Infinite scroll
  const loadMore = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      await fetchPosts(page + 1);
      setLoadingMore(false);
    }
  };

  // Like
  const toggleLike = async (postId: string) => {
    try {
      if (!userId) return;

      const res = await api.post("/api/posts/like", {
        PostId: postId,
        UserId: userId,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p.PostId === postId
            ? {
                ...p,
                likes: res.data.likes,
                likedByUser: res.data.liked,
              }
            : p
        )
      );
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  const renderPost = ({ item }: any) => (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.card },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() =>
            router.push({
              pathname: "/profile/[id]",
              params: {
                id: item.UserId,
                username: item.username,
              },
            })
          }
        >
          <Image
            source={{
              uri:
                item.profilePic ||
                "https://via.placeholder.com/100",
            }}
            style={styles.avatar}
          />

          <Text
            style={[
              styles.username,
              { color: themeColors.text },
            ]}
          >
            {item.handle}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image
        source={{ uri: item.ImageUrl }}
        style={styles.postImage}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => toggleLike(item.PostId)}
          style={styles.likeButton}
        >
          <Text style={styles.heart}>
            {item.likedByUser ? "❤️" : "🤍"}
          </Text>

          <Text
            style={[
              styles.likesText,
              { color: themeColors.text },
            ]}
          >
            {item.likes} {t("likes") || "Likes"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/community/comments",
              params: { postId: item.PostId },
            })
          }
        >
          <Text
            style={[
              styles.actionText,
              { color: themeColors.text },
            ]}
          >
            💬 {item.comments} {t("comments")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.PostId}
        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }

        onEndReached={loadMore}
        onEndReachedThreshold={0.5}

        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="large" /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },

  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },

  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  username: {
    fontWeight: "bold",
    fontSize: 14,
  },

  postImage: {
    width: "100%",
    height: 300,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },

  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  heart: {
    fontSize: 18,
    marginRight: 6,
  },

  likesText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
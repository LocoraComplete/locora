import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
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
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  // ================= GET USER LOCATION =================
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        console.log("Location error:", err);
      }
    };

    getLocation();
  }, []);

  // ================= LOAD USER =================
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

  // ================= FETCH POSTS =================
  useEffect(() => {
    if (userId) fetchPosts(1, true);
  }, [userId]);

  const fetchPosts = async (pageNumber: number, reset = false) => {
    try {
      const res = await api.get(
        `/api/posts/feed?page=${pageNumber}&limit=${LIMIT}&UserId=${userId}`
      );

      const newPosts = res.data.map((p: any) => ({
        ...p,
        likedByUser: !!p.likedByUser,
      }));

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      if (newPosts.length < LIMIT) setHasMore(false);

      setPage(pageNumber);
    } catch (err) {
      console.log("Feed error:", err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchPosts(1, true);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!loadingMore && hasMore && !searchQuery) {
      setLoadingMore(true);
      await fetchPosts(page + 1);
      setLoadingMore(false);
    }
  };

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
            ? { ...p, likes: res.data.likes, likedByUser: res.data.liked }
            : p
        )
      );
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  // ================= DISTANCE CALCULATOR =================
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // ================= OPEN MAP =================
  const openDirections = (post: any) => {
    if (!post?.Latitude || !post?.Longitude) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${post.Latitude},${post.Longitude}&travelmode=driving`;

    Linking.openURL(url);
  };

  const renderPost = ({ item }: any) => {
    const distance =
      userLocation &&
      item.Latitude &&
      item.Longitude &&
      calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        Number(item.Latitude),
        Number(item.Longitude)
      );

    return (
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userRow}
            onPress={() =>
              router.push({
                pathname: "/profile/[id]",
                params: { id: item.UserId, username: item.username },
              })
            }
          >
            <Image
              source={{
                uri: item.profilePic || "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
            <Text style={[styles.username, { color: themeColors.text }]}>
              {item.handle}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post Image */}
        <FlatList
          data={item.ImageUrl}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
            );
            setImageIndexes((prev) => ({ ...prev, [item.PostId]: index }));
          }}
          contentContainerStyle={{ height: 300 }}
          renderItem={({ item: image }) => (
            <Image
              source={{ uri: image }}
              style={[styles.postImage, { width: SCREEN_WIDTH - 20 }]}
            />
          )}
        />

        {item.ImageUrl.length > 1 && (
          <View style={styles.dotsContainer}>
            {item.ImageUrl.map((_: string, index: number) => {
              const activeIndex = imageIndexes[item.PostId] || 0;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === activeIndex && styles.activeDot,
                  ]}
                />
              );
            })}
          </View>
        )}

        {/* CAPTION */}
        {!!item.Caption && (
          <Text style={[styles.caption, { color: themeColors.text }]}>
            {item.Caption}
          </Text>
        )}

        {/* LOCATION + DISTANCE */}
        {!!item.PlaceName && item.Latitude && item.Longitude && (
          <TouchableOpacity
            onPress={() => openDirections(item)}
            style={styles.locationRow}
          >
            <Text style={[styles.locationText, { color: themeColors.text }]}>
              📍 {item.PlaceName}
              {distance ? ` • ${distance} km away` : ""}
            </Text>
          </TouchableOpacity>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => toggleLike(item.PostId)}
            style={styles.likeButton}
          >
            <Text style={styles.heart}>
              {item.likedByUser ? "❤️" : "🤍"}
            </Text>
            <Text style={[styles.likesText, { color: themeColors.text }]}>
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
            <Text style={[styles.actionText, { color: themeColors.text }]}>
              💬 {item.comments} {t("comments")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredPosts = searchQuery
    ? posts.filter((p) =>
        p.handle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: themeColors.card },
        ]}
      >
        <TextInput
          placeholder="Search by username"
          placeholderTextColor={themeColors.text + "88"}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={[
            styles.searchInput,
            {
              color: themeColors.text,
              borderColor: themeColors.text + "55",
            },
          ]}
        />
      </View>

      {filteredPosts.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
          <Text style={{ color: themeColors.text, fontSize: 16 }}>
            No results found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.PostId}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="large" /> : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  searchContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
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
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: { fontWeight: "bold", fontSize: 14 },
  postImage: { width: "100%", height: 300 },

  caption: {
    paddingHorizontal: 10,
    paddingTop: 10,
    fontSize: 14,
  },

  locationRow: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },

  locationText: {
    fontSize: 13,
    fontWeight: "500",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  actionText: { fontSize: 14, fontWeight: "600" },
  likeButton: { flexDirection: "row", alignItems: "center" },
  heart: { fontSize: 18, marginRight: 6 },
  likesText: { fontSize: 14, fontWeight: "600" },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#000",
    width: 7,
    height: 7,
  },
});
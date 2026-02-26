import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const postsData = [
  {
    id: 1,
    username: "traveler_anu",
    profilePic: require("@/assets/images/user1.jpg"),
    postImage: require("@/assets/images/community1.jpg"),
    likes: 120,
    liked: false,
    comments: 18,
    location: "Jaipur, Rajasthan",
  },
  {
    id: 2,
    username: "rajasthan_diaries",
    profilePic: require("@/assets/images/user2.jpg"),
    postImage: require("@/assets/images/community2.jpg"),
    likes: 98,
    liked: false,
    comments: 10,
    location: "Jodhpur, Rajasthan",
  },
];

export default function Community() {
  const router = useRouter();
  const [posts, setPosts] = useState(postsData);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <View key={post.id} style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.userRow}
                onPress={() =>
                  router.push({
                    pathname: "/community/user-profile",
                    params: {
                      id: post.id.toString(),
                      username: post.username,
                      location: post.location,
                      likes: post.likes.toString(),
                      comments: post.comments.toString(),
                      liked: post.liked ? "true" : "false",
                    },
                  })
                }
              >
                <Image source={post.profilePic} style={styles.avatar} />
                <Text style={styles.username}>{post.username}</Text>
              </TouchableOpacity>
            </View>

            {/* Post Image */}
            <Image source={post.postImage} style={styles.postImage} />

            {/* Actions */}
            <View style={styles.actions}>
                <TouchableOpacity 
                  onPress={() => toggleLike(post.id)}
                  style={styles.likeButton}
                >
                <Text style={styles.heart}>
                  {post.liked ? "❤️" : "🤍"}
                </Text>

                <Text style={styles.likesText}>
                  {post.likes} Likes
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/community/comments",
                    params: { postId: post.id.toString() },
                  })
                }
              >
                <Text style={styles.actionText}>
                  💬 {post.comments} Comments
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 10 },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  header: { padding: 10, flexDirection: "row", alignItems: "center" },
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: "bold", fontSize: 14 },
  postImage: { width: "100%", height: 300 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  actionText: { fontSize: 14, fontWeight: "600" },
  likeButton: {
  flexDirection: "row",
  alignItems: "center",
},

heart: {
  fontSize: 18,
  marginRight: 6,
  textShadowColor: "#aaa", 
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 1,
},

likesText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#000",
},

});

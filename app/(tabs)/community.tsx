import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const posts = [
  {
    id: 1,
    username: "traveler_anu",
    profilePic: require("../../assets/images/user1.jpg"),
    postImage: require("../../assets/images/community1.jpg"),
    likes: 120,
    comments: 18,
  },
  {
    id: 2,
    username: "rajasthan_diaries",
    profilePic: require("../../assets/images/user2.jpg"),
    postImage: require("../../assets/images/community2.jpg"),
    likes: 98,
    comments: 10,
  },
];

export default function Community() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {posts.map((post) => (
        <View key={post.id} style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.userRow}>
              <Image source={post.profilePic} style={styles.avatar} />
              <Text style={styles.username}>{post.username}</Text>
            </TouchableOpacity>
          </View>

          {/* Post Image */}
          <Image source={post.postImage} style={styles.postImage} />

          {/* Actions */}
          <View style={styles.actions}>
            <Text style={styles.actionText}>❤️ {post.likes} Likes</Text>
            <Text style={styles.actionText}>💬 {post.comments} Comments</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
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
    fontWeight: "500",
  },
});

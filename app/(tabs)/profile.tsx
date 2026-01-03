import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>@kashish</Text>
        <Ionicons name="settings-outline" size={24} color="#000" />
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={require("../../assets/images/profile-placeholder.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>Kashish Chawla</Text>
        <Text style={styles.bio}>
          Exploring Rajasthan | Travel Enthusiast
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>
      </View>

      {/* User Posts */}
      <View style={styles.posts}>
        <Image
          source={require("../../assets/images/post1.jpg")}
          style={styles.post}
        />
        <Image
          source={require("../../assets/images/post2.jpg")}
          style={styles.post}
        />
        <Image
          source={require("../../assets/images/post3.jpg")}
          style={styles.post}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  bio: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  buttonText: {
    fontWeight: "500",
  },
  posts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  post: {
    width: "32%",
    height: 110,
    borderRadius: 6,
    marginBottom: 8,
  },
});

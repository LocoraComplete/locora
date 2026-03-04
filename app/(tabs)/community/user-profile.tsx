import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";

const profileImages: Record<string, any> = {
  "1": require("@/assets/images/user1.jpg"),
  "2": require("@/assets/images/user2.jpg"),
};

export default function UserProfile() {
  const router = useRouter();

  const {
    id,
    username,
    location,
    likes,
    comments,
    liked,
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
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={profileImages[id]}
          style={styles.profilePic}
        />

        <Text
          style={[
            styles.username,
            { color: themeColors.text },
          ]}
        >
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

        <Text
          style={[
            styles.bio,
            { color: themeColors.text },
          ]}
        >
          ❤️ {likes} likes • 💬 {comments} comments
        </Text>

        <TouchableOpacity
          style={[
            styles.chatBtn,
            { backgroundColor: themeColors.text },
          ]}
        >
          <Text
            style={[
              styles.chatText,
              { color: themeColors.background },
            ]}
          >
            💬 Start Chat
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: themeColors.text },
        ]}
      >
        Posts by {username}
      </Text>
    </ScrollView>
  );
}

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
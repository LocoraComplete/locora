import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../config/api";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";

type User = {
  UserId: string;
  Handle: string;
  Name: string;
};

export default function Profile() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!storedUser) {
          router.replace("/(auth)/login");
          return;
        }

        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.log("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading)
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: themeColors.background }}
      />
    );

  if (!user) return null;

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
          <Text
            style={[
              styles.username,
              { color: themeColors.text },
            ]}
          >
            {user.Handle}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/settings")}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={themeColors.text}
            />
          </TouchableOpacity>
        </View>

        {/* PROFILE ROW */}
        <View style={styles.profileRow}>
          {/* AVATAR */}
          <View style={styles.avatarWrapper}>
            <View
              style={[
                styles.avatarBorder,
                { borderColor: themeColors.text },
              ]}
            >
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: themeColors.card },
                ]}
              >
                <Ionicons
                  name="person"
                  size={40}
                  color={themeColors.secondaryText}
                />
              </View>
            </View>

            <View
              style={[
                styles.plusIcon,
                { backgroundColor: themeColors.text },
              ]}
            >
              <Ionicons
                name="add"
                size={16}
                color="#fff"
              />
            </View>
          </View>

          {/* STATS */}
          <View style={styles.statsRow}>
            {["Posts", "Followers", "Following"].map(
              (label, index) => (
                <View style={styles.statItem} key={index}>
                  <Text
                    style={[
                      styles.statNumber,
                      { color: themeColors.text },
                    ]}
                  >
                    0
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      { color: themeColors.secondaryText },
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* NAME + BIO */}
        <View style={styles.bioBox}>
          <Text
            style={[
              styles.name,
              { color: themeColors.text },
            ]}
          >
            {user.Name}
          </Text>

          <Text
            style={[
              styles.bio,
              { color: themeColors.secondaryText },
            ]}
          >
            Welcome to Locora 🌍
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
            onPress={() => router.push("/profile")}
          >
            <Text
              style={[
                styles.buttonText,
                { color: themeColors.text },
              ]}
            >
              Edit Profile
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
          >
            <Text
              style={[
                styles.buttonText,
                { color: themeColors.text },
              ]}
            >
              Add Post
            </Text>
          </TouchableOpacity>
        </View>

        {/* NO POSTS */}
        <View style={styles.noPostsContainer}>
          <Text
            style={[
              styles.noPostsText,
              { color: themeColors.secondaryText },
            ]}
          >
            No posts yet
          </Text>
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
    position: "relative",
  },
  avatarBorder: {
    borderWidth: 3,
    borderRadius: 50,
    padding: 3,
  },
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
  },
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
  buttonText: {
    fontWeight: "600",
  },
  noPostsContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  noPostsText: {},
});
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";

export default function Settings() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const Section = ({ title }: { title: string }) => (
    <Text
      style={[
        styles.sectionTitle,
        { color: theme === "dark" ? "#aaa" : "#777" },
      ]}
    >
      {title}
    </Text>
  );

  const Item = ({
    label,
    onPress,
    danger,
  }: {
    label: string;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          borderBottomColor:
            theme === "dark" ? "#2a2a2a" : "#e5e5e5",
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.itemText,
          { color: themeColors.text },
          danger && styles.dangerText,
        ]}
      >
        {label}
      </Text>

      {!danger && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme === "dark" ? "#666" : "#999"}
        />
      )}
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  // ✅ Navigate to ChangePassword with userId in query string
  const goToChangePassword = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) {
      Alert.alert("Error", "User not logged in!");
      return;
    }
    const parsedUser = JSON.parse(storedUser);

    router.push({
      pathname: "/settings/change-password",
      params: { userId: parsedUser.UserId }, // ✅ must match schema
    });
  } catch (err) {
    console.log(err);
    Alert.alert("Error", "Could not load user ID");
  }
};

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ACCOUNT */}
        <Section title="Account" />
        <Item label="Change Password" onPress={goToChangePassword} />
        <Item label="Emergency Contact" onPress={() => router.push("/settings/change-emergency")} />
        <Item label="Language" onPress={() => router.push("/settings/language")} />
        <Item label="App Theme" onPress={() => router.push("/settings/theme")} />

        {/* PRIVACY & SECURITY */}
        <Section title="Privacy & Security" />
        <Item label="Privacy Policy" onPress={() => router.push("/settings/privacy")} />
        <Item label="Terms of Service" onPress={() => router.push("/settings/terms")} />

        {/* ABOUT */}
        <Section title="About" />
        <Item label="About Us" onPress={() => router.push("/settings/about")} />
        <Item label="App Version" onPress={() => router.push("/settings/version")} />
        <Item label="Contact Support" onPress={() => router.push("/settings/support")} />

        {/* DANGER ZONE */}
        <Section title="Danger Zone" />

        <TouchableOpacity
          style={[
            styles.item,
            {
              borderBottomColor:
                theme === "dark" ? "#2a2a2a" : "#e5e5e5",
            },
          ]}
          onPress={handleLogout}
        >
          <Text
            style={[styles.itemText, styles.boldText, { color: themeColors.text }]}
          >
            Log Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            {
              borderBottomColor:
                theme === "dark" ? "#2a2a2a" : "#e5e5e5",
            },
          ]}
          onPress={handleDelete}
        >
          <Text
            style={[styles.itemText, styles.dangerText]}
          >
            Delete Account
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    marginTop: 25,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
  },

  item: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemText: {
    fontSize: 15,
    fontWeight: "500",
  },

  boldText: {
    fontWeight: "700",
  },

  dangerText: {
    color: "#C70000",
  },
});
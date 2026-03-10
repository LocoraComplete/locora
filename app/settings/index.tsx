import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

export default function Settings() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

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
    Alert.alert(
      t("logout") || "Log Out",
      t("confirmLogout") || "Are you sure you want to log out?",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("logout") || "Log Out",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      t("deleteAccount") || "Delete Account",
      t("deleteAccountWarning") ||
        "This action is permanent and cannot be undone.",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("delete") || "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  // ✅ Navigate to ChangePassword with userId
  const goToChangePassword = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        Alert.alert(
          t("error") || "Error",
          t("userNotLoggedIn") || "User not logged in!"
        );
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      router.push({
        pathname: "/settings/change-password",
        params: { userId: parsedUser.UserId },
      });
    } catch (err) {
      console.log(err);

      Alert.alert(
        t("error") || "Error",
        t("userIdLoadError") || "Could not load user ID"
      );
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
        <Section title={t("account") || "Account"} />
        <Item
          label={t("changePassword") || "Change Password"}
          onPress={goToChangePassword}
        />
        <Item
          label={t("emergencyContact") || "Emergency Contact"}
          onPress={() => router.push("/settings/change-emergency")}
        />
        <Item
          label={t("language") || "Language"}
          onPress={() => router.push("/settings/language")}
        />
        <Item
          label={t("appTheme") || "App Theme"}
          onPress={() => router.push("/settings/theme")}
        />

        {/* PRIVACY */}
        <Section title={t("privacySecurity") || "Privacy & Security"} />
        <Item
          label={t("privacyPolicy") || "Privacy Policy"}
          onPress={() => router.push("/settings/privacy")}
        />
        <Item
          label={t("termsOfService") || "Terms of Service"}
          onPress={() => router.push("/settings/terms")}
        />

        {/* ABOUT */}
        <Section title={t("about") || "About"} />
        <Item
          label={t("aboutUs") || "About Us"}
          onPress={() => router.push("/settings/about")}
        />
        <Item
          label={t("appVersion") || "App Version"}
          onPress={() => router.push("/settings/version")}
        />
        <Item
          label={t("contactSupport") || "Contact Support"}
          onPress={() => router.push("/settings/support")}
        />

        {/* DANGER ZONE */}
        <Section title={t("dangerZone") || "Danger Zone"} />

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
            style={[
              styles.itemText,
              styles.boldText,
              { color: themeColors.text },
            ]}
          >
            {t("logout") || "Log Out"}
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
          onPress={() => router.push("/settings/delete")}
        >
          <Text style={[styles.itemText, styles.dangerText]}>
            {t("deleteAccount") || "Delete Account"}
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
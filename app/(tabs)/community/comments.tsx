import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";

const dummyComments = [
  { id: 1, user: "rahul_travels", text: "This place looks amazing!" },
  { id: 2, user: "wander_girl", text: "Adding this to my bucket list 😍" },
  { id: 3, user: "nomad_avi", text: "Went here last year, loved it!" },
];

export default function Comments() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();

  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const { t } = useLanguage();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderColor: themeColors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backArrow, { color: themeColors.text }]}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: themeColors.text }]}>
          {t("comments") || "Comments"}
        </Text>

        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.commentBox}>
        {dummyComments.map((c) => (
          <View
            key={c.id}
            style={[
              styles.commentCard,
              { backgroundColor: themeColors.card },
            ]}
          >
            <Text style={[styles.user, { color: themeColors.text }]}>
              {c.user}
            </Text>

            <Text style={[styles.comment, { color: themeColors.text }]}>
              {c.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },

  backArrow: {
    fontSize: 20,
  },

  title: {
    fontWeight: "900",
    fontSize: 16,
  },

  commentBox: {
    padding: 16,
  },

  commentCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  user: {
    fontWeight: "800",
    marginBottom: 4,
  },

  comment: {
    fontSize: 13,
  },
});
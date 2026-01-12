import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const dummyComments = [
  { id: 1, user: "rahul_travels", text: "This place looks amazing!" },
  { id: 2, user: "wander_girl", text: "Adding this to my bucket list 😍" },
  { id: 3, user: "nomad_avi", text: "Went here last year, loved it!" },
];

export default function Comments() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Comments</Text>

        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.commentBox}>
        {dummyComments.map((c) => (
          <View key={c.id} style={styles.commentCard}>
            <Text style={styles.user}>{c.user}</Text>
            <Text style={styles.comment}>{c.text}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-between",
  },

  backArrow: { fontSize: 20 },
  title: { fontWeight: "900", fontSize: 16 },

  commentBox: { padding: 16 },

  commentCard: {
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  user: { fontWeight: "800", marginBottom: 4 },
  comment: { fontSize: 13 },
});

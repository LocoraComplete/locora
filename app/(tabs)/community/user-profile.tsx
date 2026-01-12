import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function UserProfile() {
  const router = useRouter();
  const params: any = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image source={params.profilePic as any} style={styles.profilePic} />

        <Text style={styles.username}>{params.username}</Text>
        <Text style={styles.location}>{params.location}</Text>
        <Text style={styles.bio}>{params.bio}</Text>

        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatText}>💬 Start Chat</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Posts by {params.username}
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: "#fff" },
  back: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  profileCard: { alignItems: "center", marginTop: 6 },
  profilePic: { width: 90, height: 90, borderRadius: 45, marginBottom: 8 },
  username: { fontSize: 18, fontWeight: "700" },
  location: { fontSize: 13, color: "#777", marginTop: 2 },
  bio: { marginTop: 6, textAlign: "center" },
  chatBtn: {
    marginTop: 12,
    backgroundColor: "#FF5A5F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
  },
  chatText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { marginTop: 18, fontSize: 16, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  gridImage: { width: "48%", height: 160, borderRadius: 10 },
});

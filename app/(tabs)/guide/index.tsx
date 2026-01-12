import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 

const guides = [
  {
    id: "g1",
    name: "Rohan Singh",
    languages: ["Hindi", "English"],
    location: "Udaipur",
    experience: "5+",
    rating: 4.9,
    photo: require("../../../assets/images/guide1.jpg"),
  },
  {
    id: "g2",
    name: "Meera Vyas",
    languages: ["Hindi", "Marwari", "English"],
    location: "Jodhpur",
    experience: "8+",
    rating: 5.0,
    photo: require("../../../assets/images/guide2.jpg"),
  },
  {
    id: "g3",
    name: "Vikram Shekhawat",
    languages: ["Hindi", "English", "French"],
    location: "Jaipur",
    experience: "12+",
    rating: 4.8,
    photo: require("../../../assets/images/guide1.jpg"),
  },
];

export default function Guide() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header + Search */}
      <Text style={styles.heading}>Guide Directory</Text>

      <TextInput
        style={styles.search}
        placeholder="Search by city or language..."
        placeholderTextColor="#777"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {guides.map((guide) => (
          <TouchableOpacity
            key={guide.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/guide/detail",
                params: {
                  id: guide.id,
                  name: guide.name,
                  location: guide.location,
                  rating: guide.rating,
                  experience: guide.experience,
                  languages: JSON.stringify(guide.languages),
                },
              })
            }
          >
            {/* Image + Rating */}
            <View>
              <Image source={guide.photo} style={styles.image} />
              <View style={styles.ratingTag}>
                <Text style={styles.ratingText}>⭐ {guide.rating}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.info}>
              <Text style={styles.name}>{guide.name}</Text>

              <View style={{ marginBottom: 6 }}>
                <Text style={styles.tag}>
                  🗣 {guide.languages.join(", ")}
                </Text>
              </View>

              <View style={{ marginBottom: 6 }}>
                <Text style={styles.tag}>
                  🎖 {guide.experience} yrs Experience
                </Text>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.location}>{guide.location}, Rajasthan</Text>
                <Text style={styles.profileLink}>Profile →</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },
  heading: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  search: {
    backgroundColor: "#F1F1F1",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  image: { width: 90, height: 110, borderRadius: 16 },
  ratingTag: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#C97800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: { color: "#fff", fontWeight: "800", fontSize: 10 },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  tag: { fontSize: 12, fontWeight: "600", color: "#444" },
  footerRow: { flexDirection: "row", justifyContent: "space-between" },
  location: { fontSize: 11, color: "#777" },
  profileLink: { fontSize: 11, fontWeight: "900", color: "#C97800" },
});

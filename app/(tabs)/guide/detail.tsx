import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ proper SafeAreaView

export default function GuideDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const languages = params.languages
    ? JSON.parse(params.languages as string)
    : [];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Official Verification</Text>

          <View style={{ width: 20 }} />
        </View>

        {/* Profile */}
        <View style={styles.profileRow}>
          <Image
            source={require("../../../assets/images/guide1.jpg")}
            style={styles.profileImg}
          />

          <View>
            <Text style={styles.name}>{params.name}</Text>
            <Text style={{ fontSize: 12, color: "#666", fontWeight: "600" }}>
              Certified Guide — {params.location}
            </Text>
          </View>
        </View>

        {/* Verification Cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tourism License</Text>

          <View style={styles.licenseBox}>
            <Text style={styles.licenseId}>LICENSE ID: RTD-2024-X452</Text>
            <Text style={styles.verifiedText}>Verified by Rajasthan Tourism Dept.</Text>
          </View>
        </View>

        <View style={styles.cardBlue}>
          <Text style={styles.cardTitleBlue}>Identity Proof</Text>

          <View style={styles.verifyRow}>
            <Text style={styles.verifyTitle}>IDENTITY VERIFIED</Text>
            <Text style={styles.verifyBadge}>VERIFIED</Text>
          </View>
        </View>

        {/* Booking Button */}
        <TouchableOpacity style={styles.bookBtn}>
          <Text style={styles.bookText}>Book Guided Tour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#FFFFFF" }, // ✅ Safe area background
  container: { paddingBottom: 40 }, // ScrollView content

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backBtn: { padding: 6, marginRight: 6 },
  headerTitle: { fontWeight: "700", fontSize: 12, color: "#666" },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  profileImg: { width: 70, height: 70, borderRadius: 16 },
  name: { fontSize: 18, fontWeight: "900", marginBottom: 4 },

  card: {
    margin: 14,
    padding: 16,
    backgroundColor: "#FFF7E6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD9A8",
  },
  cardTitle: {
    fontWeight: "900",
    fontSize: 11,
    marginBottom: 8,
    color: "#7A4C00",
  },
  licenseBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#FFCC8A",
    alignItems: "center",
  },
  licenseId: { fontWeight: "800", fontSize: 12, color: "#7A4C00" },
  verifiedText: { fontSize: 10, color: "#997754" },

  cardBlue: {
    margin: 14,
    padding: 16,
    backgroundColor: "#EAF2FF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BBD3FF",
  },
  cardTitleBlue: {
    fontWeight: "900",
    fontSize: 11,
    marginBottom: 8,
    color: "#1F3B7A",
  },
  verifyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  verifyTitle: { fontSize: 12, fontWeight: "800" },
  verifyBadge: {
    fontSize: 10,
    fontWeight: "900",
    backgroundColor: "#C6DBFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  bookBtn: {
    margin: 16,
    backgroundColor: "#C97800",
    padding: 16,
    borderRadius: 20,
  },
  bookText: {
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
  },
});

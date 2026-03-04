import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";

export default function GuideDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const languages = params.languages
    ? JSON.parse(params.languages as string)
    : [];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderColor: themeColors.border },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={{ fontSize: 18, color: themeColors.text }}>←</Text>
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: themeColors.text }]}
          >
            Official Verification
          </Text>

          <View style={{ width: 20 }} />
        </View>

        {/* Profile */}
        <View style={styles.profileRow}>
          <Image
            source={require("../../../assets/images/guide1.jpg")}
            style={styles.profileImg}
          />

          <View>
            <Text
              style={[styles.name, { color: themeColors.text }]}
            >
              {params.name}
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: themeColors.secondaryText,
                fontWeight: "600",
              }}
            >
              Certified Guide — {params.location}
            </Text>
          </View>
        </View>

        {/* Tourism License Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme === "dark"
                  ? themeColors.card
                  : "#FFF7E6",
              borderColor:
                theme === "dark"
                  ? themeColors.border
                  : "#FFD9A8",
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: themeColors.text },
            ]}
          >
            Tourism License
          </Text>

          <View
            style={[
              styles.licenseBox,
              {
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.licenseId,
                { color: themeColors.text },
              ]}
            >
              LICENSE ID: RTD-2024-X452
            </Text>

            <Text
              style={[
                styles.verifiedText,
                { color: themeColors.secondaryText, },
              ]}
            >
              Verified by Rajasthan Tourism Dept.
            </Text>
          </View>
        </View>

        {/* Identity Verification Card */}
        <View
          style={[
            styles.cardBlue,
            {
              backgroundColor:
                theme === "dark"
                  ? themeColors.card
                  : "#EAF2FF",
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitleBlue,
              { color: themeColors.text },
            ]}
          >
            Identity Proof
          </Text>

          <View
            style={[
              styles.verifyRow,
              { backgroundColor: themeColors.background },
            ]}
          >
            <Text
              style={[
                styles.verifyTitle,
                { color: themeColors.text },
              ]}
            >
              IDENTITY VERIFIED
            </Text>

            <Text
              style={[
                styles.verifyBadge,
                {
                  backgroundColor:
                    theme === "dark"
                      ? themeColors.border
                      : "#C6DBFF",
                  color: themeColors.text,
                },
              ]}
            >
              VERIFIED
            </Text>
          </View>
        </View>

        {/* Booking Button */}
        <TouchableOpacity
          style={[
            styles.bookBtn,
            { backgroundColor: themeColors.text },
          ]}
        >
          <Text
            style={[
              styles.bookText,
              { color: themeColors.background },
            ]}
          >
            Book Guided Tour
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  backBtn: { padding: 6 },
  headerTitle: {
    fontWeight: "700",
    fontSize: 12,
  },

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
    borderRadius: 20,
    borderWidth: 1,
  },
  cardTitle: {
    fontWeight: "900",
    fontSize: 11,
    marginBottom: 8,
  },
  licenseBox: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },
  licenseId: { fontWeight: "800", fontSize: 12 },
  verifiedText: { fontSize: 10 },

  cardBlue: {
    margin: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardTitleBlue: {
    fontWeight: "900",
    fontSize: 11,
    marginBottom: 8,
  },
  verifyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
  },
  verifyTitle: { fontSize: 12, fontWeight: "800" },
  verifyBadge: {
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  bookBtn: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
  },
  bookText: {
    fontWeight: "900",
    textAlign: "center",
  },
});
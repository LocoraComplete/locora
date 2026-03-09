import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";

export default function GuideDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log("Guide params:", params);

  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const languages = params.languages
    ? JSON.parse(params.languages as string)
    : [];

  const handleCall = () => {
    if (params.phone) {
      Linking.openURL(`tel:${params.phone}`);
    }
  };

  const handleEmail = () => {
    if (params.email) {
      Linking.openURL(`mailto:${params.email}`);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: themeColors.background }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

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
              {t("officialVerification") || "Official Verification"}
            </Text>

            <View style={{ width: 20 }} />
          </View>

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
                {t("certifiedGuide") || "Certified Guide"} — {params.location}
              </Text>
            </View>
          </View>

          {/* CONTACT BUTTONS */}
          <View style={styles.contactRow}>

            <TouchableOpacity
              style={[
                styles.contactBtn,
                { borderColor: themeColors.text }
              ]}
              onPress={handleCall}
            >
              <Text
                style={[
                  styles.contactText,
                  { color: themeColors.text }
                ]}
              >
                📞 {t("call") || "Call"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contactBtn,
                { borderColor: themeColors.text }
              ]}
              onPress={handleEmail}
            >
              <Text
                style={[
                  styles.contactText,
                  { color: themeColors.text }
                ]}
              >
                ✉ {t("email") || "Email"}
              </Text>
            </TouchableOpacity>

          </View>

          {/* Tourism License */}
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
              {t("tourismLicense") || "Tourism License"}
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
                {t("licenseId") || "LICENSE ID"}: RTD-2024-X452
              </Text>

              <Text
                style={[
                  styles.verifiedText,
                  { color: themeColors.secondaryText },
                ]}
              >
                {t("verifiedByTourism") || "Verified by Rajasthan Tourism Dept."}
              </Text>
            </View>
          </View>

          {/* Identity */}
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
              {t("identityProof") || "Identity Proof"}
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
                {t("identityVerified") || "IDENTITY VERIFIED"}
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
                {t("verified") || "VERIFIED"}
              </Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
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

  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 10
  },

  contactBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1
  },

  contactText: {
    fontWeight: "800",
    fontSize: 14
  },

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
});
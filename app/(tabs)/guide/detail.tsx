import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../../config/api";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

export default function GuideDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const [selectedRating, setSelectedRating] = useState(0);
  const [userId, setUserId] = useState("");

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

  const submitRating = async (rating: number) => {
    try {
      setSelectedRating(rating);

      await axios.post(`${API_BASE_URL}/api/guide/rate`, {
        GuideId: params.id,
        UserId: userId,
        rating,
      });
    } catch (error) {
      console.log("Rating error:", error);
    }
  };

  useEffect(() => {
    const loadUserAndRating = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        setUserId(user.UserId);

        const res = await axios.get(
          `${API_BASE_URL}/api/guide/user-rating`,
          {
            params: {
              GuideId: params.id,
              UserId: user.UserId,
            },
          }
        );

        setSelectedRating(res.data.rating || 0);
      } catch (error) {
        console.log("User rating fetch error:", error);
      }
    };

    loadUserAndRating();
  }, []);


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={[styles.header, { borderColor: themeColors.border }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={{ fontSize: 18, color: themeColors.text }}>←</Text>
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: themeColors.text }]}>
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
              <Text style={[styles.name, { color: themeColors.text }]}>
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

              <Text
                style={{
                  fontSize: 12,
                  color: themeColors.secondaryText,
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                ⭐ Admin Rating: {Number(params.rating).toFixed(1)}
              </Text>

            </View>
          </View>

          {/* CONTACT BUTTONS */}
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={[styles.contactBtn, { borderColor: themeColors.text }]}
              onPress={handleCall}
            >
              <Text style={[styles.contactText, { color: themeColors.text }]}>
                📞 {t("call") || "Call"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactBtn, { borderColor: themeColors.text }]}
              onPress={handleEmail}
            >
              <Text style={[styles.contactText, { color: themeColors.text }]}>
                ✉ {t("email") || "Email"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* STAR RATING */}
          <View style={styles.ratingContainer}>
            <Text style={[styles.rateTitle, { color: themeColors.text }]}>
              {t("rateGuide") || "Rate this guide"}
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => submitRating(star)}
                >
                  <Text style={styles.star}>
                    {star <= selectedRating ? "⭐" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tourism License */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme === "dark" ? themeColors.card : "#FFF7E6",
                borderColor: theme === "dark" ? themeColors.border : "#FFD9A8",
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>
              {t("tourismLicense") || "Tourism License"}
            </Text>

            <Image
              source={require("../../../assets/images/tourism_license.jpeg")}
              style={styles.licenseImage}
              resizeMode="contain"
            />
          </View>

          {/* Identity Proof */}
          <View
            style={[
              styles.cardBlue,
              {
                backgroundColor: theme === "dark" ? themeColors.card : "#EAF2FF",
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.cardTitleBlue, { color: themeColors.text }]}>
              {t("identityProof") || "Identity Proof"}
            </Text>

            <Image
              source={require("../../../assets/images/identity_proof.jpeg")}
              style={styles.licenseImage}
              resizeMode="contain"
            />
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
  headerTitle: { fontWeight: "700", fontSize: 12 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  contactBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  contactText: {
    fontWeight: "800",
    fontSize: 14,
  },
  rateTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  starRow: {
    flexDirection: "row",
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
    marginBottom: 12,
  },
  cardBlue: {
    margin: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardTitleBlue: {
    fontWeight: "900",
    fontSize: 11,
    marginBottom: 12,
  },
  licenseImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  ratingContainer: {
  marginHorizontal: 16,
  marginBottom: 20,
},
ratingTitle: {
  fontSize: 15,
  fontWeight: "800",
  marginBottom: 10,
},
starsRow: {
  flexDirection: "row",
},
star: {
  fontSize: 34,
  marginRight: 8,
},
});
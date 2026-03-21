import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

export default function PostDetails() {
  const { name, description, image } = useLocalSearchParams();

  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const { t } = useLanguage();

  const imageSource =
    image && typeof image === "string"
      ? { uri: image }
      : require("@/assets/images/amber-fort.jpg");

  // ✅ KEEP THIS EXACTLY (DO NOT CHANGE)
  const openDirections = async () => {
    if (!name) return;

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const origin = `${location.coords.latitude},${location.coords.longitude}`;
      const destination = encodeURIComponent(name as string);

      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

      Linking.openURL(url);
    } catch (error) {
      console.log("Error getting location:", error);
      Alert.alert("Error", "Unable to fetch location.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView>
        <Image source={imageSource} style={styles.image} />

        <View style={{ padding: 16 }}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {name}
          </Text>

          <Text style={[styles.description, { color: themeColors.text }]}>
            {description}
          </Text>

          {/* ✅ ONLY BUTTON LEFT */}
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor:
                  theme === "dark" ? themeColors.card : themeColors.border,
              },
            ]}
            onPress={openDirections}
          >
            <Text
              style={[styles.secondaryButtonText, { color: themeColors.text }]}
            >
              {t("checkDistance") || "Check Distance "}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 280,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  secondaryButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "bold",
  },
});
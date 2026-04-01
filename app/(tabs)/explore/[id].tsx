import axios from "axios";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

import { API_BASE_URL } from "../../../config/api";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

export default function PostDetails() {
  const { id, category } = useLocalSearchParams();

  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;
  const { t, language } = useLanguage();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchItem = async () => {
    try {
      let data = null;

      // PLACES 
      if (category === "places") {
        const res = await axios.get(
          `${API_BASE_URL}/api/places/${id}?lang=${language}`
        );
        data = res.data;
      }

      // EVENTS → fetch all then filter
      if (category === "events") {
        const res = await axios.get(
          `${API_BASE_URL}/api/events?lang=${language}`
        );
        data = res.data.find((e: any) => e.EventId === id);
      }

      // FOOD → fetch all then filter
      if (category === "food") {
        const res = await axios.get(
          `${API_BASE_URL}/api/food?lang=${language}`
        );
        data = res.data.find((f: any) => f.FoodId === id);
      }

      setData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (id && category) fetchItem();
}, [id, category, language]);

  const openDirections = async () => {
    if (!data?.Name) return;

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      let locationCoords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const origin = `${locationCoords.coords.latitude},${locationCoords.coords.longitude}`;
      const destination = encodeURIComponent(data.Name);

      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

      Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Unable to fetch location.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!data) return null;

  const imageSource =
    data.ImageURL && data.ImageURL.startsWith("http")
      ? { uri: data.ImageURL }
      : require("@/assets/images/amber-fort.jpg");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView>
        <Image source={imageSource} style={styles.image} />

        <View style={{ padding: 16 }}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {data.Name}
          </Text>

          <View style={{ marginBottom: 10 }}>
            {category === "places" && data.Location && (
              <Text style={{ color: themeColors.text }}>
                📍 {data.Location}
              </Text>
            )}

            {(category === "food") && data.Type && (
              <Text style={{ color: themeColors.text }}>
                🏷 {data.Type}
              </Text>
            )}

            {category === "food" && data.PriceRange && (
              <Text style={{ color: themeColors.text }}>
                💰 {data.PriceRange}
              </Text>
            )}

            {category === "events" && data.Date && (
              <Text style={{ color: themeColors.text }}>
                📅 {new Date(data.Date).toDateString()}
              </Text>
            )}
          </View>

          <Text style={[styles.description, { color: themeColors.text }]}>
            {data.Description}
          </Text>

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
              {t("viewMap") || "View Map"}
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
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapPicker() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [coords, setCoords] = useState({
    latitude: 26.2389,
    longitude: 73.0243,
  });
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    const result = await Location.reverseGeocodeAsync({ latitude, longitude });
    const place = result?.[0];

    const formatted = [
      place?.name,
      place?.street,
      place?.city,
      place?.region,
    ]
      .filter(Boolean)
      .join(", ");

    setAddress(formatted || "Hidden Spot");
  };

  const fetchCurrentLocation = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setCoords({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const searchLocation = async () => {
    if (!searchText.trim()) return;

    const results = await Location.geocodeAsync(searchText);

    if (!results.length) {
      Alert.alert("Location not found");
      return;
    }

    const place = results[0];
    setCoords({
      latitude: place.latitude,
      longitude: place.longitude,
    });

    reverseGeocode(place.latitude, place.longitude);
  };

  const confirmLocation = () => {
    router.replace({
      pathname: "/add-post",
      params: {
        customPlaceName: address || searchText || "Hidden Spot",
        customLatitude: coords.latitude.toString(),
        customLongitude: coords.longitude.toString(),
        customAddress: address,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pick a Hidden Spot 📍</Text>
        <Text style={styles.subtitle}>
          Search or use your live location for your travel post
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={20} color="#64748b" />
        <TextInput
          placeholder="Search precise location..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={searchLocation}>
        <Ionicons name="location-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>Search Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={fetchCurrentLocation}
      >
        <Ionicons name="navigate-outline" size={18} color="#0f172a" />
        <Text style={styles.secondaryButtonText}>Use Current Location</Text>
      </TouchableOpacity>

      {/* Location Preview Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="pin" size={18} color="#ef4444" />
          <Text style={styles.cardTitle}>Selected Location</Text>
        </View>

        <Text style={styles.addressText}>
          {address || "No location selected yet"}
        </Text>

        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>Latitude</Text>
          <Text style={styles.coordValue}>{coords.latitude.toFixed(6)}</Text>
        </View>

        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>Longitude</Text>
          <Text style={styles.coordValue}>{coords.longitude.toFixed(6)}</Text>
        </View>
      </View>

      {/* Confirm */}
      <TouchableOpacity style={styles.confirmButton} onPress={confirmLocation}>
        <Ionicons name="checkmark-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>Confirm Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },

  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#0f172a",
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#2563eb",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  confirmButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: "auto",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#16a34a",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  secondaryButtonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },

  addressText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
    marginBottom: 18,
  },

  coordBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  coordLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },

  coordValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
});
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
      <TextInput
        placeholder="Search precise location..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={searchLocation}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={fetchCurrentLocation}>
        <Text style={styles.buttonText}>Use Current Location</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text>{address || "No location selected yet"}</Text>
        <Text>
          {coords.latitude}, {coords.longitude}
        </Text>
      </View>

      <TouchableOpacity style={styles.confirm} onPress={confirmLocation}>
        <Text style={styles.buttonText}>Confirm Location</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0095f6",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  confirm: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
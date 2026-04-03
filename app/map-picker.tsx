import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapPicker() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [searchText, setSearchText] = useState("");
  const [region, setRegion] = useState<Region>({
    latitude: 26.2389,
    longitude: 73.0243,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [marker, setMarker] = useState({
    latitude: 26.2389,
    longitude: 73.0243,
  });

  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(newRegion);
      setMarker({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      });

      mapRef.current?.animateToRegion(newRegion, 1000);
      reverseGeocode(newRegion.latitude, newRegion.longitude);
    } catch (error) {
      console.log("LOCATION ERROR", error);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
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

      setAddress(formatted || "Selected hidden spot");
    } catch (error) {
      console.log("REVERSE GEOCODE ERROR", error);
    }
  };

  const searchLocation = async () => {
    if (!searchText.trim()) return;

    try {
      const results = await Location.geocodeAsync(searchText);

      if (!results.length) {
        Alert.alert("Location not found");
        return;
      }

      const place = results[0];

      const newRegion = {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(newRegion);
      setMarker({
        latitude: place.latitude,
        longitude: place.longitude,
      });

      mapRef.current?.animateToRegion(newRegion, 1000);
      reverseGeocode(place.latitude, place.longitude);
    } catch (error) {
      console.log("SEARCH ERROR", error);
      Alert.alert("Could not search this location");
    }
  };

  const confirmLocation = () => {
    router.replace({
      pathname: "/add-post",
      params: {
        customPlaceName: address || "Hidden Spot",
        customLatitude: marker.latitude.toString(),
        customLongitude: marker.longitude.toString(),
        customAddress: address,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search precise location..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
        />

        <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setMarker({ latitude, longitude });
          reverseGeocode(latitude, longitude);
        }}
      >
        <Marker
          coordinate={marker}
          draggable
          onDragEnd={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setMarker({ latitude, longitude });
            reverseGeocode(latitude, longitude);
          }}
        />
      </MapView>

      <View style={styles.bottomCard}>
        <Text style={styles.addressText}>{address || "Tap map to select spot"}</Text>

        <TouchableOpacity style={styles.currentButton} onPress={fetchCurrentLocation}>
          <Text style={styles.buttonText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={confirmLocation}>
          <Text style={styles.buttonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: "#0095f6",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  map: {
    flex: 1,
  },
  bottomCard: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  addressText: {
    fontSize: 14,
  },
  currentButton: {
    backgroundColor: "#555",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#0095f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

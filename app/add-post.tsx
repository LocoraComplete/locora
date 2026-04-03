import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../config/api";
import { useLanguage } from "../context/languagecontext";

const SCREEN_WIDTH = Dimensions.get("window").width;

type SelectedPlaceType = {
  PlaceId: string;
  PlaceName: string;
  Latitude: number;
  Longitude: number;
  Address: string;
};

export default function AddPost() {
  const router = useRouter();
  const { t } = useLanguage();

  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= NEW STATES =================
  const params = useLocalSearchParams();
  const [locationModal, setLocationModal] = useState(false);
  const [searchPlace, setSearchPlace] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<SelectedPlaceType | null>(null);

  // ================= FETCH PLACES + FOOD =================
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [placesRes, foodRes] = await Promise.all([
          api.get("/api/places"),
          api.get("/api/food"),
        ]);

        const merged = [
          {
            PlaceId: "other",
            Name: "Other",
            isOther: true,
          },
          ...(placesRes.data || []),
          ...(foodRes.data || []),
        ];

        setPlaces(merged);
      } catch (error) {
        console.log("LOCATION FETCH ERROR:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (!params.customLatitude || !params.customLongitude) return;

    const customPlaceName = Array.isArray(params.customPlaceName)
      ? params.customPlaceName[0]
      : params.customPlaceName;

    const customAddress = Array.isArray(params.customAddress)
      ? params.customAddress[0]
      : params.customAddress;

    const nextPlace: SelectedPlaceType = {
      PlaceId: "custom",
      PlaceName: customPlaceName || "Hidden Spot",
      Latitude: Number(params.customLatitude),
      Longitude: Number(params.customLongitude),
      Address: customAddress || "",
    };

    setSelectedPlace((prev: SelectedPlaceType | null) => {
      if (
        prev?.Latitude === nextPlace.Latitude &&
        prev?.Longitude === nextPlace.Longitude
      ) {
        return prev;
      }
      return nextPlace;
    });
  }, [
    params.customLatitude,
    params.customLongitude,
    params.customPlaceName,
    params.customAddress,
  ]);

  useEffect(() => {
    const restoreDraft = async () => {
      const draft = await AsyncStorage.getItem("addPostDraft");
      if (!draft) return;

      const parsed = JSON.parse(draft);

      if (parsed.images) setImages(parsed.images);
      if (parsed.caption) setCaption(parsed.caption);
      if (parsed.selectedPlace) setSelectedPlace(parsed.selectedPlace);
    };

    restoreDraft();
  }, []);

  // ================= FILTERED DROPDOWN =================
  const filteredPlaces = useMemo(() => {
    if (!searchPlace.trim()) return places;

    return places.filter((item) =>
      item.Name?.toLowerCase().includes(searchPlace.toLowerCase())
    );
  }, [places, searchPlace]);

  // ================= PICK MULTIPLE IMAGES =================
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(t("permissionRequired"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
        selectionLimit: 10,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const uris = result.assets.map((asset) => asset.uri);
        setImages(uris);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  // ============== SAVE DRAFT ====================
  const saveDraft = async () => {
    await AsyncStorage.setItem(
      "addPostDraft",
      JSON.stringify({
        images,
        caption,
        selectedPlace,
      })
    );
  };

  // ================= SELECT PLACE =================
  const handleSelectPlace = (item: any) => {
    setLocationModal(false);

    if (item.isOther) {
      saveDraft();
      router.push("/map-picker");
      return;
    }

    setSelectedPlace({
      PlaceId: item.PlaceId || item.FoodId,
      PlaceName: item.Name,
      Latitude: item.Latitude,
      Longitude: item.Longitude,
      Address: item.Location || "",
    });
  };

  // ================= CREATE POST =================
  const handlePost = async () => {
    if (images.length === 0) {
      Alert.alert(t("selectImageFirst"));
      return;
    }

    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) {
      return Alert.alert(t("userNotFound"));
    }

    const parsedUser = JSON.parse(storedUser);

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("UserId", parsedUser.UserId);
      formData.append("Caption", caption);

      // ================= LOCATION DATA =================
      formData.append("PlaceId", selectedPlace?.PlaceId || "");
      formData.append("PlaceName", selectedPlace?.PlaceName || "");
      formData.append(
        "Latitude",
        selectedPlace?.Latitude?.toString() || ""
      );
      formData.append(
        "Longitude",
        selectedPlace?.Longitude?.toString() || ""
      );
      formData.append("Address", selectedPlace?.Address || "");

      for (let i = 0; i < images.length; i++) {
        let imgUri = images[i];

        const filename = `upload-${Date.now()}-${i}.jpg`;
        const newPath = FileSystem.cacheDirectory + filename;

        await FileSystem.copyAsync({
          from: imgUri,
          to: newPath,
        });

        const finalUri = newPath;

        formData.append("images", {
          uri: finalUri,
          name: filename,
          type: "image/jpeg",
        } as any);
      }

      await api.post("/api/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await AsyncStorage.removeItem("addPostDraft");
      Alert.alert(t("postCreated"));
      router.push("/(tabs)/profile");
    } catch (err: any) {
      console.log("UPLOAD ERROR FULL:", err);
      Alert.alert(t("postError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} />
          </TouchableOpacity>

          <Text style={styles.title}>{t("newPost")}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* IMAGE PICKER */}
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {images.length > 0 ? (
              <FlatList
                data={images}
                horizontal
                pagingEnabled
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.imageSlide}>
                    <Image source={{ uri: item }} style={styles.image} />
                  </View>
                )}
              />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="image-outline" size={80} color="#aaa" />
                <Text style={styles.selectText}>{t("tapToSelectImage")}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* CAPTION */}
          <TextInput
            placeholder="Write a caption..."
            value={caption}
            onChangeText={setCaption}
            style={styles.captionInput}
            multiline
          />

          {/* LOCATION DROPDOWN */}
          <TouchableOpacity
            style={styles.locationBox}
            onPress={() => setLocationModal(true)}
          >
            <Text>{selectedPlace?.PlaceName || "Tag place"}</Text>
          </TouchableOpacity>

          {/* SHARE BUTTON */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.shareButton,
                {
                  backgroundColor: images.length > 0 ? "#0095f6" : "#ccc",
                },
              ]}
              onPress={handlePost}
              disabled={images.length === 0 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.shareText}>{t("share")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* LOCATION MODAL */}
      <Modal visible={locationModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <TextInput
            placeholder="Search place..."
            value={searchPlace}
            onChangeText={setSearchPlace}
            style={styles.searchInput}
          />

          <FlatList
            data={filteredPlaces}
            keyExtractor={(item, index) =>
              `${item.PlaceId || item.FoodId || item.Name}-${index}`
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.placeItem}
                onPress={() => handleSelectPlace(item)}
              >
                <Text>{item.Name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.closeModal}
            onPress={() => setLocationModal(false)}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  imageContainer: {
    height: 300, // Fixed height so it doesn't vanish in ScrollView
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  imageSlide: {
    width: SCREEN_WIDTH,
    height: "100%",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  placeholder: {
    alignItems: "center",
  },

  selectText: {
    marginTop: 12,
    fontSize: 16,
    color: "#777",
  },

  captionInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 16,
    minHeight: 100, // Increased height for better visibility
    textAlignVertical: "top",
  },

  locationBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },

  searchInput: {
    margin: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },

  placeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  closeModal: {
    margin: 16,
    backgroundColor: "#0095f6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  bottomContainer: {
    padding: 16,
    marginTop: 'auto', // Pushes button down
  },

  shareButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  shareText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
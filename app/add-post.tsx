import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../config/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ fixed
console.log("API BASE URL:", api.defaults.baseURL);
export default function AddPost() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert("Permission required");
    return;
  }

 const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.8,
});
  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};

  const handlePost = async () => {
    if (!image) {
      Alert.alert("Select an image first");
      return;
    }

    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) return Alert.alert("User not found");

    const parsedUser = JSON.parse(storedUser);

    try {
      setLoading(true);

      const formData = new FormData();

formData.append("UserId", parsedUser.UserId);

const filename = image.split("/").pop() || `photo-${Date.now()}.jpg`;
const match = /\.(\w+)$/.exec(filename);
let type = "image/jpeg";
if (match) {
  const ext = match[1].toLowerCase();
  type = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
}

// Important: type assertion for Expo
formData.append("image", {
  uri: image,
  name: filename,
  type,
} as any);

      const response = await api.post("/api/posts/create", formData, {
  headers: { "Content-Type": "multipart/form-data" },
  transformRequest: (data) => data, // prevent Axios from messing with FormData
});

      console.log("POST RESPONSE:", response.data);

      Alert.alert("Post created successfully ✅");
      router.push("/(tabs)/profile");
    } catch (err: any) {
      console.log("POST ERROR:", err?.response?.data || err.message);
      Alert.alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>New Post</Text>
        <View style={{ width: 28 }} />
      </View>

      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={80} color="#aaa" />
            <Text style={styles.selectText}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.shareButton,
            { backgroundColor: image ? "#0095f6" : "#ccc" },
          ]}
          onPress={handlePost}
          disabled={!image || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.shareText}>Share</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "700" },
  imageContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  selectText: { marginTop: 15, color: "#777", fontSize: 14 },
  bottomContainer: {
    padding: 15,
    borderTopWidth: 0.5,
    borderColor: "#ddd",
  },
  shareButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  shareText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
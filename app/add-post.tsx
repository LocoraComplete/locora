import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../context/languagecontext";

import api from "../config/api";
console.log("API BASE URL:", api.defaults.baseURL);

export default function AddPost() {
  const router = useRouter();
  const { t } = useLanguage();

  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= PICK MULTIPLE IMAGES =================
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(t("permissionRequired"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris);
    }
  };

  // ================= CREATE POST =================
  const handlePost = async () => {
    if (images.length === 0) {
      Alert.alert(t("selectImageFirst"));
      return;
    }

    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) return Alert.alert(t("userNotFound"));

    const parsedUser = JSON.parse(storedUser);

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("UserId", parsedUser.UserId);
      formData.append("Caption", caption);

      images.forEach((img, index) => {
        const filename = img.split("/").pop() || `photo-${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);

        let type = "image/jpeg";
        if (match) {
          const ext = match[1].toLowerCase();
          type = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
        }

        formData.append("images", {
          uri: img,
          name: filename,
          type,
        } as any);
      });

      const response = await api.post(
        "/api/posts/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: (data) => data,
        }
      );

      console.log("POST RESPONSE:", response.data);

      Alert.alert(t("postCreated"));
      router.push("/(tabs)/profile");
    } catch (err: any) {
      console.log(
        "POST ERROR:",
        err?.response?.data || err.message
      );
      Alert.alert(t("postError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>

        <Text style={styles.title}>{t("newPost")}</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* IMAGE PICKER */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={pickImage}
      >
        {images.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.image} />
              )}
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="image-outline"
              size={80}
              color="#aaa"
            />
            <Text style={styles.selectText}>
              {t("tapToSelectImage")}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* CAPTION INPUT */}
      <TextInput
        placeholder="Write a caption..."
        value={caption}
        onChangeText={setCaption}
        style={styles.captionInput}
        multiline
      />

      {/* SHARE BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.shareButton,
            { backgroundColor: images.length > 0 ? "#0095f6" : "#ccc" },
          ]}
          onPress={handlePost}
          disabled={images.length === 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.shareText}>
              {t("share")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ================= STYLES =================
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    minHeight: 60,
    textAlignVertical: "top",
  },

  bottomContainer: {
    padding: 16,
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
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../config/api";
import { useLanguage } from "../context/languagecontext";

export default function AddPost() {
  const router = useRouter();
  const { t } = useLanguage();

  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setDebugLog((prev) => [...prev, msg]);
  };

  // ================= PICK MULTIPLE IMAGES =================
  const pickImage = async () => {
    addLog("📸 Requesting media permission");

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    addLog(`📸 Permission: ${JSON.stringify(permission)}`);

    if (!permission.granted) {
      Alert.alert(t("permissionRequired"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    addLog(`📸 Picker result: ${JSON.stringify(result)}`);

    if (!result.canceled && result.assets?.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      addLog(`🖼️ Selected ${uris.length} images`);
      setImages(uris);
    } else {
      addLog("❌ No assets returned from picker");
    }
  };

  // ================= CREATE POST =================
  const handlePost = async () => {
    addLog("🚀 Handle post started");

    if (images.length === 0) {
      addLog("⚠️ No images selected");
      Alert.alert(t("selectImageFirst"));
      return;
    }

    const storedUser = await AsyncStorage.getItem("user");
    addLog(`👤 Stored user: ${storedUser}`);

    if (!storedUser) {
      addLog("❌ User not found");
      return Alert.alert(t("userNotFound"));
    }

    const parsedUser = JSON.parse(storedUser);

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("UserId", parsedUser.UserId);
      formData.append("Caption", caption);

      addLog(`📝 Caption: ${caption}`);
      addLog(`👤 UserId: ${parsedUser.UserId}`);

      images.forEach((img, index) => {
        const filename =
          img.split("/").pop() ||
          `photo-${Date.now()}-${index}.jpg`;

        const ext =
          filename.split(".").pop()?.toLowerCase() || "jpg";

        const type =
          ext === "jpg" || ext === "jpeg"
            ? "image/jpeg"
            : `image/${ext}`;

        formData.append("images", {
          uri: img,
          name: filename,
          type,
        } as any);
      });

      addLog("📦 Sending POST request");

      const response = await api.post(
        "/api/posts/create",
        formData
      );

      addLog(`✅ Success: ${JSON.stringify(response.data)}`);

      Alert.alert(t("postCreated"));
      router.push("/(tabs)/profile");
    } catch (err: any) {
      addLog(`❌ Error message: ${err?.message}`);
      addLog(
        `❌ Error response: ${JSON.stringify(
          err?.response?.data || {}
        )}`
      );

      Alert.alert(t("postError"));
    } finally {
      setLoading(false);
      addLog("🔄 Loading finished");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* DEBUG OVERLAY */}
      <View style={styles.debugOverlay}>
        <ScrollView>
          {debugLog.map((log, index) => (
            <Text key={index} style={styles.debugText}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>

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

      {/* CAPTION */}
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
            {
              backgroundColor:
                images.length > 0 ? "#0095f6" : "#ccc",
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  debugOverlay: {
    maxHeight: 140,
    backgroundColor: "#111",
    padding: 8,
  },

  debugText: {
    color: "#00ff88",
    fontSize: 11,
    marginBottom: 2,
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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
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
    setDebugLog([]); // Clear logs for a fresh start
    addLog("1. 📸 Requesting media permission...");

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      addLog(`2. 📸 Permission result: ${permission.granted ? "GRANTED" : "DENIED"}`);

      if (!permission.granted) {
        addLog("❌ Permission not granted. Stopping.");
        Alert.alert(t("permissionRequired"));
        return;
      }

      addLog("3. 🚀 Launching Library...");
      
      // CRITICAL: Using the most compatible settings for Android APKs
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use the Enum, not a string array
        allowsMultipleSelection: true,
        quality: 0.7, // Lower quality slightly to reduce memory pressure in APK
        selectionLimit: 10,
      });

      addLog("4. 📥 Picker returned.");

      if (result.canceled) {
        addLog("⚠️ User cancelled the picker.");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        addLog(`5. 🖼️ Found ${result.assets.length} assets.`);
        const uris = result.assets.map((asset) => asset.uri);
        
        // Log the first URI to see the format (content:// vs file://)
        addLog(`6. 🔗 First URI: ${uris[0].substring(0, 30)}...`);
        
        setImages(uris);
        addLog("7. ✅ State updated with URIs.");
      } else {
        addLog("❌ No assets found in result object.");
      }

    } catch (error: any) {
      addLog(`‼️ CRASH in pickImage: ${error?.message}`);
      console.error(error);
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

      addLog(`👤 UserId: ${parsedUser.UserId} | Caption: ${caption}`);

      for (let i = 0; i < images.length; i++) {
        let imgUri = images[i];

        // 1. FORCIBLY COPY TO CACHE (Fixes content:// provider issues in APK)
        const filename = `upload-${Date.now()}-${i}.jpg`;
        const newPath = FileSystem.cacheDirectory + filename;

        addLog(`📂 Copying ${i} to: ${newPath}`);
        
        await FileSystem.copyAsync({
          from: imgUri,
          to: newPath,
        });

        // 2. ANDROID URI FIX
        // In APKs, sometimes the URI needs 'file://' and sometimes it needs the prefix removed.
        // This format is the most stable for React Native's FormData:
        const finalUri = Platform.OS === "android" ? newPath : newPath.replace("file://", "");

        formData.append("images", {
          uri: finalUri,
          name: filename,
          type: "image/jpeg",
        } as any);
        
        addLog(`✅ Appended image ${i}`);
      }

      addLog("📦 Sending POST request...");

      const response = await api.post("/api/posts/create", formData);

      addLog(`✅ Server Response: ${JSON.stringify(response.data)}`);
      Alert.alert(t("postCreated"));
      router.push("/(tabs)/profile");

    } catch (err: any) {
      addLog(`❌ ERROR: ${err?.message}`);
      if (err?.response) {
        addLog(`❌ DATA: ${JSON.stringify(err.response.data)}`);
      }
      Alert.alert(t("postError"));
    } finally {
      setLoading(false);
      addLog("🔄 Finished");
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
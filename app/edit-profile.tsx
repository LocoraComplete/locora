import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../context/languagecontext";

import * as ImagePicker from "expo-image-picker";

import api from "../config/api";
export default function EditProfile() {
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setName(parsedUser.Name || "");
        setUsername(parsedUser.Handle || "");
        setPronouns(parsedUser.Pronouns || "");
        setBio(parsedUser.Bio || "");
        setProfilePic(parsedUser.profilePic || null);
      }
    };

    loadUser();
  }, []);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(t("galleryPermission"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert(t("error"), t("userNotFoundLogin"));
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.UserId;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("pronouns", pronouns);
      formData.append("bio", bio);

      if (profilePic && !profilePic.startsWith("http")) {
      let img = profilePic;

      if (img.startsWith("content://")) {
        const newPath = FileSystem.cacheDirectory + `profile-${Date.now()}.jpg`;

        await FileSystem.copyAsync({
          from: img,
          to: newPath,
        });

        img = newPath;
      }

      const filename = img.split("/").pop() || "profile.jpg";

      formData.append("profilePic", {
        uri: img,
        name: filename,
        type: "image/jpeg",
      } as any);
    }

      const response = await api.put(
        `/api/users/update-profile/${userId}`,
        formData
      );

    const updatedUser = {
      ...parsedUser,
      ...response.data,
      profilePic: response.data.profilePic || parsedUser.profilePic,
    };

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      router.back();
    } catch (error: any) {
      console.log(
        "Update Error:",
        error?.response?.data || error
      );
      Alert.alert(
        t("error"),
        error?.response?.data?.message || t("somethingWrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{t("editProfile")}</Text>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={pickImage}
        >
          {profilePic ? (
  <Image
    source={{ uri: profilePic }}
    style={styles.profileImage} 
  />
) : (
  <View style={styles.placeholder}>
    <Text style={{ color: "#888" }}>Add Photo</Text>
  </View>
)}
        </TouchableOpacity>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{t("name")}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{t("username")}</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{t("pronouns")}</Text>
          <TextInput
            style={styles.input}
            value={pronouns}
            onChangeText={setPronouns}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{t("bio")}</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={150}
          />
          <Text style={styles.charCount}>
            {bio.length}/150
          </Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? t("saving") : t("save")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  bioInput: {
    height: 90,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 4,
    color: "#777",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
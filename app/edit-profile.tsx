import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../config/api";
import * as ImagePicker from "expo-image-picker";
export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load existing user
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

  // Pick image from gallery
  const pickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert("Permission required to access gallery");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ old syntax, works without error
  allowsEditing: true,
  quality: 0.8,
});

  if (!result.canceled) {
    setProfilePic(result.assets[0].uri);
  }
};

  const handleSave = async () => {
  try {
    setLoading(true);

    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) {
      Alert.alert("Error", "User not found. Please login again.");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.UserId;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("pronouns", pronouns);
    formData.append("bio", bio);

    if (profilePic) {
      formData.append("profilePic", {
        uri: profilePic,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    const response = await api.put(
      `/api/users/update-profile/${userId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // Update AsyncStorage
   const updatedUser = {
  ...parsedUser,
  ...response.data,
  profilePic: profilePic ?? parsedUser.profilePic,
};

    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

    // Go back to Profile screen
    router.back();
  } catch (error: any) {
    console.log("Update Error:", error?.response?.data || error);
    Alert.alert("Error", error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Edit Profile</Text>

        {/* Profile Image */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profilePic ? (
  <Image
    source={{
    uri: profilePic.startsWith("file")
  ? profilePic
  : `${api.defaults.baseURL}${profilePic}?t=${Date.now()}`, // ✅ server image
    }}
    style={styles.profileImage}
  />
) : (
  <View style={styles.placeholder}>
    <Text style={{ color: "#888" }}>Add Photo</Text>
  </View>
)}
        </TouchableOpacity>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Pronouns</Text>
          <TextInput
            style={styles.input}
            value={pronouns}
            onChangeText={setPronouns}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={150}
          />
          <Text style={styles.charCount}>{bio.length}/150</Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldContainer: {
    marginBottom: 25,
  },
  label: {
    color: "#555",
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    fontSize: 16,
    paddingVertical: 8,
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  charCount: {
    color: "#888",
    fontSize: 12,
    textAlign: "right",
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#3897f0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
}); 


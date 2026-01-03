import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileSetup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>

      {/* Profile Picture Placeholder */}
      <View style={styles.avatarContainer}>
        <Image
            source={require("../../assets/images/test.png")}
            style={styles.avatar}
        />
        <Text style={styles.changePhoto}>Add Profile Photo</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="Bio"
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.replace("/(tabs)/explore")}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5E5E5",
    marginBottom: 10,
  },
  changePhoto: {
    color: "#007AFF",
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  bioInput: {
    height: 90,
    textAlignVertical: "top",
  },
  continueButton: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

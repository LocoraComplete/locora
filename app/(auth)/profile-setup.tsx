import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileSetupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleContinue = () => {
    if (!name || !location) return;

    // Go to Explore tab after setup
    router.replace("/(tabs)/explore");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>

      {/* Profile Image */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require("@/assets/images/test.png")}
          style={styles.avatar}
        />
      </View>

      {/* Name Input */}
      <TextInput
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Location Input */}
      <TextInput
        placeholder="Your city"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

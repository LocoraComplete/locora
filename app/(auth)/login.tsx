import { useRouter } from "expo-router";
import { useState } from "react";
import api from "../../config/api";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const res = await api.post("/users/login", {
        Email: email,
        Password: password,
      });

      console.log("✅ Login response:", res.data);

      // ✅ SAVE FULL USER DATA (THIS IS IMPORTANT)
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          UserId: res.data.UserId,
          Name: res.data.Name,
          Handle: res.data.Handle, // 👈 @firstnamelastname
          Email: res.data.Email,
          Phone: res.data.Phone,
          Gender: res.data.Gender,
        })
      );

      Alert.alert("Success", `Welcome ${res.data.Name}`);

      // ✅ Move to main app
      router.replace("/community");

    } catch (error: any) {
      console.log("❌ Login error:", error);
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || "Server error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOCORA</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.signupText}>
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    color: "#007AFF",
    fontSize: 15,
  },
});

import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import api from "../../config/api";

export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !email || !password) return Alert.alert("Error", "Fill all required fields");
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords do not match");
    if (password.length < 6) return Alert.alert("Error", "Password must be 6+ chars");

    const payload = {
      Name: lastName ? `${firstName} ${lastName}` : firstName,
      Email: email.trim(),
      Password: password,
      Phone: phone.trim() || undefined,
      Gender: "Other",
    };

    try {
      setLoading(true);
      const res = await api.post("/users/register", payload);
      console.log("✅ SIGNUP RESPONSE:", res.data);
      Alert.alert("Success", "Account created!");
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.log("❌ SIGNUP ERROR:", error.response?.data || error.message);
      Alert.alert("Signup Failed", error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <TouchableOpacity style={[styles.signupButton, loading && { opacity: 0.7 }]} onPress={handleSignup} disabled={loading}>
        <Text style={styles.signupText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 10, padding: 14, marginBottom: 16 },
  signupButton: { backgroundColor: "#000", padding: 15, borderRadius: 10, alignItems: "center" },
  signupText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
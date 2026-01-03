import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login"); // Navigate to login after splash
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>LOCORA</Text>
      <Text style={styles.subtitle}>Wander • Explore • Discover</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" },
  logo: { width: 180, height: 180, marginBottom: 24 },
  title: { fontSize: 36, fontWeight: "700", color: "#000", letterSpacing: 1 },
  subtitle: { marginTop: 10, fontSize: 16, color: "#666" },
});

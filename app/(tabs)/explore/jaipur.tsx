import { Fonts } from "@/constants/theme";
import { Image, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JaipurScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Jaipur</Text>

        <Image
          source={require("@/assets/images/amber-fort.jpg")}
          style={styles.image}
        />

        <Text style={styles.description}>
          Jaipur, also known as the Pink City, is famous for its historic forts,
          palaces, and vibrant markets. Must-visit: Amber Fort, City Palace,
          Hawa Mahal, and Jal Mahal.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontFamily: Fonts.rounded || "sans-serif",
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.rounded || "sans-serif",
    lineHeight: 24,
  },
});

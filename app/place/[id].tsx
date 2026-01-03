import { useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Place() { // Default export matches Router
  const { id } = useLocalSearchParams<{ id: string }>();

  // Dummy data, can be replaced dynamically
  const place = {
    name: "Amber Fort",
    rating: 4.6,
    description:
      "Amber Fort is a historic fort located in Jaipur, Rajasthan. It is known for its artistic style and stunning architecture.",
    image: require("../../assets/images/amber-fort.jpg"),
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={place.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.rating}>⭐ {place.rating} / 5</Text>
        <Text style={styles.description}>{place.description}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text>360° View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text>Route</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  image: { width: "100%", height: 250 },
  content: { padding: 15 },
  title: { fontSize: 22, fontWeight: "bold" },
  rating: { marginVertical: 5, fontWeight: "bold" },
  description: { marginVertical: 10, color: "#555", lineHeight: 20 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    borderWidth: 1,
    borderColor: "#CCC",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});

import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const guides = [
  {
    id: 1,
    name: "Ravi Singh",
    language: "Hindi, English",
    location: "Jaipur",
    experience: "5 Years",
    photo: require("../../assets/images/guide1.jpg"),
  },
  {
    id: 2,
    name: "Meena Sharma",
    language: "Hindi, French",
    location: "Udaipur",
    experience: "7 Years",
    photo: require("../../assets/images/guide2.jpg"),
  },
];

export default function Guide() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search guides by location..."
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {guides.map((guide) => (
          <TouchableOpacity key={guide.id} style={styles.card}>
            <Image source={guide.photo} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{guide.name}</Text>
              <Text style={styles.text}>📍 {guide.location}</Text>
              <Text style={styles.text}>🗣 {guide.language}</Text>
              <Text style={styles.text}>{guide.experience} Experience</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
  },
  search: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
  info: {
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: "#555",
  },
});

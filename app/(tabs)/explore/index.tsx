import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

// Update this with your backend IP and port
const API_BASE_URL = "http://10.68.184.72:5000/api";

export default function ExploreScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"places" | "events" | "food">("places");

  const [places, setPlaces] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [food, setFood] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from backend
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const placesRes = await axios.get(`${API_BASE_URL}/places`);
      setPlaces(placesRes.data);

      const eventsRes = await axios.get(`${API_BASE_URL}/events`);
      setEvents(eventsRes.data);

      const foodRes = await axios.get(`${API_BASE_URL}/food`);
      setFood(foodRes.data);


      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const handleSearch = () => {
    if (searchText.trim().toLowerCase() === "jaipur") {
      router.push("/explore/jaipur");
    } else {
      Alert.alert("Not found", "Try typing 'Jaipur'");
    }
  };

  const getCategoryData = () => {
    if (selectedCategory === "places") return places;
    if (selectedCategory === "events") return events;
    if (selectedCategory === "food") return food;
    return [];
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        {/* Search Bar */}
        <TextInput
          placeholder="Search locations..."
          placeholderTextColor="#777"
          style={styles.searchBar}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        {/* Category Boxes */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryBox, selectedCategory === "places" && styles.categoryBoxSelected]}
            onPress={() => setSelectedCategory("places")}
          >
            <Text style={styles.categoryText}>PLACES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryBox, selectedCategory === "events" && styles.categoryBoxSelected]}
            onPress={() => setSelectedCategory("events")}
          >
            <Text style={styles.categoryText}>EVENTS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryBox, selectedCategory === "food" && styles.categoryBoxSelected]}
            onPress={() => setSelectedCategory("food")}
          >
            <Text style={styles.categoryText}>FOOD</Text>
          </TouchableOpacity>
        </View>

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>
          Recommended {selectedCategory.toUpperCase()}
        </Text>

        {/* Loading state */}
        {loading && <ActivityIndicator size="large" color="#FF5A5F" style={{ marginVertical: 20 }} />}

        {/* Error state */}
        {error ? (
          <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>{error}</Text>
        ) : (
          getCategoryData().map((item) => (
            <View key={item._id || item.id} style={styles.postCard}>
              <Image
                source={
                  item.ImageURL
                    ? { uri: item.ImageURL }
                    : require("@/assets/images/amber-fort.jpg")
                }
                style={styles.postImage}
              />
              <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.Name}</Text>
                <Text style={styles.postDescription}>{item.Description}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 18,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryBox: {
    flex: 1,
    padding: 14,
    marginHorizontal: 4,
    backgroundColor: "#ececec",
    borderRadius: 14,
    alignItems: "center",
  },
  categoryBoxSelected: {
    backgroundColor: "#FF5A5F",
  },
  categoryText: {
    fontSize: 14,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  postCard: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  postImage: {
    height: 160,
    width: "100%",
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 16,
  },
  postDescription: {
    marginTop: 4,
  },
});

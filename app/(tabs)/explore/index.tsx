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
import { API_BASE_URL } from "../../../config/api";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";
import api from "../../../config/api"; // ✅ use Axios instance

export default function ExploreScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<"places" | "events" | "food">("places");

  const [places, setPlaces] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [food, setFood] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Use api instance
        const [placesRes, eventsRes, foodRes] = await Promise.all([
          api.get("/api/places"),
          api.get("/api/events"),
          api.get("/api/food"),
        ]);

        setPlaces(Array.isArray(placesRes.data) ? placesRes.data : []);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
        setFood(Array.isArray(foodRes.data) ? foodRes.data : []);
      } catch (err: any) {
        console.error("Explore API Error:", err?.response?.data || err.message);
        setError(
          "Failed to load data. Make sure your mobile and PC are on the same WiFi and backend is running."
        );
      } finally {
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      <ScrollView style={styles.container}>
        {/* Search bar */}
        <TextInput
          placeholder="Search locations..."
          placeholderTextColor={theme === "dark" ? "#999" : "#777"}
          style={[
            styles.searchBar,
            {
              borderColor: themeColors.border,
              color: themeColors.text,
              backgroundColor: themeColors.card,
            },
          ]}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        {/* Category selector */}
        <View style={styles.categoryContainer}>
          {["places", "events", "food"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBox,
                {
                  backgroundColor:
                    selectedCategory === cat
                      ? themeColors.text
                      : themeColors.card,
                },
              ]}
              onPress={() => setSelectedCategory(cat as any)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === cat
                        ? themeColors.background
                        : themeColors.text,
                  },
                ]}
              >
                {cat.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: themeColors.text },
          ]}
        >
          Recommended {selectedCategory.toUpperCase()}
        </Text>

        {/* Loading */}
        {loading && (
          <ActivityIndicator
            size="large"
            color={themeColors.text}
            style={{ marginVertical: 20 }}
          />
        )}

        {/* Error */}
        {!loading && error ? (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginVertical: 20,
            }}
          >
            {error}
          </Text>
        ) : (
          // Display posts
          getCategoryData().map((item) => (
            <TouchableOpacity
              key={item._id || item.id}
              style={[
                styles.postCard,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.card,
                },
              ]}
             onPress={() =>
                router.push({
                  pathname: "/explore/[id]",
                  params: {
                    id: item._id,
                    name: item.Name,
                    description: item.Description,
                    image: item.ImageURL,
                  },
                })
              }
            >
              <Image
                source={
                  item.ImageURL
                    ? { uri: item.ImageURL }
                    : require("@/assets/images/amber-fort.jpg")
                }
                style={styles.postImage}
              />

              <View style={styles.postContent}>
                <Text
                  style={[
                    styles.postTitle,
                    { color: themeColors.text },
                  ]}
                >
                  {item.Name}
                </Text>

                <Text
                  style={[
                    styles.postDescription,
                    { color: themeColors.text },
                  ]}
                >
                  {item.Description}
                </Text>
              </View>
            </TouchableOpacity>
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
    borderRadius: 14,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 14,
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
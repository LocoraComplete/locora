import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { colors } from "../../../config/colors";
import { useTheme } from "../../../context/themecontext";

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

  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [filteredFood, setFilteredFood] = useState<any[]>([]);

  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [placesRes, eventsRes, foodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/places`, { timeout: 8000 }),
          axios.get(`${API_BASE_URL}/api/events`, { timeout: 8000 }),
          axios.get(`${API_BASE_URL}/api/food`, { timeout: 8000 }),
        ]);

        const p = Array.isArray(placesRes.data) ? placesRes.data : [];
        const e = Array.isArray(eventsRes.data) ? eventsRes.data : [];
        const f = Array.isArray(foodRes.data) ? foodRes.data : [];

        setPlaces(p);
        setEvents(e);
        setFood(f);

        setFilteredPlaces(p);
        setFilteredEvents(e);
        setFilteredFood(f);
      } catch (err: any) {
        setError("Failed to load data. Check backend connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fuzzyMatch = (text: string, query: string) => {
    return text.toLowerCase().includes(query.toLowerCase());
  };

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPlaces(places);
      setFilteredEvents(events);
      setFilteredFood(food);
      setNotFound(false);
      return;
    }

    const p = places.filter((item) =>
      fuzzyMatch(item.Name || "", query) ||
      fuzzyMatch(item.Location || "", query)
    );

    const e = events.filter((item) =>
      fuzzyMatch(item.Name || "", query) ||
      fuzzyMatch(item.Description || "", query)
    );

    const f = food.filter((item) =>
      fuzzyMatch(item.Name || "", query) ||
      fuzzyMatch(item.Description || "", query)
    );

    if (p.length === 0 && e.length === 0 && f.length === 0) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }

    setFilteredPlaces(p);
    setFilteredEvents(e);
    setFilteredFood(f);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      performSearch(searchText);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText, places, events, food]);

  const getCategoryData = () => {
    if (selectedCategory === "places") return filteredPlaces;
    if (selectedCategory === "events") return filteredEvents;
    if (selectedCategory === "food") return filteredFood;
    return [];
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      <ScrollView style={styles.container}>
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
        />

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

        {notFound && (
          <Text
            style={{
              textAlign: "center",
              marginBottom: 12,
              color: themeColors.text,
            }}
          >
            No Results Found
          </Text>
        )}

        {loading && (
          <ActivityIndicator
            size="large"
            color={themeColors.text}
            style={{ marginVertical: 20 }}
          />
        )}

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
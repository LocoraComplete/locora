import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../../config/api";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

const locationCache: Record<string, { lat: number; lng: number }> = {};

export default function ExploreScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;
  const { t, language } = useLanguage();

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

  const [isNearbyActive, setIsNearbyActive] = useState(false);

  // NEW: cache user location once
  const userCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [placesRes, eventsRes, foodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/places?lang=${language}`, {
            timeout: 8000,
          }),
          axios.get(`${API_BASE_URL}/api/events?lang=${language}`, {
            timeout: 8000,
          }),
          axios.get(`${API_BASE_URL}/api/food?lang=${language}`, {
            timeout: 8000,
          }),
        ]);

        const p = Array.isArray(placesRes.data) ? placesRes.data : [];
        const e = Array.isArray(eventsRes.data) ? eventsRes.data : [];
        const f = Array.isArray(foodRes.data) ? foodRes.data : [];

        setPlaces(p);
        setEvents(e);
        setFood(f);

        setFilteredPlaces(shuffleArray(p));
        setFilteredEvents(shuffleArray(e));
        setFilteredFood(shuffleArray(f));
      } catch (err: any) {
        setError(
          t("dataLoadFailed") ||
            "Failed to load data. Check backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  useFocusEffect(
    useCallback(() => {
      if (!isNearbyActive) {
        setFilteredPlaces(shuffleArray(places));
        setFilteredEvents(shuffleArray(events));
        setFilteredFood(shuffleArray(food));
      }
    }, [places, events, food, isNearbyActive])
  );

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

    const p = places.filter(
      (item) =>
        fuzzyMatch(item.Name || "", query) ||
        fuzzyMatch(item.Location || "", query)
    );

    const e = events.filter(
      (item) =>
        fuzzyMatch(item.Name || "", query) ||
        fuzzyMatch(item.Description || "", query)
    );

    const f = food.filter(
      (item) =>
        fuzzyMatch(item.Name || "", query) ||
        fuzzyMatch(item.Description || "", query)
    );

    setNotFound(p.length === 0 && e.length === 0 && f.length === 0);

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

  const getCategoryLabel = (cat: string) => {
    if (cat === "places") return t("places") || "Places";
    if (cat === "events") return t("events") || "Events";
    if (cat === "food") return t("food") || "Food";
    return cat;
  };

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationSearch = async () => {
    try {
      // instant toggle OFF
      if (isNearbyActive) {
        setIsNearbyActive(false);
        setFilteredPlaces(shuffleArray(places));
        setFilteredEvents(shuffleArray(events));
        setFilteredFood(shuffleArray(food));
        return;
      }

      setIsNearbyActive(true);

      // use cached user location
      if (!userCoordsRef.current) {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setIsNearbyActive(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        userCoordsRef.current = {
          lat: userLocation.coords.latitude,
          lng: userLocation.coords.longitude,
        };
      }

      const userLat = userCoordsRef.current.lat;
      const userLng = userCoordsRef.current.lng;

      // FAST: parallel geocoding
      const nearbyPlacesResults = await Promise.all(
        places.map(async (place) => {
          try {
            let coords;

            if (locationCache[place.Name]) {
              coords = locationCache[place.Name];
            } else {
              const geo = await Location.geocodeAsync(
                place.Location || place.Name
              );

              if (!geo.length) return null;

              coords = {
                lat: geo[0].latitude,
                lng: geo[0].longitude,
              };

              locationCache[place.Name] = coords;
            }

            const distance = getDistance(
              userLat,
              userLng,
              coords.lat,
              coords.lng
            );

            return distance <= 100 ? place : null;
          } catch {
            return null;
          }
        })
      );

      const nearbyPlaces = nearbyPlacesResults.filter(Boolean);

      if (nearbyPlaces.length === 0) {
        setFilteredPlaces([]);
        setFilteredEvents([]);
        setFilteredFood([]);
        return;
      }

      const placeIds = nearbyPlaces.map((p: any) => p.PlaceId);

      const nearbyEvents = events.filter((e) =>
        placeIds.includes(e.PlaceId)
      );

      const nearbyFood = food.filter((f) =>
        placeIds.includes(f.PlaceId)
      );

      setFilteredPlaces(nearbyPlaces);
      setFilteredEvents(nearbyEvents);
      setFilteredFood(nearbyFood);
    } catch (err) {
      console.log(err);
      setIsNearbyActive(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: themeColors.text }]}>
          LOCORA
        </Text>
      </View>

      <ScrollView style={styles.container}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}
        >
          <TextInput
            placeholder={t("searchLocations") || "Search locations..."}
            placeholderTextColor={theme === "dark" ? "#999" : "#777"}
            style={[
              styles.searchBar,
              {
                flex: 1,
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.card,
              },
            ]}
            value={searchText}
            onChangeText={setSearchText}
          />

          <TouchableOpacity
            onPress={handleLocationSearch}
            style={{ marginLeft: 10 }}
          >
            <MaterialIcons
              name="my-location"
              size={24}
              color={
                isNearbyActive
                  ? themeColors.text
                  : theme === "dark"
                  ? "#777"
                  : "#999"
              }
            />
          </TouchableOpacity>
        </View>

        {!isNearbyActive && (
          <Text
            style={{
              fontSize: 12,
              color: themeColors.text,
              opacity: 0.6,
              marginBottom: 10,
            }}
          >
            Tap location icon to find nearby places
          </Text>
        )}

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
                {getCategoryLabel(cat)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
          {isNearbyActive
            ? "📍 Nearby Results"
            : `${t("recommended") || "Recommended"} ${getCategoryLabel(
                selectedCategory
              )}`}
        </Text>

        {notFound && (
          <Text
            style={{
              textAlign: "center",
              marginBottom: 12,
              color: themeColors.text,
            }}
          >
            {t("noResults") || "No Results Found"}
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
          <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>
            {error}
          </Text>
        ) : (
          getCategoryData().map((item, index) => (
            <TouchableOpacity
              key={item._id ? item._id : `item-${index}`}
              style={[
                styles.postCard,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.card,
                },
              ]}
              onPress={() => {
                let id = "";

                if (selectedCategory === "places") id = item.PlaceId;
                if (selectedCategory === "events") id = item.EventId;
                if (selectedCategory === "food") id = item.FoodId;

                router.push({
                  pathname: "/explore/[id]",
                  params: {
                    id,
                    category: selectedCategory,
                  },
                });
              }}
            >
              <Image
                source={
                  item.ImageURL && item.ImageURL.startsWith("http")
                    ? { uri: item.ImageURL }
                    : require("@/assets/images/amber-fort.jpg")
                }
                style={styles.postImage}
              />

              <View style={styles.postContent}>
                <Text style={[styles.postTitle, { color: themeColors.text }]}>
                  {item.Name}
                </Text>

                <Text
                  style={[styles.postDescription, { color: themeColors.text }]}
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
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  logo: {
    fontSize: 35,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  container: { flex: 1, padding: 16 },
  searchBar: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
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
  categoryText: { fontSize: 14 },
  sectionTitle: { fontSize: 18, marginBottom: 12 },
  postCard: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  postImage: { height: 160, width: "100%" },
  postContent: { padding: 12 },
  postTitle: { fontSize: 16 },
  postDescription: { marginTop: 4 },
});
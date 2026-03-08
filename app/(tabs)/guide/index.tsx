import { useRouter, Stack } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";
import { useState } from "react";

const guides = [
  {
    id: "g1",
    name: "Rohan Singh",
    languages: ["Hindi", "English"],
    location: "Udaipur",
    experience: "5+",
    rating: 4.9,
    phone: "9876543210",
    email: "rohan@guide.com",
    photo: require("../../../assets/images/guide1.jpg"),
  },
  {
    id: "g2",
    name: "Meera Vyas",
    languages: ["Hindi", "Marwari", "English"],
    location: "Jodhpur",
    experience: "8+",
    rating: 5.0,
    phone: "9823456781",
    email: "meera@guide.com",
    photo: require("../../../assets/images/guide2.jpg"),
  },
  {
    id: "g3",
    name: "Vikram Shekhawat",
    languages: ["Hindi", "English", "French"],
    location: "Jaipur",
    experience: "12+",
    rating: 4.8,
    phone: "9811122233",
    email: "vikram@guide.com",
    photo: require("../../../assets/images/guide1.jpg"),
  },
];

export default function Guide() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = guides.filter((guide) => {
    const query = searchQuery.toLowerCase();

    const cityMatch = guide.location.toLowerCase().includes(query);

    const languageMatch = guide.languages.some((lang) =>
      lang.toLowerCase().includes(query)
    );

    return cityMatch || languageMatch;
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
          padding: 16,
        }}
      >
        <Text style={[styles.heading, { color: themeColors.text }]}>
          Guide Directory
        </Text>

        <TextInput
          style={[
            styles.search,
            {
              backgroundColor: themeColors.card,
              color: themeColors.text,
              borderColor: themeColors.border,
            },
          ]}
          placeholder="Search by city or language..."
          placeholderTextColor={themeColors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredGuides.map((guide) => (
            <TouchableOpacity
              key={guide.id}
              style={[
                styles.card,
                {
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                },
              ]}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/guide/detail",
                  params: {
                    id: guide.id,
                    name: guide.name,
                    location: guide.location,
                    rating: guide.rating,
                    experience: guide.experience,
                    languages: JSON.stringify(guide.languages),
                    phone: guide.phone,
                    email: guide.email,
                  },
                })
              }
            >
              <View>
                <Image source={guide.photo} style={styles.image} />
                <View style={styles.ratingTag}>
                  <Text style={styles.ratingText}>⭐ {guide.rating}</Text>
                </View>
              </View>

              <View style={styles.info}>
                <Text style={[styles.name, { color: themeColors.text }]}>
                  {guide.name}
                </Text>

                <Text
                  style={[
                    styles.tag,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  🗣 {guide.languages.join(", ")}
                </Text>

                <Text
                  style={[
                    styles.tag,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  🎖 {guide.experience} yrs Experience
                </Text>

                <View style={styles.footerRow}>
                  <Text
                    style={[
                      styles.location,
                      { color: themeColors.tertiaryText },
                    ]}
                  >
                    {guide.location}, Rajasthan
                  </Text>

                  <Text
                    style={[
                      styles.profileLink,
                      { color: themeColors.text },
                    ]}
                  >
                    Profile →
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredGuides.length === 0 && (
            <Text
              style={{
                textAlign: "center",
                marginTop: 40,
                color: themeColors.secondaryText,
                fontWeight: "600",
              }}
            >
              No guides found 
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  search: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  card: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: 16,
  },
  ratingTag: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#C97800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  tag: {
    fontSize: 12,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    fontSize: 11,
  },
  profileLink: {
    fontSize: 11,
    fontWeight: "900",
  },
});
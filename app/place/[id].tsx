import { useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";
import { colors } from "../../config/colors";

export default function Place() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = colors[theme];

  const place = {
    name: "Amber Fort",
    rating: 4.6,
    description:
      "Amber Fort is a historic fort located in Jaipur, Rajasthan. It is known for its artistic style and stunning architecture.",
    image: require("../../assets/images/amber-fort.jpg"),
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Image source={place.image} style={styles.image} />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: themeColors.text },
          ]}
        >
          {place.name}
        </Text>

        <Text
          style={[
            styles.rating,
            { color: themeColors.text },
          ]}
        >
          ⭐ {place.rating} / 5
        </Text>

        <Text
          style={[
            styles.description,
            { color: theme === "dark" ? "#bbb" : "#555" },
          ]}
        >
          {place.description}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: themeColors.border,
                backgroundColor: themeColors.card,
              },
            ]}
          >
            <Text style={{ color: themeColors.text }}>
              {t("view360") || "360° View"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: themeColors.border,
                backgroundColor: themeColors.card,
              },
            ]}
          >
            <Text style={{ color: themeColors.text }}>
              {t("route") || "Route"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: themeColors.border,
                backgroundColor: themeColors.card,
              },
            ]}
          >
            <Text style={{ color: themeColors.text }}>
              {t("chat") || "Chat"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  rating: {
    marginVertical: 5,
    fontWeight: "bold",
  },
  description: {
    marginVertical: 10,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
});
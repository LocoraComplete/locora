import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../config/colors";
import { useTheme } from "../../../context/themecontext";

export default function PostDetails() {
  const { id, name, description, image } = useLocalSearchParams();
  const router = useRouter();

  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const imageSource =
    image && typeof image === "string"
      ? { uri: image }
      : require("@/assets/images/amber-fort.jpg");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      <ScrollView>
        <Image source={imageSource} style={styles.image} />

        <View style={{ padding: 16 }}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            {name}
          </Text>

          <Text style={[styles.description, { color: themeColors.text }]}>
            {description}
          </Text>

          {/* View 360 Map Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: themeColors.text },
            ]}
            onPress={() =>
              router.push({
                pathname: "/explore/map360",
                params: { id, name },
              })
            }
          >
            <Text
              style={[
                styles.buttonText,
                { color: themeColors.background },
              ]}
            >
              View 360° Map
            </Text>
          </TouchableOpacity>

          {/* Check Distance Button */}
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor:
                  theme === "dark"
                    ? themeColors.card
                    : themeColors.border,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/explore/distance",
                params: { id, name },
              })
            }
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: themeColors.text },
              ]}
            >
              Check Distance
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 280,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "bold",
  },
});
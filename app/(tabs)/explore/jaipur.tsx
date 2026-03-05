import { Fonts } from "@/constants/theme";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";

export default function JaipurScreen() {
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text
          style={[
            styles.title,
            { color: themeColors.text },
          ]}
        >
          Jaipur
        </Text>

        <Image
          source={require("@/assets/images/amber-fort.jpg")}
          style={styles.image}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.description,
              { color: themeColors.text },
            ]}
          >
            Jaipur, also known as the Pink City, is famous for its historic
            forts, palaces, and vibrant markets.

            {"\n\n"}Must-visit attractions include Amber Fort, City Palace,
            Hawa Mahal, and Jal Mahal.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  description: {
    fontSize: 16,
    fontFamily: Fonts.rounded || "sans-serif",
    lineHeight: 24,
  },
});
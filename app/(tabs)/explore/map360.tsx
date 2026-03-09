import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useLanguage } from "../../../context/languagecontext";

export default function Map360() {
  const { name } = useLocalSearchParams();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t("view360") || "360° View for"} {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
});
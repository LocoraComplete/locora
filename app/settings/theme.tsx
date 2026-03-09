import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";
import { colors } from "../../config/colors";

type ThemeMode = "Light" | "Dark" | "System";

export default function ThemeScreen() {
  const { selectedMode, setThemeMode, theme } = useTheme();
  const { t } = useLanguage();

  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const Option = ({
    mode,
    icon,
    description,
  }: {
    mode: ThemeMode;
    icon: any;
    description: string;
  }) => {
    const isActive = selectedMode === mode;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor: isActive
              ? themeColors.card
              : themeColors.card,
            borderColor: themeColors.border,
          },
        ]}
        onPress={() => setThemeMode(mode)}
      >
        <View style={styles.left}>
          <Ionicons
            name={icon}
            size={22}
            color={themeColors.text}
            style={{ marginRight: 14 }}
          />
          <View>
            <Text
              style={[styles.title, { color: themeColors.text }]}
            >
              {t(mode.toLowerCase() as any)}
            </Text>
            <Text
              style={[
                styles.description,
                { color: themeColors.secondaryText },
              ]}
            >
              {description}
            </Text>
          </View>
        </View>

        {isActive && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color="#4F46E5"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Text
        style={[styles.heading, { color: themeColors.text }]}
      >
        {t("appearance")}
      </Text>

      <Text
        style={[
          styles.subHeading,
          { color: themeColors.secondaryText },
        ]}
      >
        {t("appearanceDesc")}
      </Text>

      <View style={{ marginTop: 30 }}>
        <Option
          mode="Light"
          icon="sunny-outline"
          description={t("lightDesc")}
        />

        <Option
          mode="Dark"
          icon="moon-outline"
          description={t("darkDesc")}
        />

        <Option
          mode="System"
          icon="phone-portrait-outline"
          description={t("systemDesc")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },
  subHeading: {
    fontSize: 15,
    marginTop: 8,
  },
  option: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    marginTop: 4,
  },
});
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/themecontext";
import { useLanguage } from "../../context/languagecontext";
import { colors } from "../../config/colors";

export default function ChangeEmergency() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const themeColors = colors[theme];

  const [emergencyNumber, setEmergencyNumber] = useState("+91");

  const handleChangeEmergency = () => {
    const numberWithoutCode = emergencyNumber.replace("+91", "");

    if (numberWithoutCode.length !== 10) {
      Alert.alert(
        t("invalidNumber") || "Invalid Number",
        t("enter10Digits") || "Please enter exactly 10 digits after +91."
      );
      return;
    }

    if (!/^\d{10}$/.test(numberWithoutCode)) {
      Alert.alert(
        t("invalidNumber") || "Invalid Number",
        t("digitsOnlyEmergency") ||
          "Emergency contact must contain only digits."
      );
      return;
    }

    Alert.alert(
      t("success") || "Success",
      t("emergencyUpdated") ||
        "Emergency contact updated successfully!"
    );
  };

  const handleChange = (text: string) => {
    if (!text.startsWith("+91")) {
      text = "+91";
    }

    setEmergencyNumber(text);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: theme === "dark" ? "#bbb" : "#555" },
        ]}
      >
        {t("emergencyContact") || "Emergency Contact"}
      </Text>

      <TextInput
        keyboardType="phone-pad"
        value={emergencyNumber}
        onChangeText={handleChange}
        style={[
          styles.input,
          {
            backgroundColor:
              theme === "dark" ? "#1c1c1e" : "#f7f7f7",
            borderColor:
              theme === "dark" ? "#333" : "#ddd",
            color: themeColors.text,
          },
        ]}
        placeholderTextColor={
          theme === "dark" ? "#888" : "#999"
        }
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              theme === "dark" ? "#fff" : "#000",
          },
        ]}
        onPress={handleChangeEmergency}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                theme === "dark" ? "#000" : "#fff",
            },
          ]}
        >
          {t("updateEmergencyContact") || "Update Emergency Contact"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
  },
});
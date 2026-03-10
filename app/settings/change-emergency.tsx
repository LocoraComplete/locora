import { API_BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

export default function ChangeEmergency() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const themeColors = colors[theme];

  const [emergencyNumber, setEmergencyNumber] = useState("+91");
  const [loading, setLoading] = useState(false);

  const handleChangeEmergency = async () => {
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

    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      const response = await fetch(
        `${API_BASE_URL}/api/users/${parsedUser.UserId}/update-emergency`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emergencyContact: emergencyNumber,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Keyboard.dismiss();

        Alert.alert(
          t("success") || "Success",
          t("emergencyUpdated") ||
            "Emergency contact updated successfully!"
        );
        setEmergencyNumber("+91");
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (error) {
      console.log("Emergency update error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string) => {
    if (!text.startsWith("+91")) {
      text = "+91";
    }

    const digits = text.replace("+91", "").replace(/\D/g, "");

    if (digits.length > 10) return;

    setEmergencyNumber("+91" + digits);
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
            opacity: loading ? 0.7 : 1,
          },
        ]}
        onPress={handleChangeEmergency}
        disabled={loading}
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
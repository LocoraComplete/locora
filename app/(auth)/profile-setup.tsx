import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";
import api from "../../config/api";
import { useLanguage } from "../../context/languagecontext";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [primaryEmergency, setPrimaryEmergency] = useState("");
  const [secondaryEmergency, setSecondaryEmergency] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setName(user.Name || "");
      }
    };
    loadUser();
  }, []);

  const handlePrimaryChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    if (digits.length <= 10) {
      setPrimaryEmergency(digits);
    }
  };

  const handleSecondaryChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    if (digits.length <= 10) {
      setSecondaryEmergency(digits);
    }
  };

  const handleContinue = async () => {
    if (!name || !location || primaryEmergency.length !== 10) {
      Alert.alert(
        t("error") || "Error",
        t("fillProfileFields") || "Please fill all required fields correctly"
      );
      return;
    }

    const formattedPrimary = `+91${primaryEmergency}`;
    const formattedSecondary =
      secondaryEmergency.length === 10
        ? `+91${secondaryEmergency}`
        : undefined;

    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    try {
      const response = await api.put(`/api/users/${user._id}/emergencyContacts`, {
        emergencyContacts: {
          primary: formattedPrimary,
          secondary: formattedSecondary,
        },
        Name: name,
        Location: location,
        profileCompleted: true,
      });

      await AsyncStorage.setItem("user", JSON.stringify(response.data));

      router.replace("/(tabs)/explore");
    } catch (err: any) {
      Alert.alert(
        t("error") || "Error",
        err?.response?.data?.message ||
          t("profileSaveFailed") ||
          "Failed to save profile. Please try again."
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: themeColors.text },
        ]}
      >
        {t("setupProfile") || "Set up your profile"}
      </Text>

      <View style={styles.avatarWrapper}>
        <Image
          source={require("@/assets/images/test.png")}
          style={styles.avatar}
        />
      </View>

      <TextInput
        placeholder={t("yourName") || "Your name"}
        placeholderTextColor={theme === "dark" ? "#888" : "#999"}
        value={name}
        onChangeText={setName}
        style={[
          styles.input,
          {
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
            color: themeColors.text,
          },
        ]}
      />

      <TextInput
        placeholder={t("yourCity") || "Your city"}
        placeholderTextColor={theme === "dark" ? "#888" : "#999"}
        value={location}
        onChangeText={setLocation}
        style={[
          styles.input,
          {
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
            color: themeColors.text,
          },
        ]}
      />

      <View
        style={[
          styles.phoneContainer,
          {
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.prefix,
            { color: themeColors.text },
          ]}
        >
          +91
        </Text>
        <TextInput
          placeholder={t("primaryEmergency") || "Primary Emergency *"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          value={primaryEmergency}
          onChangeText={handlePrimaryChange}
          keyboardType="number-pad"
          maxLength={10}
          style={[
            styles.phoneInput,
            { color: themeColors.text },
          ]}
        />
      </View>

      <View
        style={[
          styles.phoneContainer,
          {
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.prefix,
            { color: themeColors.text },
          ]}
        >
          +91
        </Text>
        <TextInput
          placeholder={t("secondaryEmergency") || "Secondary Emergency"}
          placeholderTextColor={theme === "dark" ? "#888" : "#999"}
          value={secondaryEmergency}
          onChangeText={handleSecondaryChange}
          keyboardType="number-pad"
          maxLength={10}
          style={[
            styles.phoneInput,
            { color: themeColors.text },
          ]}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              theme === "dark" ? "#ffffff" : "#000000",
          },
        ]}
        onPress={handleContinue}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                theme === "dark" ? "#000000" : "#ffffff",
            },
          ]}
        >
          {t("continue") || "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  prefix: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
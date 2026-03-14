import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../config/api";
import { colors } from "../../config/colors";
import { useLanguage } from "../../context/languagecontext";
import { useTheme } from "../../context/themecontext";

const { width, height } = Dimensions.get("window");
const BUTTON_SIZE = 65;

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const pan = useRef(new Animated.ValueXY({ x: width - 90, y: height - 220 })).current;
  const isDragging = useRef(false);

  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<any>(null);

  // ===================== SYNC OFFLINE SOS =====================
  const syncOfflineSOS = async () => {
    try {
      const storedAlerts = await AsyncStorage.getItem("offlineSOS");
      if (!storedAlerts) return;

      const alerts = JSON.parse(storedAlerts);
      if (alerts.length === 0) return;

      for (const alert of alerts) {
        try {
          await api.post("/api/sos/raise-alert", alert);
        } catch (err: any) {
          // ignore individual errors
        }
      }

      await AsyncStorage.removeItem("offlineSOS");
    } catch (error) {
      // ignore sync errors
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) syncOfflineSOS();
    });
    return () => unsubscribe();
  }, []);

  // ===================== PANRESPONDER =====================
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => isDragging.current,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        isDragging.current = false;
        pan.flattenOffset();
        let newX = (pan.x as any)._value;
        let newY = (pan.y as any)._value;
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > width - BUTTON_SIZE) newX = width - BUTTON_SIZE;
        if (newY > height - BUTTON_SIZE - 100) newY = height - BUTTON_SIZE - 100;

        Animated.spring(pan, { toValue: { x: newX, y: newY }, useNativeDriver: false }).start();
      },
    })
  ).current;

  // ===================== SOS HANDLERS =====================
  const handleSOSPress = () => {
    if (sosActive) return;

    setSosActive(true);
    setCountdown(5);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSosActive(false);
          triggerSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSosActive(false);
  };

  // ===================== TRIGGER SOS =====================
  const triggerSOS = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("User not logged in");
        return;
      }

      const user = JSON.parse(storedUser);
      const contacts: string[] = [];
      if (user.emergencyContact) contacts.push(user.emergencyContact);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;

      const alertData = { UserId: user.UserId, Latitude: latitude, Longitude: longitude };

      const net = await NetInfo.fetch();
      if (net.isConnected) {
        try {
          const res = await api.post("/api/sos/raise-alert", alertData);
          console.log("SOS saved:", res.data);
        } catch (err:any) {
          console.log("SOS API ERROR:", err.response?.data || err.message);
        }
      } else {
        const existingAlerts = await AsyncStorage.getItem("offlineSOS");
        let alerts = existingAlerts ? JSON.parse(existingAlerts) : [];
        alerts.push(alertData);
        await AsyncStorage.setItem("offlineSOS", JSON.stringify(alerts));
      }

      const message = `🚨 SOS ALERT\n\n${user.Name} needs help!\n\nLocation:\n${mapLink}\n\nSent from LOCORA`;

      if (contacts.length > 0) {
        const smsUrl =
          Platform.OS === "ios"
            ? `sms:${contacts.join(",")}&body=${encodeURIComponent(message)}`
            : `sms:${contacts.join(",")}?body=${encodeURIComponent(message)}`;

        const supported = await Linking.canOpenURL(smsUrl);
        if (supported) await Linking.openURL(smsUrl);
        else Alert.alert("Cannot open SMS app on this device");
      }

      setTimeout(() => {
        Alert.alert("🚨 SOS Sent", "Your emergency contacts have been notified", [
          { text: "Call 112", onPress: () => Linking.openURL("tel:112") },
          { text: "OK" },
        ]);
      }, 1000);
    } catch (error) {
      Alert.alert("Error triggering SOS");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Tabs
        initialRouteName="explore"
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: themeColors.card, borderTopColor: themeColors.border },
          tabBarActiveTintColor: themeColors.text,
          tabBarInactiveTintColor: themeColors.secondaryText,
        }}
      >
        <Tabs.Screen
          name="explore"
          options={{ title: t("explore") || "Explore", tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="community"
          options={{ title: t("community") || "Community", tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="chat"
          options={{ title: t("chat") || "Chat", tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="guide"
          options={{ title: t("guide") || "Guide", tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: t("profile") || "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
        />
      </Tabs>

      {sosActive && (
        <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.85)" }]}>
          <Text style={styles.countdownText}>
           {`${t("sendingSOS") || "Sending SOS in"} ${countdown}...`}
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelSOS}>
            <Text style={styles.cancelText}>{t("cancel") || "Cancel"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Animated.View {...panResponder.panHandlers} style={[styles.sosWrapper, { transform: pan.getTranslateTransform() }]}>
        <TouchableOpacity
          style={styles.sosButton}
          activeOpacity={0.8}
          onPress={handleSOSPress}
          onLongPress={() => { isDragging.current = true; }}
          delayLongPress={200}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sosWrapper: { position: "absolute", zIndex: 9999 },
  sosButton: { width: BUTTON_SIZE, height: BUTTON_SIZE, borderRadius: BUTTON_SIZE / 2, backgroundColor: "#FF3B30", justifyContent: "center", alignItems: "center", elevation: 8 },
  sosText: { color: "white", fontWeight: "bold", fontSize: 16 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", zIndex: 10000 },
  countdownText: { fontSize: 22, fontWeight: "bold", color: "white", marginBottom: 20 },
  cancelButton: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10, backgroundColor: "white" },
  cancelText: { fontSize: 16, fontWeight: "bold", color: "#FF3B30" },
});
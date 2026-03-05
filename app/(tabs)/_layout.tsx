import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
} from "react-native";
import { useTheme } from "../../context/themecontext";
import { colors } from "../../config/colors";

const { width, height } = Dimensions.get("window");
const BUTTON_SIZE = 65;

export default function TabLayout() {
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  const pan = useRef(
    new Animated.ValueXY({
      x: width - 90,
      y: height - 220,
    })
  ).current;

  const isDragging = useRef(false);

  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<any>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => isDragging.current,

      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: () => {
        isDragging.current = false;
        pan.flattenOffset();

        let newX = (pan.x as any)._value;
        let newY = (pan.y as any)._value;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > width - BUTTON_SIZE)
          newX = width - BUTTON_SIZE;
        if (newY > height - BUTTON_SIZE - 100)
          newY = height - BUTTON_SIZE - 100;

        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

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

  const triggerSOS = () => {
    Alert.alert("🚨 SOS Triggered", "Help is on the way");
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Tabs
        initialRouteName="explore"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: themeColors.card,
            borderTopColor: themeColors.border,
          },
          tabBarActiveTintColor: themeColors.text,
          tabBarInactiveTintColor: themeColors.secondaryText,
        }}
      >
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="guide"
          options={{
            title: "Guide",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* SOS Overlay */}
      {sosActive && (
        <View
          style={[
            styles.overlay,
            { backgroundColor: "rgba(0,0,0,0.85)" },
          ]}
        >
          <Text
            style={[
              styles.countdownText,
              { color: "white" },
            ]}
          >
            Sending SOS in {countdown}...
          </Text>

          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: themeColors.card },
            ]}
            onPress={cancelSOS}
          >
            <Text
              style={[
                styles.cancelText,
                { color: themeColors.danger },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sosWrapper,
          { transform: pan.getTranslateTransform() },
        ]}
      >
        <TouchableOpacity
          style={[styles.sosButton]}
          activeOpacity={0.8}
          onPress={handleSOSPress}
          onLongPress={() => {
            isDragging.current = true;
          }}
          delayLongPress={200}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sosWrapper: {
    position: "absolute",
    zIndex: 9999,
  },
  sosButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  sosText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  countdownText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
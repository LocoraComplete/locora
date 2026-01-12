import { Platform } from "react-native";

const LOCALHOST_ANDROID = "http://10.0.2.2:5000";
const LOCALHOST_IOS = "http://localhost:5000";

// Expo LAN / device IP (from .env)
const LAN_URL = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL =
  LAN_URL
    ? `${LAN_URL}/api`
    : Platform.OS === "android"
    ? `${LOCALHOST_ANDROID}/api`
    : `${LOCALHOST_IOS}/api`;

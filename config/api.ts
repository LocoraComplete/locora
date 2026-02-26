import axios from "axios";
import Constants from "expo-constants";

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://locora-backend.onrender.com";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

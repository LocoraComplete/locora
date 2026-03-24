import axios from "axios";
import Constants from "expo-constants";

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "https://locora-backend.onrender.com";
//export const API_BASE_URL = "http://10.129.68.72:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
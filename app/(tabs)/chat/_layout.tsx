import { getSocket } from "@/config/socket";
import { Stack } from "expo-router";
import { useEffect } from "react";

import { useTheme } from "../../../context/themecontext";
import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";

export default function ChatLayout() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  useEffect(() => {
    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
      console.log("🟢 Socket connected from Chat layout");
    }

    return () => {
      socket.disconnect();
      console.log("🔴 Socket disconnected from Chat layout");
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: themeColors.card,
        },
        headerTitleStyle: {
          color: themeColors.text,
        },
        headerTintColor: themeColors.text,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("chats") || "Chats",
        }}
      />

      <Stack.Screen
        name="room"
        options={{
          title: t("chatRoom") || "Chat Room",
        }}
      />
    </Stack>
  );
}
import { getSocket } from "@/config/socket";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function ChatLayout() {
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
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Chats" }}
      />
      <Stack.Screen
        name="room"
        options={{ title: "Chat Room" }}
      />
    </Stack>
  );
}

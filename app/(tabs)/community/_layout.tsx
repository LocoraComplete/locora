import { Stack } from "expo-router";

export default function CommunityStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="user-profile" />
    </Stack>
  );
}

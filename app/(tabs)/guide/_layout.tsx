import { Stack } from "expo-router";

export default function GuideLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Guides" }}
      />
      <Stack.Screen
        name="detail"
        options={{ title: "Guide Details" }}
      />
    </Stack>
  );
}

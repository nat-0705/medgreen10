import { Stack } from "expo-router";

export default function PlantDetailsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="editLocation/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

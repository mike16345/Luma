import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="goal" options={{ title: "Goal" }} />
      <Stack.Screen name="onboarding/index" options={{ title: "Start" }} />
      <Stack.Screen
        name="slip-up/index"
        options={{ title: "Log slip-up", presentation: "modal" }}
      />
      <Stack.Screen
        name="restart/index"
        options={{ title: "New chapter", presentation: "modal" }}
      />
    </Stack>
  );
}

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ThemeProvider, useTheme } from "@/theme/theme-context";

function RootStack() {
  const { colors, resolvedTheme } = useTheme();

  return (
    <>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Stack
        key={resolvedTheme}
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      >
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
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}

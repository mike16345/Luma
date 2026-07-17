import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LanguageProvider, useLanguage } from "@/i18n/language-context";
import { ThemeProvider, useTheme } from "@/theme/theme-context";

function RootStack() {
  const { colors, resolvedTheme } = useTheme();
  const { direction } = useLanguage();

  return (
    <>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Stack
        key={`${resolvedTheme}-${direction}`}
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="goal" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen
          name="slip-up/index"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="restart/index"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

import { Redirect, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  BootstrapProvider,
  useBootstrap,
} from "@/features/app-shell/bootstrap-context";
import { BootstrapLoadingScreen } from "@/features/app-shell/bootstrap-loading-screen";
import { PrivacyLockProvider } from "@/features/privacy/privacy-lock-context";
import { configureNotificationHandling } from "@/features/reminders/reminder-service";
import { LanguageProvider, useLanguage } from "@/i18n/language-context";
import { ThemeProvider, useTheme } from "@/theme/theme-context";

function RootStack() {
  const { colors, resolvedTheme } = useTheme();
  const { direction } = useLanguage();
  const pathname = usePathname();
  const { status } = useBootstrap();
  const isOnboardingRoute = pathname.startsWith("/onboarding");

  if (status === "loading") {
    return <BootstrapLoadingScreen />;
  }

  if (status === "onboarding" && !isOnboardingRoute) {
    return <Redirect href="/onboarding" />;
  }

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
        <Stack.Screen name="onboarding/success" />
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
  useEffect(() => {
    configureNotificationHandling();
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <BootstrapProvider>
            <PrivacyLockProvider>
              <RootStack />
            </PrivacyLockProvider>
          </BootstrapProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

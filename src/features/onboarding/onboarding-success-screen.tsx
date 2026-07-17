import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { gradientStyle, gradients } from "@/theme/gradients";
import {
  ONBOARDING_SUCCESS_DELAY_MS,
  OnboardingProgressButton,
} from "@/features/onboarding/onboarding-progress-button";
import { spacing } from "@/theme/spacing";
import { useTheme } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function OnboardingSuccessScreen() {
  const { colors, resolvedTheme } = useTheme();
  const router = useRouter();
  const { direction, t, textAlign } = useLanguage();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const hasContinuedRef = useRef(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    ONBOARDING_SUCCESS_DELAY_MS / 1000
  );

  const continueToHome = useCallback(() => {
    if (hasContinuedRef.current) {
      return;
    }

    hasContinuedRef.current = true;
    router.replace("/");
  }, [router]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        duration: 480,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        damping: 16,
        mass: 0.8,
        stiffness: 140,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 480,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY]);

  useEffect(() => {
    const timeout = setTimeout(continueToHome, ONBOARDING_SUCCESS_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [continueToHome]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Screen contentContainerStyle={{ justifyContent: "center" }}>
      <Animated.View
        style={{
          opacity,
          transform: [{ scale }, { translateY }],
        }}
      >
        <View
          style={{
            gap: spacing.xl,
            padding: spacing.xl,
            borderRadius: 28,
            borderCurve: "continuous",
            backgroundColor: colors.heroSurface,
            boxShadow: `0 22px 54px ${colors.shadow}`,
            ...gradientStyle(
              resolvedTheme === "dark" ? gradients.heroDark : gradients.hero
            ),
          }}
        >
          <View
            style={{
              flexDirection: getFlexDirection(direction),
              alignItems: "center",
              gap: spacing.md,
            }}
          >
            <View
              style={{
                width: 58,
                height: 58,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                borderCurve: "continuous",
                backgroundColor: colors.surfaceElevated,
              }}
            >
              <Text
                style={{
                  ...typography.title,
                  color: colors.action,
                }}
              >
                L
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...typography.label,
                  color: colors.heroTextMuted,
                  textAlign,
                  letterSpacing: 0,
                }}
              >
                {t("onboarding.successEyebrow")}
              </Text>
              <Text
                style={{
                  ...typography.bodyMedium,
                  color: colors.heroText,
                  textAlign,
                }}
              >
                {t("onboarding.successSubtitle")}
              </Text>
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text
              style={{
                ...typography.display,
                color: colors.heroText,
                textAlign,
              }}
            >
              {t("onboarding.successTitle")}
            </Text>
            <Text
              style={{
                ...typography.body,
                color: colors.heroTextMuted,
                textAlign,
              }}
            >
              {t("onboarding.successMessage")}
            </Text>
          </View>

          <OnboardingProgressButton
            label={t("onboarding.continueWithSeconds", {
              seconds: secondsRemaining,
            })}
            onPress={continueToHome}
          />
        </View>
      </Animated.View>
    </Screen>
  );
}
